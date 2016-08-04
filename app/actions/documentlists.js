import * as types from '../constants/ActionTypes'
import {constructRetrieveDocumentsUrl} from '../utils/documentsUtils'
let React = require('react-native')
let {
  Alert
} = React

function fetchDocumentsTable(url, documentlist, actionType) {
  return (dispatch, getState) => {
    dispatch(requestDocumentsTable(documentlist))
    console.log("fetchDocumentsTable:"+url)
    return fetch(url)
      .then(response => response.json())
      .then(json => {
        const nextUrl = json.ResponseData.next_href

        switch (actionType) {
          case types.CHANGE_DOCUMENTS_LIST:
            dispatch(changeDocumentsTable(json.ResponseData.DocumentsList, nextUrl, documentlist))
            break
          case types.RECEIVE_DOCUMENTS:
            dispatch(receiveDocumentsTable(json.ResponseData.DocumentsList, nextUrl, documentlist))
            break
          case types.REFRESH_DOCUMENTS_LIST:
            dispatch(refreshDocumentsTable(json.ResponseData.DocumentsList, nextUrl, documentlist))
            break
        }
      })
      .catch((error) => {
        //Actions.error({data: 'get documents faliled failed'})
        Alert('Failed to get documents')
      })
      .then((responseData) => {

        //  if (responseData.ResponseStatus == 'FAILED')
        //  {
        //    Alert('Action failed')
        //  }
      })
  }
}

export function fetchTableIfNeeded(env, sessionToken, documentlist) {
  return (dispatch, getState) => {
    const {documentlists} = getState()
    if (shouldFetchDocuments(documentlists, documentlist)) {
      const nextUrl = getNextUrl(env, sessionToken, documentlists, documentlist)
      return dispatch(fetchDocumentsTable(nextUrl, documentlist, types.RECEIVE_DOCUMENTS))
    }
  }
}

export function changeTable(env, sessionToken, documentlist) {
  return (dispatch, getState) => {
    const {documentlists} = getState()
    const url = constructRetrieveDocumentsUrl(env, sessionToken, documentlist.fId)
    return dispatch(fetchDocumentsTable(url, documentlist, types.CHANGE_DOCUMENTS_LIST))
  }
}

export function refreshTable(env, sessionToken, documentlist) {
  return (dispatch, getState) => {
    const url = constructRetrieveDocumentsUrl(env, sessionToken, documentlist.fId)
    return dispatch(fetchDocumentsTable(url, documentlist, types.REFRESH_DOCUMENTS_LIST))
  }
}

function getNextUrl(env, sessionToken, documentlists, documentlist) {

  const activeDocumentsList = documentlists[documentlist.catId]
  if (!activeDocumentsList || activeDocumentsList.nextUrl === false) {
    return constructRetrieveDocumentsUrl(env, sessionToken, documentlist.fId)
  }
  return activeDocumentsList.nextUrl
}

function changeDocumentsTable(documents, nextUrl, documentlist) {
  return {
    type: types.CHANGE_DOCUMENTS_LIST,
    nextUrl,
    name: documentlist.name,
    catId: documentlist.catId,
    fId: documentlist.fId,
    parentId: documentlist.parentId,
    parentName: documentlist.parentName,
    documents
  }
}

function receiveDocumentsTable(documents, nextUrl, documentlist) {

  return {
    type: types.RECEIVE_DOCUMENTS,
    nextUrl,
    catId: documentlist.catId,
    documents
  }
}

function refreshDocumentsTable(documents, nextUrl, documentlist) {

  return {
    type: types.REFRESH_DOCUMENTS_LIST,
    nextUrl,
    catId: documentlist.catId,
    documents
  }
}

function requestDocumentsTable(documentlist) {
  console.log(requestDocumentsTable+types.REQUEST_DOCUMENTS)
  return {
    type: types.REQUEST_DOCUMENTS,
    catId: documentlist.catId
  }
}

function shouldFetchDocuments(documentlists, documentlist) {
  const activeDocumentsList = documentlists[documentlist.catId]
  if (!activeDocumentsList || !activeDocumentsList.isFetching && (activeDocumentsList.nextUrl !== null) && (activeDocumentsList.nextUrl !== "")) {
    return true
  }

  return false
}

