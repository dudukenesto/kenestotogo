import * as types from '../constants/ActionTypes'
import * as navActions from '../actions/navActions'
import * as Access from '../actions/Access'
import * as peopleActions from '../actions/peopleActions'
import {writeToLog} from '../utils/ObjectUtils'
import * as constans from '../constants/GlobalConstans'
import {
  constructRetrieveDocumentsUrl, constructRetrieveStatisticsUrl, getCreateFolderUrl,
  getDownloadFileUrl, getDocumentsContext, getUploadFileCompletedUrl,
  getDeleteAssetUrl, getDeleteFolderUrl, getSelectedDocument, getShareDocumentUrl,
  getDocumentPermissionsUrl, getCheckOutDocumentUrl, getCheckInDocumentUrl, getEditFolderUrl, getEditDocumentUrl, getDiscardCheckOutDocumentUrl
} from '../utils/documentsUtils'
import * as routes from '../constants/routes'
import _ from "lodash";
const Android_Download_Path = '/storage/emulated/0/download';
let React = require('react-native')
import RNFetchBlob from 'react-native-fetch-blob'

const android = RNFetchBlob.android
let {
  Alert,
  Platform,
  ListView
} = React

export function updateIsFetching(isFetching: boolean) {
  return {
    type: types.UPDATE_IS_FETCHING,
    isFetching
  }
}

export function updateIsFetchingSelectedObject(isFetching: boolean) {
  return {
    type: types.UPDATE_IS_FETCHING_SELECTED_OBJECT,
    isFetchingSelectedObject:isFetching
  }
}

export function getDocumentPermissions(documentId: string, familyCode: string) {
  return (dispatch, getState) => {
    const {sessionToken, env} = getState().accessReducer;
    dispatch(updateIsFetchingSelectedObject(true))
    var url = getDocumentPermissionsUrl(env, sessionToken, documentId, familyCode);
    writeToLog(env, sessionToken, constans.DEBUG, `function getDocumentPermissions - url: ${url}`)
    return fetch(url)
      .then(response => response.json())
      .then(json => {
        if (json.ResponseStatus == "FAILED") {
          dispatch(navActions.emitError(json.ErrorMessage, 'error details'))
          dispatch(navActions.emitError(json.ErrorMessage, ""))
          dispatch(updateIsFetchingSelectedObject(false))
          writeToLog(env, sessionToken, constans.ERROR, `function getDocumentPermissions - error details- url: ${url}`)
        }
        else {
          var permissions = json.ResponseData.ObjectPermissions;
          dispatch(updateSelectedObject(documentId, familyCode, permissions))
          dispatch(updateIsFetchingSelectedObject(false))
        }
      })
      .catch((error) => {
        console.log("error:" + JSON.stringify(error))
        //dispatch(failedToFetchDocumentsList(documentlist, url, "Failed to retrieve documents"))
        dispatch(navActions.emitError("Failed to get document permissions", ""))
        dispatch(updateIsFetchingSelectedObject(false))
        writeToLog(env, sessionToken, constans.ERROR, `function getDocumentPermissions - Failed to get document permissions , url: ${url}`,error)
      })
  }
}

