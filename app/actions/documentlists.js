import * as types from '../constants/ActionTypes'
import {constructRetrieveDocumentsUrl, getCreateFolderUrl} from '../utils/documentsUtils'
import _ from "lodash";
let React = require('react-native')
let {
  Alert,
  ListView
} = React

function fetchDocumentsTable(url: string, documentlist: Object, actionType: string) {
  console.log("fetchDocumentsTable: " + url)
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
          var prevState = getState();
          var items,
            totalDocuments,
            dataBlob = {},
            sectionIDs = [],
            rowIDs = [],
            foldersSection,
            docuemntsSection,
            folders,
            documents,
            i,
            j;

          totalDocuments = json.ResponseData.TotalDocuments;
          if (actionType == types.RECEIVE_DOCUMENTS) {
            items = [...prevState.documentlists[documentlist.catId].items, ...json.ResponseData.DocumentsList]
          }
          else {
            items = [...json.ResponseData.DocumentsList]
          }
          folders = _.filter(items, function (o) { return o.FamilyCode == 'FOLDER'; });
          documents = _.filter(items, function (o) { return o.FamilyCode != 'FOLDER'; });

          var sortBarTitle = `Folders`

          dataBlob["ID1"] = `Folders (${folders.length})`
          dataBlob["ID2"] = `Files (${totalDocuments})`

          sectionIDs[0] = "ID1";
          sectionIDs[1] = "ID2";

          rowIDs[0] = [];
          for (j = 0; j < folders.length; j++) {
            folder = folders[j];
            // Add Unique Row ID to RowID Array for Section
            rowIDs[0].push(folder.Id);

            // Set Value for unique Section+Row Identifier that will be retrieved by getRowData
            dataBlob['ID1:' + folder.Id] = folder;
          }

          rowIDs[1] = [];
          for (j = 0; j < documents.length; j++) {
            document = documents[j];
            // Add Unique Row ID to RowID Array for Section
            rowIDs[1].push(document.Id);

            // Set Value for unique Section+Row Identifier that will be retrieved by getRowData
            dataBlob['ID2:' + document.Id] = document;
          }

          var getSectionData = (dataBlob, sectionID) => {
            return dataBlob[sectionID];
          }

          var getRowData = (dataBlob, sectionID, rowID) => {
            return dataBlob[sectionID + ':' + rowID];
          }

          let ds = new ListView.DataSource({
            getSectionData: getSectionData,
            getRowData: getRowData,
            rowHasChanged: (row1, row2) => row1 !== row2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2
          })
          let dataSource = ds.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs)

          switch (actionType) {
            case types.CHANGE_DOCUMENTS_LIST:
              dispatch(changeDocumentsList(items, nextUrl, documentlist, dataSource))
              break
            case types.RECEIVE_DOCUMENTS:
              dispatch(receiveDocumentsList(items, nextUrl, documentlist, dataSource))
              break
            case types.REFRESH_DOCUMENTS_LIST:
              dispatch(refreshDocumentsList(items, nextUrl, documentlist, dataSource))
              break
          }
        }
      })
      .catch((error) => {
        console.log("error:" + JSON.stringify(error))
        dispatch(failedToFetchDocumentsList(documentlist, url, "Failed to retrieve documents"))
      })
  }
}

export function fetchTableIfNeeded(documentlist: Object) {
  return (dispatch, getState) => {
    const {documentlists} = getState()
    if (shouldFetchDocuments(documentlists, documentlist)) {
      const nextUrl = getNextUrl(getState().accessReducer.env, getState().accessReducer.sessionToken, documentlists, documentlist)
      return dispatch(fetchDocumentsTable(nextUrl, documentlist, types.RECEIVE_DOCUMENTS))
    }
  }
}

export function changeTable(documentlist: Object) {
  return (dispatch, getState) => {
    const {documentlists} = getState()
    const url = constructRetrieveDocumentsUrl(getState().accessReducer.env, getState().accessReducer.sessionToken, documentlist.fId, documentlist.sortBy, documentlist.sortDirection)
    return dispatch(fetchDocumentsTable(url, documentlist, types.CHANGE_DOCUMENTS_LIST))
  }
}

