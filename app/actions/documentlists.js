import * as types from '../constants/ActionTypes'
import * as navActions from '../actions/navActions'
import * as Access from '../actions/Access'
import {constructRetrieveDocumentsUrl, constructRetrieveStatisticsUrl, getCreateFolderUrl,
  getDownloadFileUrl, getDocumentsContext, getUploadFileCompletedUrl,
   getDeleteAssetUrl, getDeleteFolderUrl,getSelectedDocument,getShareDocumentUrl, getDocumentPermissionsUrl} from '../utils/documentsUtils'
import * as routes from '../constants/routes'
import _ from "lodash";
const Android_Download_Path = '/storage/emulated/0/download';
let React = require('react-native')

let {
  Alert,
  ListView
} = React

export function updateIsFetching(isFetching: boolean){
    return {
        type: types.UPDATE_IS_FETCHING, 
        isFetching
    }
}

export function getDocumentPermissions(documentId:string, familyCode:string) {
  return (dispatch, getState) => {
    const {sessionToken, env} = getState().accessReducer; 
    dispatch(updateIsFetching(true))
    var url = getDocumentPermissionsUrl(env,sessionToken, documentId, familyCode);
    return fetch(url)
      .then(response => response.json())
      .then(json => {
        if (json.ResponseData.ResponseStatus == "FAILED") {
           dispatch(navActions.emitError(json.ResponseData.ErrorMessage,'error details'))
           dispatch(navActions.emitError(json.ResponseData.ErrorMessage,""))
        }
        else {
          var permissions = json.ResponseData.DocumentPermissions;
          dispatch(updateSelectedObject(documentId, familyCode, permissions))
        }
      })
      .catch((error) => {
        console.log("error:" + JSON.stringify(error))
        //dispatch(failedToFetchDocumentsList(documentlist, url, "Failed to retrieve documents"))
        dispatch(navActions.emitError("Failed to get document permissions",""))
      })
  }
}

