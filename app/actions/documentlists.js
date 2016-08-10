import * as types from '../constants/ActionTypes'
import {constructRetrieveDocumentsUrl} from '../utils/documentsUtils'
let React = require('react-native')
let {
  Alert
} = React

function fetchDocumentsTable(url: string, documentlist: Object, actionType: string) {
  console.log("fetchDocumentsTable: "+url)
  return (dispatch, getState) => {
    dispatch(requestDocumentsList(documentlist))
    return fetch(url)
      .then(response => response.json())
      .then(json => {
        const nextUrl = json.ResponseData.next_href
        if (json.ResponseData.ResponseStatus == "FAILED") {
          dispatch(failedToFetchDocumentsList(documentlist, url, json.ResponseData.ErrorMessage))
        }
        else {
          switch (actionType) {
            case types.CHANGE_DOCUMENTS_LIST:
              dispatch(changeDocumentsList(json.ResponseData.DocumentsList, nextUrl, documentlist))
              break
            case types.RECEIVE_DOCUMENTS:
              dispatch(receiveDocumentsList(json.ResponseData.DocumentsList, nextUrl, documentlist))
              break
            case types.REFRESH_DOCUMENTS_LIST:
              dispatch(refreshDocumentsList(json.ResponseData.DocumentsList, nextUrl, documentlist))
              break
          }
        }


      })
      .catch((error) => {
        dispatch(failedToFetchDocumentsList(documentlist, url, "Failed to retrieve documents"))
      })
  }
}

export function fetchTableIfNeeded(env:string, sessionToken:string, documentlist: Object) {
  return (dispatch, getState) => {
    const {documentlists} = getState()
    if (shouldFetchDocuments(documentlists, documentlist)) {
      const nextUrl = getNextUrl(env, sessionToken, documentlists, documentlist)
      return dispatch(fetchDocumentsTable(nextUrl, documentlist, types.RECEIVE_DOCUMENTS))
    }
  }
}

export function changeTable(env:string, sessionToken:string, documentlist:Object) {
  return (dispatch, getState) => {
    const {documentlists} = getState()
    const url = constructRetrieveDocumentsUrl(env, sessionToken, documentlist.fId, documentlist.sortBy, documentlist.sortDirection)
    return dispatch(fetchDocumentsTable(url, documentlist, types.CHANGE_DOCUMENTS_LIST))
  }
}

export function refreshTable(env:string, sessionToken:string, documentlist:Object) {
  return (dispatch, getState) => {
    const url = constructRetrieveDocumentsUrl(env, sessionToken, documentlist.fId, documentlist.sortBy, documentlist.sortDirection)
    return dispatch(fetchDocumentsTable(url, documentlist, types.REFRESH_DOCUMENTS_LIST))
  }
}

function getNextUrl(env:string, sessionToken:string ,documentlists:Object, documentlist:Object) {

  const activeDocumentsList = documentlists[documentlist.catId]
  if (!activeDocumentsList || activeDocumentsList.nextUrl === false) {
    return constructRetrieveDocumentsUrl(env, sessionToken, documentlist.fId, documentlist.sortBy, documentlist.sortDirection)
  }
  return activeDocumentsList.nextUrl
}

function changeDocumentsList(documents:Object, nextUrl:string, documentlist:Object) {
  return {
    type: types.CHANGE_DOCUMENTS_LIST,
    nextUrl,
    name: documentlist.name,
    catId: documentlist.catId,
    fId: documentlist.fId,
    documents
  }
}

function receiveDocumentsList(documents:Object, nextUrl:string, documentlist:Object) {

  return {
    type: types.RECEIVE_DOCUMENTS,
    nextUrl,
    catId: documentlist.catId,
    documents
  }
}

function refreshDocumentsList(documents:Object, nextUrl:string, documentlist:Object) {

  return {
    type: types.REFRESH_DOCUMENTS_LIST,
    nextUrl,
    catId: documentlist.catId,
    documents
  }
}

function failedToFetchDocumentsList(documentlist:Object,url:string, errorMessage:string) {
  return {
    type: types.SUBMIT_ERROR,
    catId: documentlist.catId,
    errorMessage:errorMessage,
    nextUrl :url
  }
}

function requestDocumentsList(documentlist:Object) {
  console.log(requestDocumentsList+types.REQUEST_DOCUMENTS)
  return {
    type: types.REQUEST_DOCUMENTS,
    catId: documentlist.catId
  }
}

function shouldFetchDocuments(documentlists:Object, documentlist:Object) {
  const activeDocumentsList = documentlists[documentlist.catId]
  if (!activeDocumentsList || !activeDocumentsList.isFetching && (activeDocumentsList.nextUrl !== null) && (activeDocumentsList.nextUrl !== "")) {
    return true
  }

  return false
}