export function refreshTable(documentlist: Object) {
  return (dispatch, getState) => {
    const url = constructRetrieveDocumentsUrl(getState().accessReducer.env, getState().accessReducer.sessionToken, documentlist.fId, documentlist.sortBy, documentlist.sortDirection)
    return dispatch(fetchDocumentsTable(url, documentlist, types.REFRESH_DOCUMENTS_LIST))
  }
}

function getNextUrl(env: string, sessionToken: string, documentlists: Object, documentlist: Object) {

  const activeDocumentsList = documentlists[documentlist.catId]
  if (!activeDocumentsList || activeDocumentsList.nextUrl === false) {
    return constructRetrieveDocumentsUrl(env, sessionToken, documentlist.fId, documentlist.sortBy, documentlist.sortDirection)
  }
  return activeDocumentsList.nextUrl
}

function changeDocumentsList(documents: Object, nextUrl: string, documentlist: Object, dataSource: Object) {
  return {
    type: types.CHANGE_DOCUMENTS_LIST,
    nextUrl,
    name: documentlist.name,
    catId: documentlist.catId,
    fId: documentlist.fId,
    documents,
    dataSource
  }
}

function receiveDocumentsList(documents: Object, nextUrl: string, documentlist: Object, dataSource: Object) {

  return {
    type: types.RECEIVE_DOCUMENTS,
    nextUrl,
    catId: documentlist.catId,
    documents,
    dataSource
  }
}

function refreshDocumentsList(documents: Object, nextUrl: string, documentlist: Object, dataSource: Object) {

  return {
    type: types.REFRESH_DOCUMENTS_LIST,
    nextUrl,
    catId: documentlist.catId,
    documents, 
    dataSource,
  }
}
function UpdateCreateingFolderState(creating : int) {

  return {
    type : types.REQUEST_CREATE_FOLDER,
    creatingFolder : creating
  }
}



function failedToFetchDocumentsList(documentlist: Object, url: string, errorMessage: string) {
  return {
    type: types.SUBMIT_ERROR,
    catId: documentlist.catId,
    errorMessage: errorMessage,
    nextUrl: url
  }
}

function requestDocumentsList(documentlist: Object) {
  return {
    type: types.REQUEST_DOCUMENTS,
    catId: documentlist.catId
  }
}

function shouldFetchDocuments(documentlists: Object, documentlist: Object) {
  const activeDocumentsList = documentlists[documentlist.catId]
  if (!activeDocumentsList || !activeDocumentsList.isFetching && (activeDocumentsList.nextUrl !== null) && (activeDocumentsList.nextUrl !== "")) {
    return true
  }

  return false
}


function SubmitError( errorMessage: string) {
  return {
    type: types.SUBMIT_ERROR,
    errorMessage: ""
  }
}

export function createFolder(folderName: string){

return (dispatch, getState) => {
   var documentlist =  getState().documentlist;
    const {sessionToken, env} = getState().accessReducer; 
    const {folderId} = documentlist.fId; 
    const createFolderUrl = getCreateFolderUrl(env, sessionToken, documentlist.fId, folderName);
    dispatch(UpdateCreateingFolderState(1))
    return fetch(createFolderUrl)
      .then(response => response.json())
      .then(json => {
        if (json.ResponseData.ResponseStatus == "FAILED") {
         // dispatch(failedToFetchDocumentsList(documentlist, "", json.ResponseData.ErrorMessage))
           dispatch(SubmitError(json.ResponseData.ErrorMessage))
           dispatch(UpdateCreateingFolderState(0))
        }
        else {
             dispatch(UpdateCreateingFolderState(2))
            dispatch(refreshTable(documentlist))    
           
        }
      })
      .catch((error) => {
         dispatch(SubmitError("Failed to retrieve documents"))
         dispatch(UpdateCreateingFolderState(0))
      })
  }
}