function fetchDocumentsTable(url: string, documentlist: Object, actionType: string) {
  return (dispatch, getState) => {
    dispatch(requestDocumentsList(documentlist))
    return fetch(url)
      .then(response => response.json())
      .then(json => {
        const nextUrl = json.ResponseData.next_href
        if (json.ResponseData.ResponseStatus == "FAILED") {
          //dispatch(failedToFetchDocumentsList(documentlist, url, json.ResponseData.ErrorMessage))
           dispatch(navActions.emitError(json.ResponseData.ErrorMessage,'error details'))
           dispatch(navActions.emitError(json.ResponseData.ErrorMessage,""))
        }
        else {
          var prevState = getState();
          var items,
            totalFiles,
            dataBlob = {},
            sectionIDs = [],
            rowIDs = [],
            foldersSection,
            docuemntsSection,
            folders,
            documents,
            i,
            j;

         var totalFiles = json.ResponseData.TotalFiles;
         var totalFolders = json.ResponseData.TotalFolders;
         
          if (actionType == types.RECEIVE_DOCUMENTS) {
            items = [...prevState.documentlists[documentlist.catId].items, ...json.ResponseData.DocumentsList]
          }
          else {
            items = [...json.ResponseData.DocumentsList]
          }
          
          folders = _.filter(items, function (o) { return o.FamilyCode == 'FOLDER'; });
          documents = _.filter(items, function (o) { return o.FamilyCode != 'FOLDER'; });

          var sortBarTitle = `Folders`
          if(totalFolders > 0 && totalFiles > 0)
          {
            dataBlob["ID1"] = `Folders (${totalFolders})`
            dataBlob["ID2"] = `Files (${totalFiles})`
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
          }
          else if(totalFolders > 0)
          {
             dataBlob["ID1"] = `Folders (${totalFolders})`
            sectionIDs[0] = "ID1";
              rowIDs[0] = [];
              for (j = 0; j < folders.length; j++) {
                folder = folders[j];
                // Add Unique Row ID to RowID Array for Section
                rowIDs[0].push(folder.Id);

                // Set Value for unique Section+Row Identifier that will be retrieved by getRowData
                dataBlob['ID1:' + folder.Id] = folder;
              }
          }
          else if(totalFiles > 0)
          {
             dataBlob["ID1"] = `Files (${totalFiles})`
             sectionIDs[0] = "ID1";
              rowIDs[0] = [];
              for (j = 0; j < documents.length; j++) {
                document = documents[j];
                // Add Unique Row ID to RowID Array for Section
                rowIDs[0].push(document.Id);

                // Set Value for unique Section+Row Identifier that will be retrieved by getRowData
                dataBlob['ID1:' + document.Id] = document;
              }
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
        //dispatch(failedToFetchDocumentsList(documentlist, url, "Failed to retrieve documents"))
        dispatch(navActions.emitError("Failed to retrieve documents",""))


      })
  }
}


export function fetchTableIfNeeded() {
  return (dispatch, getState) => {
   
    var documentlist = getDocumentsContext(getState().navReducer);
    const {documentlists} = getState()
    //  console.log("fetchTableIfNeeded "+shouldFetchDocuments(documentlists, documentlist))
    if (shouldFetchDocuments(documentlists, documentlist)) {
      const nextUrl = getNextUrl(getState().accessReducer.env, getState().accessReducer.sessionToken, documentlists, documentlist)
      return dispatch(fetchDocumentsTable(nextUrl, documentlist, types.RECEIVE_DOCUMENTS))
    }
  }
}
export function refreshTable(documentlist: Object) {
  return (dispatch, getState) => {
    const url = constructRetrieveDocumentsUrl(getState().accessReducer.env, getState().accessReducer.sessionToken, documentlist.fId, documentlist.sortBy, documentlist.sortDirection, documentlist.catId)
     dispatch(navActions.updateRouteData(documentlist))
    return dispatch(fetchDocumentsTable(url, documentlist, types.REFRESH_DOCUMENTS_LIST))
  }
}

export function clearDocumentlists() {
  return {
    type: types.CLEAR_DOCUMENTS
  }
}
function getNextUrl(env: string, sessionToken: string, documentlists: Object, documentlist: Object) {

  const activeDocumentsList = documentlists[documentlist.catId]
  if (!activeDocumentsList || activeDocumentsList.nextUrl === false) {
    return constructRetrieveDocumentsUrl(env, sessionToken, documentlist.fId, documentlist.sortBy, documentlist.sortDirection,documentlist.catId)
  }
  return activeDocumentsList.nextUrl
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
export function UpdateCreateingFolderState(creating : int) {

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

export function updateSelectedObject(id: string, familyCode:string, permissions:object){

   return {
      type: types.UPDATE_SELECTED_OBJECT,
      selectedObject: {
        id:id,
        familyCode:familyCode,
        permissions:permissions
      }
    }
}


export function createFolder(folderName: string, isVault: boolean){

return (dispatch, getState) => {
   var documentlist = getDocumentsContext(getState().navReducer);
    const {sessionToken, env} = getState().accessReducer; 
    const folderId = documentlist.fId; 
    const createFolderUrl = getCreateFolderUrl(env, sessionToken, documentlist.fId, folderName, isVault);
    dispatch(UpdateCreateingFolderState(1))
    return fetch(createFolderUrl)
      .then(response => response.json())
      .then(json => {
        if (json.ResponseData.ResponseStatus == "FAILED") {
         // dispatch(failedToFetchDocumentsList(documentlist, "", json.ResponseData.ErrorMessage))
           

           dispatch(UpdateCreateingFolderState(2))

           dispatch(navActions.emitError("Error creating new folder"))
        }
        else {
             dispatch(UpdateCreateingFolderState(2))
             dispatch(refreshTable(documentlist))    
             dispatch(Access.retrieveStatistics());
        }
        
      })
      .catch((error) => {
         dispatch(navActions.emitError("Error creating new folder"))
         dispatch(UpdateCreateingFolderState(0))
      })
  }
}



export function downloadDocument(id: string, fileName: string){
   return (dispatch, getState) => {
        dispatch(updateIsFetching(true)); 
        const url = getDownloadFileUrl(getState().accessReducer.env, getState().accessReducer.sessionToken, id);
         fetch(url)
            .then(response => response.json())
            .then(json => {
                  const downloadUrl = json.ResponseData.AccessUrl; 

                   if (Platform.OS === 'ios')
                        downloadpath =RNFS.DocumentDirectoryPath;
                   else
                        downloadpath = Android_Download_Path;

                  const filePath = downloadpath + "/" + fileName;
                    consloe.log('downloadUrl = ' + downloadUrl)
                    RNFS.downloadFile({ fromUrl: downloadUrl, toFile: filePath}).then(res => {
                          alert('OK');
                    }).catch(err => alert(err));

                dispatch(updateIsFetching(false)); 
              
              }).catch((error) => {
                              alert("error:" + JSON.stringify(error))
                              
                          }).done();
        }
}
 


export function uploadToKenesto(imageData: object, url: string){

  return (dispatch, getState) => {

          dispatch(updateIsFetching(true)); 

           fetch(url)
            .then(response => response.json())
            .then(json => {
             
              if (json.ResponseData.ResponseStatus == "FAILED") {
               //   alert(failed)
                // dispatch(emitError(json.ResponseData.ErrorMessage,'error details'))
                 dispatch(emitError(json.ResponseData.ErrorMessage,""))
              }
              else {
              var AccessUrl = json.ResponseData.AccessUrl;
                      
                      var request = new Request(AccessUrl, {
                        method: 'PUT', 
                        mode: 'cors', 
                        redirect: 'follow',
                        processData: false,
                        cache: false,
                        headers: new Headers({
                          'Content-Type': 'multipart/form-data'
                        }),
                         body:  imageData
                      });
                                  
                      fetch(request).then(response => {
                          
                          const completeUrl = getUploadFileCompletedUrl(getState().accessReducer.env, getState().accessReducer.sessionToken, AccessUrl);

                              alert(JSON.stringify(response))

                          fetch(completeUrl)
                                .then(response => response.json())
                                .then(json => {
                                  dispatch(updateIsFetching(false)); 

                                  if (json.ResponseData.ResponseStatus == "FAILED") {
                                    dispatch(emitError(json.ResponseData.ErrorMessage,""))
                                  }
                                  else {
                                    alert('wawa');
                                  }
                                })
                                .catch((error) => {
                                  console.log("error:" + JSON.stringify(error))
                                  dispatch(emitError("Failed to retrieve statistics",""))


                                })





                      }).catch((error) => {
                              console.log("error:" + JSON.stringify(error))
                              dispatch(emitError("Failed to upload to kenesto",""))
                          }).done();
      
                          
              }
            })
            .catch((error) => {
              //console.log("error:" + JSON.stringify(error))
              dispatch(emitError("Failed to upload file to kenesto",""))


            })
  }

}

// getDeleteFolderUrl
export function deleteAsset(id: string, familyCode: string){
   return (dispatch, getState) => {
        dispatch(updateIsFetching(true)); 

        const url = getDeleteAssetUrl(getState().accessReducer.env, getState().accessReducer.sessionToken, id, familyCode);

            return fetch(url)
                .then(response => response.json())
                .then(json => {
                   dispatch(updateIsFetching(false)); 
                  if (json.ResponseStatus == "FAILED") {


                      dispatch(navActions.emitToast("error", "", "Error deleting asset"))
                  }
                  else {
                        dispatch(navActions.emitToast("success", "", "successfully deleted the asset"))
                         var documentlist = getDocumentsContext(getState().navReducer);
                         dispatch(refreshTable(documentlist))    
                         dispatch(navActions.clearToast());
                        
                    }
      })
      .catch((error) => {
          dispatch(navActions.emitToast("error", "", "Error deleting asset"))
      })

   }
}

export function deleteFolder(id: string){
   return (dispatch, getState) => {
        dispatch(updateIsFetching(true)); 

        const url = getDeleteFolderUrl(getState().accessReducer.env, getState().accessReducer.sessionToken, id);

            return fetch(url)
                .then(response => response.json())
                .then(json => {
                   dispatch(updateIsFetching(false)); 
                  if (json.ResponseStatus == "FAILED") {
                      dispatch(navActions.emitToast("error", "", "Error deleting folder"))
                  }
                  else {
                        dispatch(navActions.emitToast("success", "", "successfully deleted the folder"))
                         var documentlist = getDocumentsContext(getState().navReducer);
                         dispatch(refreshTable(documentlist))    
                         dispatch(navActions.clearToast());
                    }
      })
      .catch((error) => {
          // dispatch(navActions.emitToast("error",error, "Error deleting folder"))
      })

   }
}



export function SetSharingPermissions(tags: object){

    var permissions = []; 
     tags.map((t) => (
      permissions.push({ParticipantUniqueID: t.tagID, FamilyCode: t.aditionalData, AccessLinkID: '00000000-0000-0000-0000-000000000000', 
       ForUpdate: "true",  PermissionTypeValue : 'VIEW_ONLY', AllowShare: "false",  AllowUpload: "false" })
      ))
      
       return {
            type: types.SET_SHARING_PERMISSIONS,
            sharingPermissions : permissions
        }
  
   
}


export function UpdateDocumentSharingPermission(){
  return (dispatch, getState) => {
      const documentLists = getState().documentlists; 
      const navReducer = getState().navReducer;
      const document = getSelectedDocument(documentLists, navReducer);
      const triggerSelectedValue = navReducer.triggerSelectedValue;
      const uersDetails = getState().navReducer.clickedTrigger.split('_');
      const ParticipantUniqueID = uersDetails[1];
      const familyCode = uersDetails[2];
      var sharingPermissions = []; 
      sharingPermissions.push({ParticipantUniqueID: ParticipantUniqueID, FamilyCode: familyCode, AccessLinkID: '00000000-0000-0000-0000-000000000000', 
       ForUpdate: "true",  PermissionTypeValue : triggerSelectedValue, AllowShare: "false",  AllowUpload: "false" }); 

       const sharingObject = { asset: {
          ID: document.Id, 
          UsersPermissions : sharingPermissions
          }
      }

        const url = getShareDocumentUrl(getState().accessReducer.env, getState().accessReducer.sessionToken);

          
                      var request = new Request(url, {
                        method: 'post', 
                        mode: 'cors', 
                        redirect: 'follow',
                        processData: false,
                        cache: false,
                        headers: new Headers({
                          'Content-Type': 'application/json'
                        }),
                         body:  JSON.stringify(sharingObject)
                      });
                                  
                      fetch(request).then(response => {
                          
                        
                         //     alert(JSON.stringify(response))

                      }).catch((error) => {
                              dispatch(emitError("Failed to share object",""))
                          }).done();

    

    }
}


export function ShareDocument(){

   return (dispatch, getState) => {
      const documentLists = getState().documentlists; 
      const navReducer = getState().navReducer;
      var document = getSelectedDocument(documentLists, navReducer); 
      const addPeopleTriggerValue = getState().navReducer.addPeopleTriggerValue; 
      const sharingPermissions = documentLists.sharingPermissions; 

     
     for (var i=0; i< sharingPermissions.length; i++){
        sharingPermissions[i].PermissionTypeValue = addPeopleTriggerValue;
     }

      const sharingObject = { asset: {
          ID: document.Id, 
          UsersPermissions : sharingPermissions
          }
      }

      const url = getShareDocumentUrl(getState().accessReducer.env, getState().accessReducer.sessionToken);

          
                      var request = new Request(url, {
                        method: 'post', 
                        mode: 'cors', 
                        redirect: 'follow',
                        processData: false,
                        cache: false,
                        headers: new Headers({
                          'Content-Type': 'application/json'
                        }),
                         body:  JSON.stringify(sharingObject)
                      });
                                  
                      fetch(request).then(response => {
                          
                        
                    //          alert(JSON.stringify(response))

                      }).catch((error) => {
                              dispatch(emitError("Failed to share object",""))
                          }).done();
   }
 
} 