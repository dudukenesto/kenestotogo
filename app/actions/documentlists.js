import * as types from '../constants/ActionTypes'
import * as navActions from '../actions/navActions'
import * as Access from '../actions/Access'
import * as peopleActions from '../actions/peopleActions'
import {
  constructRetrieveDocumentsUrl, constructRetrieveStatisticsUrl, getCreateFolderUrl,
  getDownloadFileUrl, getDocumentsContext, getUploadFileCompletedUrl,
  getDeleteAssetUrl, getDeleteFolderUrl, getSelectedDocument, getShareDocumentUrl,
  getDocumentPermissionsUrl, getCheckOutDocumentUrl, getCheckInDocumentUrl, getEditFolderUrl, getEditDocumentUrl, geDiscardCheckOutDocumentUrl
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
    return fetch(url)
      .then(response => response.json())
      .then(json => {
        if (json.ResponseStatus == "FAILED") {
          dispatch(navActions.emitError(json.ErrorMessage, 'error details'))
          dispatch(navActions.emitError(json.ErrorMessage, ""))
          dispatch(updateIsFetchingSelectedObject(false))
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
      })
  }
}

function fetchDocumentsTable(url: string, documentlist: Object, actionType: string) {
  return (dispatch, getState) => {
    dispatch(requestDocumentsList(documentlist))
    console.log("fetch url:"+url)
    return fetch(url)
      .then(response => response.json())
      .then(json => {
        const nextUrl = json.ResponseData.next_href
        if (json.ResponseStatus == "FAILED") {
          //dispatch(failedToFetchDocumentsList(documentlist, url, json.ErrorMessage))
          dispatch(navActions.emitError(json.ErrorMessage, 'error details'))
          dispatch(navActions.emitError(json.ErrorMessage, ""))
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
    console.log("refreshTable url:"+url)
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
    return fetch(createFolderUrl)
      .then(response => response.json())
      .then(json => {
        if (json.ResponseStatus == "FAILED") {
          // dispatch(failedToFetchDocumentsList(documentlist, "", json.ResponseData.ErrorMessage))

          if(json.ErrorMessage.indexOf('VAL10357') > -1)
          {
            dispatch(navActions.emitError("Folder Name already exists"))
          }
          else
          {
            dispatch(navActions.emitError("Error creating new folder"))
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
      })
  }
}


export function downloadDocument(id: string, fileName: string){
   return (dispatch, getState) => {
        //dispatch(updateIsFetching(true)); 
        dispatch(navActions.emitToast('info', 'Document will be downloaded shortly'));
        const url = getDownloadFileUrl(getState().accessReducer.env, getState().accessReducer.sessionToken, id);
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

 
  export function uploadToKenesto(fileObject: object, url: string){

    alert(JSON.stringify(fileObject))

  return (dispatch, getState) => {
          //dispatch(updateIsFetching(true)); 

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
                                     
                                        dispatch(navActions.emitToast("success","file successfully uploaded",""));
                                  }
                                  else {
                                         dispatch(navActions.emitToast("info","coudn't upload file",""));
                                  }
                                  dispatch(navActions.pop());

                                })
                                .catch((error) => {
                                  console.log("error:" + JSON.stringify(error))
                                  dispatch(navActions.emitError("Failed",JSON.stringify(error)))


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
              dispatch(navActions.emitError("Failed to upload file to kenesto",""))

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
      const triggerId = 'trigger_' + ParticipantUniqueID; 

      var sharingPermissions = []; 
      sharingPermissions.push({ParticipantUniqueID: ParticipantUniqueID, FamilyCode: familyCode, AccessLinkID: '00000000-0000-0000-0000-000000000000', 
       ForUpdate: "true",  PermissionTypeValue : triggerSelectedValue, AllowShare: "false",  AllowUpload: "false" }); 

       const sharingObject = { asset: {
          ID: document.Id, 
          UsersPermissions : sharingPermissions
          }
      }

      //  dispatch(peopleActions.AddtoFetchingList(triggerId));
//updateIsFetching
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
        //  setTimeout(function(){ dispatch(peopleActions.RemoveFromFetchingList(triggerId));}, 3000);
         dispatch(peopleActions.RemoveFromFetchingList(triggerId));
            //     alert(JSON.stringify(response))

        }).catch((error) => {
                dispatch(navActions.emitError(error,""))
            }).done();

    

    }
}

export function DiscardCheckOut() {

  return (dispatch, getState) => {
    const documentLists = getState().documentlists;
    const navReducer = getState().navReducer;
    var document = getSelectedDocument(documentLists, navReducer);

    const url = geDiscardCheckOutDocumentUrl(getState().accessReducer.env, getState().accessReducer.sessionToken, document.Id);
    dispatch(updateIsFetching(true));
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (json.ResponseStatus == "FAILED") {
           dispatch(updateIsFetching(false));
           dispatch(navActions.emitError("Failed to discard Check-Out document", ""))
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
        throw error;
      }).done();
  }

}
export function CheckOut() {

  return (dispatch, getState) => {
    const documentLists = getState().documentlists;
    const navReducer = getState().navReducer;
    var document = getSelectedDocument(documentLists, navReducer);

    const url = getCheckOutDocumentUrl(getState().accessReducer.env, getState().accessReducer.sessionToken, document.Id);
    dispatch(updateIsFetching(true));
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (json.ResponseStatus == "FAILED") {
           dispatch(updateIsFetching(false));
           dispatch(navActions.emitError("Failed to Check-Out document", ""))
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
        throw error;
      }).done();
  }

}


export function CheckIn(comment :string) {

  return (dispatch, getState) => {
    const documentLists = getState().documentlists;
    const navReducer = getState().navReducer;
    var document = getSelectedDocument(documentLists, navReducer);

    const url = getCheckInDocumentUrl(getState().accessReducer.env, getState().accessReducer.sessionToken);
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
        throw error;
      }).done();
  }

}

export function EditFolder(fId: string, folderName: string, isVault: boolean) {

  return (dispatch, getState) => {
    var documentlist = getDocumentsContext(getState().navReducer);
    const url = getEditFolderUrl(getState().accessReducer.env, getState().accessReducer.sessionToken, fId, folderName, isVault);
    
    dispatch(updateIsFetching(true));
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (json.ResponseStatus == "FAILED") {
           dispatch(updateIsFetching(false));
           
           if(json.ErrorMessage.indexOf('VAL10357') > -1)
            {
              dispatch(navActions.emitError("Folder Name already exists"))
            }
            else
            {
              dispatch(navActions.emitError("Failed to edit folder", ""))
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
        throw error;
      }).done();
  }

}

export function EditDocument(documentId: string, documentName: string) {
  return (dispatch, getState) => {
    var documentlist = getDocumentsContext(getState().navReducer);
    const url = getEditDocumentUrl(getState().accessReducer.env, getState().accessReducer.sessionToken, documentId, documentName);
    
    dispatch(updateIsFetching(true));
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (json.ResponseStatus == "FAILED") {
           dispatch(updateIsFetching(false));
           dispatch(navActions.emitError("Failed to edit document", ""))
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
        throw error;
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
                                  
                      fetch(request)
                         .then(response => response.json())
                         .then(json => {
                               if (json.ResponseStatus == "FAILED") {
                                    dispatch(navActions.emitError("Failed to share document",""))
                                  }
                                else{
                                     dispatch(navActions.pop());
                                     dispatch(navActions.emitToast("success","Sharing settings updated",""));
                                   
                                }

                      }).catch((error) => {
                              dispatch(navActions.emitError("Failed to share object",""))
                           throw error;
                          }).done();
   }
 
} 