function fetchDocumentsTable(url: string, documentlist: Object, actionType: string) {
  return (dispatch, getState) => {
    dispatch(requestDocumentsList(documentlist))
    const {sessionToken, env} = getState().accessReducer;
    writeToLog(env, sessionToken, constans.DEBUG, `function fetchDocumentsTable - url: ${url}`)
    return fetch(url)
      .then(response => response.json())
      .then(json => {
        const nextUrl = json.ResponseData.next_href
        if (json.ResponseStatus == "FAILED") {
          //dispatch(failedToFetchDocumentsList(documentlist, url, json.ErrorMessage))
          dispatch(navActions.emitError(json.ErrorMessage, 'error details'))
          dispatch(navActions.emitError(json.ErrorMessage, ""))
          writeToLog(env, sessionToken, constans.ERROR, `function fetchDocumentsTable - error details  - url: ${url}`)
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
          if (totalFolders > 0 && totalFiles > 0) {
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
          else if (totalFolders > 0) {
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
          else if (totalFiles > 0) {
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
        dispatch(navActions.emitError("Failed to retrieve documents", ""))
        writeToLog(env, sessionToken, constans.ERROR, `function fetchDocumentsTable - Failed to retrieve documents - url: ${url}`,error)

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
    const url = constructRetrieveDocumentsUrl(getState().accessReducer.env, getState().accessReducer.sessionToken, documentlist.fId, documentlist.sortBy, documentlist.sortDirection, documentlist.catId, documentlist.keyboard)
     const {sessionToken, env} = getState().accessReducer;
    writeToLog(env, sessionToken, constans.DEBUG, `function refreshTable - url: ${url}`)
    dispatch(navActions.updateRouteData(documentlist))
    dispatch(Access.retrieveStatistics());
    return dispatch(fetchDocumentsTable(url, documentlist, types.REFRESH_DOCUMENTS_LIST))
  }
}

export function initializeSearchBox(documentlist: Object) {
  return (dispatch, getState) => {
      dispatch(clearDocuments(documentlist));
      return dispatch(navActions.push(routes.documentsRoute(documentlist).route));
  }
}

export function clearAllDocumentlists() {
  return {
    type: types.CLEAR_ALL_DOCUMENTS_LIST
  }
}

export function clearDocuments(documentlist: Object) {
  return (dispatch, getState) => {
    var items= [];
    var nextUrl= ""
    var dataSource ={};    
  dispatch(refreshDocumentsList(items, nextUrl, documentlist, dataSource))
 }
}

function getNextUrl(env: string, sessionToken: string, documentlists: Object, documentlist: Object) {

  const activeDocumentsList = documentlists[documentlist.catId]
  if (!activeDocumentsList || activeDocumentsList.nextUrl === false) {
    return constructRetrieveDocumentsUrl(env, sessionToken, documentlist.fId, documentlist.sortBy, documentlist.sortDirection, documentlist.catId,documentlist.keyboard)
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
export function UpdateCreateingFolderState(creating: int) {

  return {
    type: types.REQUEST_CREATE_FOLDER,
    creatingFolder: creating
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

export function updateSelectedObject(id: string, familyCode: string, permissions: object) {

  return {
    type: types.UPDATE_SELECTED_OBJECT,
    selectedObject: {
      id: id,
      familyCode: familyCode,
      permissions: permissions
    }
  }
}

export function createFolder(folderName: string, isVault: boolean) {

  return (dispatch, getState) => {
    var documentlist = getDocumentsContext(getState().navReducer);
    const {sessionToken, env} = getState().accessReducer;
    const folderId = documentlist.fId;
    const createFolderUrl = getCreateFolderUrl(env, sessionToken, documentlist.fId, folderName, isVault);
    dispatch(UpdateCreateingFolderState(1))
    writeToLog(env, sessionToken, constans.DEBUG, `function createFolder - url: ${createFolderUrl}`)
    return fetch(createFolderUrl)
      .then(response => response.json())
      .then(json => {
        if (json.ResponseStatus == "FAILED") {
          // dispatch(failedToFetchDocumentsList(documentlist, "", json.ResponseData.ErrorMessage))

          if(json.ErrorMessage.indexOf('VAL10357') > -1)
          {
            dispatch(navActions.emitError("Folder Name already exists"))
            writeToLog(env, sessionToken, constans.ERROR, `function createFolder - Folder Name already exists - url: ${createFolderUrl}`)
          }
          else
          {
            dispatch(navActions.emitError("Error creating new folder"))
            writeToLog(env, sessionToken, constans.ERROR, `function createFolder - Error creating new folder - url: ${createFolderUrl}`)
          }
          
          dispatch(UpdateCreateingFolderState(2))

         
        }
        else {
          dispatch(UpdateCreateingFolderState(2))
          dispatch(refreshTable(documentlist))
         
        }

      })
      .catch((error) => {
        dispatch(navActions.emitError("Error creating new folder"))
        dispatch(UpdateCreateingFolderState(0))
        writeToLog(env, sessionToken, constans.ERROR, `function createFolder - Error creating new folder - url: ${createFolderUrl}`, error)
      })
  }
}


export function downloadDocument(id: string, fileName: string){
   return (dispatch, getState) => {
        const {sessionToken, env} = getState().accessReducer;
        //dispatch(updateIsFetching(true)); 
        dispatch(navActions.emitToast('info', 'Document will be downloaded shortly'));
        const url = getDownloadFileUrl(env, sessionToken, id);
         writeToLog(env, sessionToken, constans.DEBUG, `function downloadDocument - url: ${url}`)
         fetch(url)
            .then(response => response.json())
            .then(json => {
                  const downloadUrl = json.ResponseData.AccessUrl;
                  
                  RNFetchBlob.config({
                    fileCache : true,
                    // android only options, these options be a no-op on IOS
                    addAndroidDownloads : {
                      useDownloadManager : true,
                      // Show notification when response data transmitted
                      notification : true,
                      // Title of download notification
                      title : fileName,
                      // File description (not notification description)
                      description : 'Download completed',
                     // mime : 'vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                      // Make the file scannable  by media scanner
                      meidaScannable : true,
                    }
                  })
                  .fetch('GET', downloadUrl)
                  .then( (res) => {
                    
                    })

              }).catch(error => { 
                  dispatch(navActions.emitToast('error downloading document'))
                  writeToLog(env, sessionToken, constans.ERROR, `function downloadDocument - error downloading document - url: ${url}`, error)

              })
              .done();
        }
}




function uploadFile(url,file){
	
	       return new Promise((resolve, reject) => {
	
	    var xhr = new XMLHttpRequest();
	    xhr.onerror = function (e) {
	      // handle failture
	      console.log(e);
	      reject();
	    };
	
	    xhr.upload.addEventListener('progress', function (e) {
	      // handle notifications about upload progress: e.loaded / e.total
	    }, false);
	
	    xhr.onreadystatechange = function () {
	        if (xhr.readyState === XMLHttpRequest.DONE) {
	          if (xhr.status >= 200 && xhr.status <= 299) {
	            // upload completed//
             // alert(xhr.status)
	            resolve(url);
	          } else {
	            // failed with error messge from server
	            reject(xhr.status + ": " + url);
	          }
	        }
	    };

      // xhr.processData = false;  
    //   xhr.cache = false; 
    // var formData = new FormData();
  //   formData.append('file', file);
	    
       xhr.open('PUT', url);
        xhr.setRequestHeader('Content-Type', 'multipart/form-data');
     

      //   alert(file.name + ' ' + file.fileName );

     // resolve(file.name + ' ' + file.fileName );

   //  alert(file.path)
     // var asset = RNFetchBlob.fs.asset(file.path)

     // alert(file)
      // var x = new File(file.path);
	     xhr.send(file);
	       });
	}

 
  export function uploadToKenesto(fileObject: object, url: string, isUpdateVersion: boolean=false){


  return (dispatch, getState) => {
          //dispatch(updateIsFetching(true)); 
            const {sessionToken, env} = getState().accessReducer;
            writeToLog(env, sessionToken, constans.DEBUG, `function uploadToKenesto - url: ${url}, isUpdateVersion${isUpdateVersion}`)
            fetch(url)
            .then(response => response.json())
            .then(json => {
             
              if (json.ResponseStatus == "FAILED") {
               //   alert(failed)
                // dispatch(emitError(json.ResponseData.ErrorMessage,'error details'))
                 dispatch(navActions.emitError(json.ErrorMessage,""))
              }
              else {
                 var AccessUrl = json.ResponseData.AccessUrl;

//                     try {
//                           var XMLHttpRequest = require('xhr2');
// //alret('fdfdfd')
//                       var xhr = new XMLHttpRequest();

//                 xhr.onreadystatechange = function () {
//                     if (xhr.readyState === XMLHttpRequest.DONE) {
//                       if (xhr.status >= 200 && xhr.status <= 299) {
//                         // upload completed//
//                       // alert(xhr.status)
//                         //resolve(url);
//                         alert('done')
//                       } else {
//                         // failed with error messge from server
//                       //  reject(xhr.status + ": " + url);
//                       alert('problem')
//                       }
//                     }
//                 };

//                 xhr.upload.addEventListener("loadstart", function (evt) {
//                   alert('starting')
//               }, false);


                // xhr.processData = false;  
              //   xhr.cache = false; 
              // var formData = new FormData();
            //   formData.append('file', file);
            //    xhr.addEventListener('progress',updateProgress);

              // xhr.addEventListener("progress", updateProgress, false);

                // xhr.open('PUT', AccessUrl);
                //   xhr.setRequestHeader('Content-Type', 'multipart/form-data');

              
                
              
                //   alert(file.name + ' ' + file.fileName );

              // resolve(file.name + ' ' + file.fileName );

            //  alert(file.path)
              // var asset = RNFetchBlob.fs.asset(file.path)

              // alert(file)
                // var x = new File(file.path);
                // xhr.send(fileObject);


                      
                //     } catch (error) {
                //       alert(error);
                //     }

                  


                 uploadFile(AccessUrl,fileObject)
                 .then((url) => {
                
                         const thisCompletedUrl = getUploadFileCompletedUrl(getState().accessReducer.env, getState().accessReducer.sessionToken, url);
                          fetch(thisCompletedUrl)
                                .then(response => response.json())
                                .then(json => {
                                  //dispatch(updateIsFetching(false)); 
                                
                                 
                                  if(json.ResponseStatus == 'OK')
                                  {
                                       let message = ""
                                      if(isUpdateVersion)
                                        message = "Successfully updated document version"
                                      else
                                        message = "File successfully uploaded"

                                        dispatch(navActions.emitToast("success",message,""));
                                  }
                                  else {
                                     if(isUpdateVersion)
                                        message = `Error. failed to upload file ${fileObject.name}`
                                      else
                                        message = "Error. failed to update version"

                                         dispatch(navActions.emitToast("info",message,""));
                                         writeToLog(env, sessionToken, constans.ERROR, `function uploadToKenesto - Failed to upload file to kenesto - url: ${url}`, JSON.stringify(fileObject))
                                  }
                                 // dispatch(navActions.pop());

                                })
                                .catch((error) => {
                                  console.log("error:" + JSON.stringify(error))
                                  dispatch(navActions.emitError("Failed",`Error. failed to upload file ${fileObject.name}`))
                                  writeToLog(env, sessionToken, constans.ERROR, `function uploadToKenesto - Failed to upload file to kenesto - url: ${url}`, JSON.stringify(fileObject), error)

                                }) 
                                
                  })
                 .catch(err => {alert(err)});




                              // RNFetchBlob.fetch('PUT', AccessUrl, {
                              //   'Content-Type' : 'multipart/form-data',
                              // },
                              //      JSON.stringify(fileObject),
                              
                                 
                              // )
              
                              // // listen to download progress event
                              // // .progress((received, total) => {
                              // //     console.log('progress', received / total)
                              // // })
                              // //.then(response => response.json())r
                              //    .then(response => response.json())
                              //     .then(json => {
                              
                              //     //dispatch(updateIsFetching(false)); 
                              //       alert(json);
                            
                              //     if(json.ResponseStatus == 'OK')
                              //     {
                                     
                              //           dispatch(navActions.emitToast("success","file successfully uploaded",""));
                              //     }
                              //     else {
                              //            dispatch(navActions.emitToast("info","coudn't upload file",""));
                              //     }
                              //     dispatch(navActions.pop());

                              //   })
                              //   .catch((error) => {
                              //     console.log("error:" + JSON.stringify(error))
                              //     dispatch(navActions.emitError("Failed",JSON.stringify(error)))


                              //   }) 




              }
            })
            .catch((error) => {
              //console.log("error:" + JSON.stringify(error))
               dispatch(navActions.emitError("Failed",`Error. failed to upload file ${fileObject.name}`))
               writeToLog(env, sessionToken, constans.ERROR, `function uploadToKenesto - Failed to upload file to kenesto - url: ${url}`, JSON.stringify(fileObject), error)
            })
  }

}


// getDeleteFolderUrl
export function deleteAsset(id: string, familyCode: string){
   return (dispatch, getState) => {
        dispatch(updateIsFetching(true)); 
        const {sessionToken, env} = getState().accessReducer;
           
        const url = getDeleteAssetUrl(env, sessionToken, id, familyCode);
        writeToLog(env, sessionToken, constans.DEBUG, `function deleteAsset - url: ${url}`)
            return fetch(url)
                .then(response => response.json())
                .then(json => {
                   dispatch(updateIsFetching(false)); 
                  if (json.ResponseStatus == "FAILED") {
                      dispatch(navActions.emitToast("error", "", "Error deleting asset"))
                      writeToLog(env, sessionToken, constans.ERROR, `function deleteAsset - Error deleting asset - url: ${url}`)
                  }
                  else {
                        dispatch(navActions.emitToast("success", "", "successfully deleted the asset"))
                         var documentlist = getDocumentsContext(getState().navReducer);
                         dispatch(refreshTable(documentlist))    
                    }
      })
      .catch((error) => {
          dispatch(navActions.emitToast("error", "", "Failed to delete asset"))
          writeToLog(env, sessionToken, constans.ERROR, `function deleteAsset - Failed to delete asset - url: ${url}`,error)
      })

   }
}

export function deleteFolder(id: string){
   return (dispatch, getState) => {
        dispatch(updateIsFetching(true)); 
        const {sessionToken, env} = getState().accessReducer;
        const url = getDeleteFolderUrl(env, sessionToken, id);
        writeToLog(env, sessionToken, constans.DEBUG, `function deleteFolder - url: ${url}`)
            return fetch(url)
                .then(response => response.json())
                .then(json => {
                   dispatch(updateIsFetching(false)); 
                  if (json.ResponseStatus == "FAILED") {
                      dispatch(navActions.emitToast("error", "", "Error deleting folder"))
                      writeToLog(env, sessionToken, constans.ERROR, `function deleteFolder - Failed to delete folder - url: ${url}`)
                  }
                  else {
                        dispatch(navActions.emitToast("success", "", "successfully deleted the folder"))
                         var documentlist = getDocumentsContext(getState().navReducer);
                         dispatch(refreshTable(documentlist))    
                    }
      })
      .catch((error) => {
           dispatch(navActions.emitToast("error",error, "Failed to delete folder"))
           writeToLog(env, sessionToken, constans.ERROR, `function deleteFolder - Failed to delete folder - url: ${url}`,error)
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
      const triggerId = 'trigger_' + ParticipantUniqueID; 

      var sharingPermissions = []; 
      sharingPermissions.push({ParticipantUniqueID: ParticipantUniqueID, FamilyCode: familyCode, AccessLinkID: '00000000-0000-0000-0000-000000000000', 
       ForUpdate: "true",  PermissionTypeValue : triggerSelectedValue, AllowShare: "false",  AllowUpload: "false" }); 

       const sharingObject = { asset: {
          ID: document.Id, 
          UsersPermissions : sharingPermissions
          }
      }

        const {sessionToken, env} = getState().accessReducer;
        const url = getShareDocumentUrl(env, sessionToken);
        writeToLog(env, sessionToken, constans.DEBUG, `function UpdateDocumentSharingPermission - ParticipantUniqueID:${ParticipantUniqueID} ID:${document.Id} url: ${url}`)

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
        //  setTimeout(function(){ dispatch(peopleActions.RemoveFromFetchingList(triggerId));}, 3000);
         dispatch(peopleActions.RemoveFromFetchingList(triggerId));
            //     alert(JSON.stringify(response))

        }).catch((error) => {
                dispatch(navActions.emitError(error,""))
                writeToLog(env, sessionToken, constans.ERROR, `function UpdateDocumentSharingPermission - Failed! ParticipantUniqueID:${ParticipantUniqueID} ID:${document.Id} url: ${url}`,error)
            }).done();

    

    }
}

export function DiscardCheckOut() {

  return (dispatch, getState) => {
    const documentLists = getState().documentlists;
    const navReducer = getState().navReducer;
    var document = getSelectedDocument(documentLists, navReducer);
    const {sessionToken, env} = getState().accessReducer;
    const url = getDiscardCheckOutDocumentUrl(env, sessionToken, document.Id);
    writeToLog(env, sessionToken, constans.DEBUG, `function DiscardCheckOut - url: ${url}`)

    dispatch(updateIsFetching(true));
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (json.ResponseStatus == "FAILED") {
           dispatch(updateIsFetching(false));
           dispatch(navActions.emitError("Failed to discard Check-Out document", ""))
           writeToLog(env, sessionToken, constans.ERROR, `function DiscardCheckOut - Failed to discard Check-Out document! - url: ${url}`)
        }
        else {
          dispatch(updateIsFetching(false));
          dispatch(navActions.emitToast("success", "Check-Out successfully discarded", ""));
          dispatch(navActions.clearToast());
          dispatch(Access.retrieveStatistics());
        }

      }).catch((error) => {
        dispatch(updateIsFetching(false));
        dispatch(navActions.emitError("Failed to discard Check-Out document", ""))
        writeToLog(env, sessionToken, constans.ERROR, `function DiscardCheckOut - Failed to discard Check-Out document! - url: ${url}`,error)
       
      }).done();
  }

}
export function CheckOut() {

  return (dispatch, getState) => {
    const documentLists = getState().documentlists;
    const navReducer = getState().navReducer;
    var document = getSelectedDocument(documentLists, navReducer);
    const {sessionToken, env} = getState().accessReducer;
    const url = getCheckOutDocumentUrl(env, sessionToken, document.Id);
    writeToLog(env, sessionToken, constans.DEBUG, `function CheckOut - url: ${url}`)
    dispatch(updateIsFetching(true));
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (json.ResponseStatus == "FAILED") {
           dispatch(updateIsFetching(false));
           dispatch(navActions.emitError("Failed to Check-Out document", ""))
           writeToLog(env, sessionToken, constans.ERROR, `function CheckOut - Failed to Check-Out document! - url: ${url}`)
        }
        else {
          dispatch(updateIsFetching(false));
          dispatch(navActions.emitToast("success", "Document successfully checked out.", ""));
          dispatch(navActions.clearToast());
          dispatch(Access.retrieveStatistics());
         
        }

      }).catch((error) => {
        dispatch(updateIsFetching(false));
        dispatch(navActions.emitError("Failed to Check-Out document", ""))
        writeToLog(env, sessionToken, constans.ERROR, `function CheckOut - Failed to Check-Out document! - url: ${url}`, error)
        
      }).done();
  }

}


export function CheckIn(comment :string) {

  return (dispatch, getState) => {
    const documentLists = getState().documentlists;
    const navReducer = getState().navReducer;
    var document = getSelectedDocument(documentLists, navReducer);
    const {sessionToken, env} = getState().accessReducer;
    const url = getCheckInDocumentUrl(env, sessionToken);
    writeToLog(env, sessionToken, constans.DEBUG, `function CheckIn - url: ${url}`)
    dispatch(updateIsFetching(true));
    const jsonObject = {
      asset: {
        ID: document.Id,
        Comment : comment
      }
    }
    console.log(url)
    console.log(JSON.stringify(jsonObject))
    var request = new Request(url, {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(jsonObject)
    });

    fetch(request)
      .then(response => response.json())
      .then(json => {
        if (json.ResponseStatus == "FAILED") {
           dispatch(updateIsFetching(false));
           dispatch(navActions.emitError("Failed to Check-In document", ""))
           writeToLog(env, sessionToken, constans.ERROR, `function CheckIn - Failed to Check-In document! - url: ${url}`)
        }
        else {
          dispatch(updateIsFetching(false));
          dispatch(navActions.emitToast("success", "Document successfully checked in.", ""));
          dispatch(navActions.clearToast());
          dispatch(Access.retrieveStatistics());
         
        }

      }).catch((error) => {
        dispatch(updateIsFetching(false));
        dispatch(navActions.emitError("Failed to Check-In document", ""))
        writeToLog(env, sessionToken, constans.ERROR, `function CheckIn - Failed to Check-In document! - url: ${url}`, error)
      }).done();
  }

}

export function EditFolder(fId: string, folderName: string, isVault: boolean) {

  return (dispatch, getState) => {
    var documentlist = getDocumentsContext(getState().navReducer);
    const {sessionToken, env} = getState().accessReducer;
    const url = getEditFolderUrl(env, sessionToken, fId, folderName, isVault);
    writeToLog(env, sessionToken, constans.DEBUG, `function EditFolder - url: ${url}`)

    dispatch(updateIsFetching(true));
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (json.ResponseStatus == "FAILED") {
           dispatch(updateIsFetching(false));
           
           if(json.ErrorMessage.indexOf('VAL10357') > -1)
            {
              dispatch(navActions.emitError("Folder Name already exists"))
              writeToLog(env, sessionToken, constans.ERROR, `function EditFolder - Folder Name already exists! - url: ${url}`)
            }
            else
            {
              dispatch(navActions.emitError("Failed to edit folder", ""))
              writeToLog(env, sessionToken, constans.ERROR, `function EditFolder - Failed to edit folder! - url: ${url}`)
            }
          
        }
        else {
          dispatch(updateIsFetching(false));
          dispatch(refreshTable(documentlist));
          dispatch(navActions.emitToast("success", "folder successfully updated.", ""));
          dispatch(navActions.clearToast());
        }

      }).catch((error) => {
        dispatch(updateIsFetching(false));
        dispatch(navActions.emitError("Failed to edit folder", ""))
        writeToLog(env, sessionToken, constans.ERROR, `function EditFolder - Failed to edit folder! - url: ${url}`, error)
      }).done();
  }

}

export function EditDocument(documentId: string, documentName: string) {
  return (dispatch, getState) => {
    var documentlist = getDocumentsContext(getState().navReducer);
    const {sessionToken, env} = getState().accessReducer;
    const url = getEditDocumentUrl(env, sessionToken, documentId, documentName);
    writeToLog(env, sessionToken, constans.DEBUG, `function EditDocument - url: ${url}`)

    dispatch(updateIsFetching(true));
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (json.ResponseStatus == "FAILED") {
           dispatch(updateIsFetching(false));
           dispatch(navActions.emitError("Failed to edit document", ""))
            writeToLog(env, sessionToken, constans.ERROR, `function EditFolder - Failed to edit document! - url: ${url}`)
        }
        else {
          dispatch(updateIsFetching(false));
          dispatch(refreshTable(documentlist));
          dispatch(navActions.emitToast("success", "document successfully updated.", ""));
          dispatch(navActions.clearToast());
        }

      }).catch((error) => {
        dispatch(updateIsFetching(false));
        dispatch(navActions.emitError("Failed to edit document", ""))
        writeToLog(env, sessionToken, constans.ERROR, `function EditFolder - Failed to edit document! - url: ${url}`, error)
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
      const {sessionToken, env} = getState().accessReducer;
     
     for (var i=0; i< sharingPermissions.length; i++){
        sharingPermissions[i].PermissionTypeValue = addPeopleTriggerValue;
     }

      const sharingObject = { asset: {
          ID: document.Id, 
          UsersPermissions : sharingPermissions
          }
      }

      const url = getShareDocumentUrl(env, sessionToken);
      writeToLog(env, sessionToken, constans.DEBUG, `function ShareDocument - ID:${document.Id} url: ${url}`)

          
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
                                  
                      fetch(request)
                         .then(response => response.json())
                         .then(json => {
                               if (json.ResponseStatus == "FAILED") {
                                    dispatch(navActions.emitError("Failed to share document",""))
                                    writeToLog(env, sessionToken, constans.ERROR, `function ShareDocument -Failed to share document! - ID:${document.Id} url: ${url}`)
                                  }
                                else{
                                     dispatch(navActions.pop());
                                     dispatch(navActions.emitToast("success","Sharing settings updated",""));
                                   
                                }

                      }).catch((error) => {
                              dispatch(navActions.emitError("Failed to share object",""))
                              writeToLog(env, sessionToken, constans.ERROR, `function ShareDocument -Failed to share document! - ID:${document.Id} url: ${url}`, error)
                          }).done();
   }
 
} 