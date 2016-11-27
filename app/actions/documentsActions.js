import * as types from '../constants/ActionTypes'
import * as navActions from '../actions/navActions'
import * as Access from '../actions/Access'
import * as peopleActions from '../actions/peopleActions'
import { writeToLog } from '../utils/ObjectUtils'
import * as constans from '../constants/GlobalConstans'
import {
    constructRetrieveDocumentsUrl, constructRetrieveStatisticsUrl, getCreateFolderUrl,
    getDownloadFileUrl, getDocumentsContext, getUploadFileCompletedUrl,
    getDeleteAssetUrl, getDeleteFolderUrl, getSelectedDocument, getShareDocumentUrl,
    getDocumentPermissionsUrl, getCheckOutDocumentUrl, getCheckInDocumentUrl, getEditFolderUrl,
    getDocumentlistByCatId, getEditDocumentUrl, getDiscardCheckOutDocumentUrl, parseUploadUserData, constrcutUploadUSerData,
    isDocumentsContextExists, getDocumentsContextByCatId
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
        isFetchingSelectedObject: isFetching
    }
}

export function getDocumentPermissions(documentId: string, familyCode: string) {
    return (dispatch, getState) => {
        const {sessionToken, env, email} = getState().accessReducer;
        dispatch(updateIsFetchingSelectedObject(true))
        var url = getDocumentPermissionsUrl(env, sessionToken, documentId, familyCode);
        writeToLog(email, constans.DEBUG, `function getDocumentPermissions - url: ${url}`)
        return fetch(url)
            .then(response => response.json())
            .then(json => {
                if (json.ResponseStatus == "FAILED") {
                    dispatch(navActions.emitError(json.ErrorMessage, 'error details'))
                    dispatch(navActions.emitError(json.ErrorMessage, ""))
                    dispatch(updateIsFetchingSelectedObject(false))
                    writeToLog(email, constans.ERROR, `function getDocumentPermissions - error details- url: ${url}`)
                }
                else {
                    var permissions = json.ResponseData.ObjectPermissions;
                    dispatch(updateSelectedObject(documentId, familyCode, permissions))
                    dispatch(updateIsFetchingSelectedObject(false))
                }
            })
            .catch((error) => {
                dispatch(navActions.emitError("Failed to get document permissions", ""))
                dispatch(updateIsFetchingSelectedObject(false))
                writeToLog(email, constans.ERROR, `function getDocumentPermissions - Failed to get document permissions , url: ${url}`, error)
            })
    }
}


function AssembleTableDatasource(items, uploadItems, totalFiles, totalFolders) {

    var dataBlob = {},
        sectionIDs = [],
        rowIDs = [],
        foldersSection,
        docuemntsSection,
        folders,
        documents,
        i,
        j;

    folders = _.filter(items, function(o) { return o.FamilyCode == 'FOLDER'; });
    documents = _.filter(items, function(o) { return o.FamilyCode != 'FOLDER'; });




    if (totalFolders > 0 && totalFiles > 0) {
        if (uploadItems.length > 0) {
            dataBlob["ID1"] = `Uploads (${uploadItems.length})`
            dataBlob["ID2"] = `Folders (${totalFolders})`
            dataBlob["ID3"] = `Files (${totalFiles})`
            sectionIDs[0] = "ID1";
            sectionIDs[1] = "ID2";
            sectionIDs[2] = "ID3";

            rowIDs[0] = [];
            for (j = 0; j < uploadItems.length; j++) {
                uploadItem = uploadItems[j];

                rowIDs[0].push(uploadItem.Id);
                dataBlob['ID1:' + uploadItem.Id] = uploadItem;
            }
            rowIDs[1] = [];
            for (j = 0; j < folders.length; j++) {
                folder = folders[j];
                // Add Unique Row ID to RowID Array for Section
                rowIDs[1].push(folder.Id);
                // Set Value for unique Section+Row Identifier that will be retrieved by getRowData
                dataBlob['ID2:' + folder.Id] = folder;
            }


            rowIDs[2] = [];
            for (j = 0; j < documents.length; j++) {
                document = documents[j];
                // Add Unique Row ID to RowID Array for Section
                rowIDs[2].push(document.Id);

                // Set Value for unique Section+Row Identifier that will be retrieved by getRowData
                dataBlob['ID3:' + document.Id] = document;
            }

        }
        else {


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

    }
    else if (totalFolders > 0 && totalFiles == 0) {
        if (uploadItems.length > 0) {
            dataBlob["ID1"] = `Uploads (${uploadItems.length})`
            dataBlob["ID2"] = `Folders (${totalFolders})`
            sectionIDs[0] = "ID1";
            sectionIDs[1] = "ID2";
            rowIDs[0] = [];
            for (j = 0; j < uploadItems.length; j++) {
                uploadItem = uploadItems[j];
                rowIDs[0].push(uploadItem.Id);
                dataBlob['ID1:' + uploadItem.Id] = uploadItem;
            }
            rowIDs[1] = [];
            for (j = 0; j < folders.length; j++) {
                folder = folders[j];
                // Add Unique Row ID to RowID Array for Section
                rowIDs[1].push(folder.Id);

                // Set Value for unique Section+Row Identifier that will be retrieved by getRowData
                dataBlob['ID2:' + folder.Id] = folder;
            }
        }
        else {
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

    }
    else if (totalFiles > 0 && totalFolders == 0) {
        if (uploadItems.length > 0) {
            dataBlob["ID1"] = `Uploads (${uploadItems.length})`
            dataBlob["ID2"] = `Files (${totalFiles})`
            sectionIDs[0] = "ID1";
            sectionIDs[1] = "ID2";
            rowIDs[0] = [];
            for (j = 0; j < uploadItems.length; j++) {
                uploadItem = uploadItems[j];
                rowIDs[0].push(uploadItem.Id);
                dataBlob['ID1:' + uploadItem.Id] = uploadItem;
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
        else {
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

    }
    else if (totalFiles == 0 && totalFolders == 0) {
        if (uploadItems.length > 0) {

            dataBlob["ID1"] = `Uploads (${uploadItems.length})`
            sectionIDs[0] = "ID1";

            rowIDs[0] = [];
            for (j = 0; j < uploadItems.length; j++) {
                uploadItem = uploadItems[j];
                rowIDs[0].push(uploadItem.Id);
                dataBlob['ID1:' + uploadItem.Id] = uploadItem;
            }
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

        rowHasChanged: (row1, row2) => {
            row1["Id"] !== row2["Id"] || row1["uploadStatus"] !== row2["uploadStatus"] || r1["IsUploading"] !== r2["IsUploading"]
        },

        sectionHeaderHasChanged: (s1, s2) => s1 !== s2

    })

    return { ret: ds.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs) }

}

function fetchDocumentsTable(url: string, documentlist: Object, actionType: string) {
    return (dispatch, getState) => {

        dispatch(requestDocumentsList(documentlist))
        const {sessionToken, env, email} = getState().accessReducer;
        writeToLog(email, constans.DEBUG, `function fetchDocumentsTable - url: ${url}`)
        return fetch(url)
            .then(response => response.json())
            .then(json => {
                const nextUrl = json.ResponseData.next_href
                if (json.ResponseStatus == "FAILED") {
                    //dispatch(failedToFetchDocumentsList(documentlist, url, json.ErrorMessage))
                    dispatch(navActions.emitError(json.ErrorMessage, 'error details'))
                    dispatch(navActions.emitError(json.ErrorMessage, ""))
                    writeToLog(email, constans.ERROR, `function fetchDocumentsTable - error details  - url: ${url}`)
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
                        items = [...prevState.documentsReducer[documentlist.catId].items, ...json.ResponseData.DocumentsList]
                    }
                    else {
                        items = [...json.ResponseData.DocumentsList]
                    }
                    var uploadItems = getState().documentsReducer[documentlist.catId].uploadItems;
                    var datasource = AssembleTableDatasource(items, uploadItems, totalFiles, totalFolders).ret;
                    switch (actionType) {
                        case types.RECEIVE_DOCUMENTS:
                            dispatch(receiveDocumentsList(items, nextUrl, documentlist, datasource, totalFiles, totalFolders))
                            break
                        case types.REFRESH_DOCUMENTS_LIST:
                            dispatch(refreshDocumentsList(items, nextUrl, documentlist, datasource, totalFiles, totalFolders))
                            break
                    }


                }
            })
            .catch((error) => {
                dispatch(navActions.emitError("Failed to retrieve documents", ""))
                writeToLog(email, constans.ERROR, `function fetchDocumentsTable - Failed to retrieve documents - url: ${url}`, error)

            })
    }
}


export function fetchTableIfNeeded() {
    return (dispatch, getState) => {

        var documentlist = getDocumentsContext(getState().navReducer);
        const {documentsReducer} = getState()
        if (shouldFetchDocuments(documentsReducer, documentlist)) {
            const nextUrl = getNextUrl(getState().accessReducer.env, getState().accessReducer.sessionToken, documentsReducer, documentlist)
            return dispatch(fetchDocumentsTable(nextUrl, documentlist, types.RECEIVE_DOCUMENTS))
        }
    }
}
export function refreshTable(documentlist: Object, updateRouteData: boolean = true) {
    return (dispatch, getState) => {
        const url = constructRetrieveDocumentsUrl(getState().accessReducer.env, getState().accessReducer.sessionToken, documentlist.fId, documentlist.sortBy, documentlist.sortDirection, documentlist.catId, documentlist.keyboard)
        const {sessionToken, env, email} = getState().accessReducer;
        writeToLog(email, constans.DEBUG, `function refreshTable - url: ${url}`)

        if (updateRouteData) {
            dispatch(navActions.updateRouteData(documentlist))
        }
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
        var items = [];
        var nextUrl = ""
        var dataSource = {};
        dispatch(refreshDocumentsList(items, nextUrl, documentlist, dataSource))
    }
}

function getNextUrl(env: string, sessionToken: string, documentsReducer: Object, documentlist: Object) {

    const activeDocumentsList = documentsReducer[documentlist.catId]
    if (!activeDocumentsList || activeDocumentsList.nextUrl === false || activeDocumentsList.nextUrl == "" || activeDocumentsList.nextUrl == nul) {
        return constructRetrieveDocumentsUrl(env, sessionToken, documentlist.fId, documentlist.sortBy, documentlist.sortDirection, documentlist.catId, documentlist.keyboard)
    }
    return activeDocumentsList.nextUrl
}


function receiveDocumentsList(documents: Object, nextUrl: string, documentlist: Object, dataSource: Object, totalFiles: number, totalFolders: number) {
    return {
        type: types.RECEIVE_DOCUMENTS,
        nextUrl,
        catId: documentlist.catId,
        documents,
        dataSource,
        totalFiles,
        totalFolders
    }
}


function refreshDocumentsList(documents: Object, nextUrl: string, documentlist: Object, dataSource: Object, totalFiles: number, totalFolders: number) {

    return {
        type: types.REFRESH_DOCUMENTS_LIST,
        nextUrl,
        catId: documentlist.catId,
        documents,
        dataSource,
        totalFiles,
        totalFolders
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

function shouldFetchDocuments(documentsReducer: Object, documentlist: Object) {
    const activeDocumentsList = documentsReducer[documentlist.catId]

    if (typeof (activeDocumentsList) == 'undefined' || activeDocumentsList.items.length == 0 || !activeDocumentsList.isFetching && (activeDocumentsList.nextUrl !== null) && (activeDocumentsList.nextUrl !== "")) {
        console.log("shouldFetchDocuments" + !activeDocumentsList + ",true")
        return true
    }
    console.log("shouldFetchDocuments" + !activeDocumentsList + ",false")
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
        const {sessionToken, env, email} = getState().accessReducer;
        const folderId = documentlist.fId;
        const createFolderUrl = getCreateFolderUrl(env, sessionToken, documentlist.fId, folderName, isVault);
        dispatch(UpdateCreateingFolderState(1))
        writeToLog(email, constans.DEBUG, `function createFolder - url: ${createFolderUrl}`)
        return fetch(createFolderUrl)
            .then(response => response.json())
            .then(json => {
                if (json.ResponseStatus == "FAILED") {
                    // dispatch(failedToFetchDocumentsList(documentlist, "", json.ResponseData.ErrorMessage))

                    if (json.ErrorMessage.indexOf('VAL10357') > -1) {
                        dispatch(navActions.emitError("Folder Name already exists"))
                        writeToLog(email, constans.ERROR, `function createFolder - Folder Name already exists - url: ${createFolderUrl}`)
                    }
                    else {
                        dispatch(navActions.emitError("Error creating new folder"))
                        writeToLog(email, constans.ERROR, `function createFolder - Error creating new folder - url: ${createFolderUrl}`)
                    }

                    dispatch(UpdateCreateingFolderState(2))


                }
                else {
                    dispatch(UpdateCreateingFolderState(2))
                    dispatch(refreshTable(documentlist, false))

                }

            })
            .catch((error) => {
                dispatch(navActions.emitError("Error creating new folder"))
                dispatch(UpdateCreateingFolderState(0))
                writeToLog(email, constans.ERROR, `function createFolder - Error creating new folder - url: ${createFolderUrl}`, error)
            })
    }
}


export function downloadDocument(id: string, fileName: string) {
    return (dispatch, getState) => {
        const {sessionToken, env, email} = getState().accessReducer;
        //dispatch(updateIsFetching(true)); 
        dispatch(navActions.emitToast('info', 'Document will be downloaded shortly'));
        const url = getDownloadFileUrl(env, sessionToken, id);
        writeToLog(email, constans.DEBUG, `function downloadDocument - url: ${url}`)
        fetch(url)
            .then(response => response.json())
            .then(json => {
                var downloadUrl = json.ResponseData.AccessUrl;
              //  downloadUrl = 'http://images.one.co.il/images/d/dmain/ms/gg1268053.jpg';
              downloadUrl = 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQNua9BAIpL7ryiLkbL1-UleMUqURv--Ikt7y6dwb8GgH2Rx7D0';
                 //  console.log('downloadurl: ' + downloadUrl);
                //alert(Android_Download_Path + "/" + fileName)

                RNFetchBlob.config({
                //    path : Android_Download_Path + "/" + fileName,
                    fileCache: true,
                    // android only options, these options be a no-op on IOS
                    addAndroidDownloads: {
                        useDownloadManager: true,
                        // Show notification when response data transmitted
                        notification: true,
                        // Title of download notification
                        title: fileName,
                        // File description (not notification description)
                        description: 'Download completed',
                        // mime : 'vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        // Make the file scannable  by media scanner
                        meidaScannable: true,
                    }
                })
                    .fetch('GET', downloadUrl)
                    .then((res) => {

                    })

            }).catch(error => {
                dispatch(navActions.emitToast('error downloading document'))
                writeToLog(email, constans.ERROR, `function downloadDocument - error downloading document - url: ${url}`, error)

            })
            .done();
    }
}



function uploadFile(data, file) {

    return new Promise((resolve, reject) => {
        data.xhr.onerror = function(e) {
            // console.log('error uploading: ' + JSON.stringify(e));
            reject(e);
        };
        data.xhr.onreadystatechange = function() {
            if (data.xhr.readyState === XMLHttpRequest.DONE) {
                if ((data.xhr.status >= 200 && data.xhr.status <= 299) || data.xhr.status == 0) {
                    resolve(data);
                } else {
                    // failed with error messge from server
                    reject(data.xhr.status + ": " + data.url);
                }
            }
        };
        data.xhr.open('PUT', data.url, true);
        data.xhr.setRequestHeader('Content-Type', 'multipart/form-data');

        data.xhr.upload.addEventListener('progress', function(e) {
            console.log('upload progress = ' + e.loaded + "/" + e.total);
        }, false);

        //   var formData = new FormData(); 
        //   formData.append('file', file);
        data.xhr.send(file);
    });
}

export function updateUploadDocument(datasource: object, uploadItems: object, catId: string) {
    return {
        type: types.UPDATE_UPLOAD_LIST,
        datasource,
        uploadItems,
        catId
    }
}

export function updateItems(datasource: object, items: object, catId: string) {
    return {
        type: types.UPDATE_UPLOAD_LIST,
        datasource,
        items,
        catId
    }
}

export function clearDocumentList(catId: string) {
    return {
        type: types.CLEAR_DOCUMENT_LIST,
        catId
    }
}

export function removeUploadDocument(Id: string, catId: string) {
    return (dispatch, getState) => {

        const items = getState().documentsReducer[catId].items;
        const totalFiles = getState().documentsReducer[catId].totalFiles;
        const totalFolders = getState().documentsReducer[catId].totalFolders;

        var uploads = [...getState().documentsReducer[catId].uploadItems];

        var uploadObj = _.find(uploads, 'Id', Id);
        //  uploadObj.xhr = null;

        _.remove(uploads, {
            Id: Id
        });
        var datasource = AssembleTableDatasource(items, uploads, totalFiles, totalFolders).ret;
        dispatch(updateUploadDocument(datasource, uploads, catId));

        var documentlist = getDocumentsContext(getState().navReducer);
        if (catId == documentlist.catId) {
            dispatch(refreshTable(documentlist, false));
        }
        else {
            if (isDocumentsContextExists(getState().navReducer, catId)) {
                documentlist = getDocumentsContextByCatId(getState().navReducer, catId)
                dispatch(refreshTable(documentlist, false));
            }
            else {
                dispatch(clearDocumentList(catId));
            }
        }
    }

}


function uploadDocumentObject(fileObject: object, uploadId: string) {
    return (dispatch, getState) => {
        var documentlist = getDocumentsContext(getState().navReducer);
        let uploadObj = _.find(getState().documentsReducer[documentlist.catId].uploadItems, { 'Id': uploadId });
        const {sessionToken, env} = getState().accessReducer;

        fetch(uploadObj.url)
            .then(response => response.json())
            .then(json => {
                if (json.ResponseStatus == "FAILED") {

                    dispatch(emitToast("error", "failed to upload file"))
                }
                else {
                    var AccessUrl = json.ResponseData.AccessUrl;
                    var userData = parseUploadUserData(json.UserData);
                    var currUploadId = userData.uploadId;
                    var currCatId = userData.catId;
                    uploadFile({ xhr: uploadObj.xhr, uploadId: currUploadId, url: AccessUrl, catId: currCatId }, fileObject)
                        .then((data) => {

                            if (data.xhr.status == 0)  // xhr.abort was triggered from out side => upload paused 
                            {
                                dispatch(updateUploadItems(data.uploadId, data.catId, 0));
                                return;
                            }
                            const thisCompletedUrl = getUploadFileCompletedUrl(getState().accessReducer.env, getState().accessReducer.sessionToken, data.url, constrcutUploadUSerData(encodeURIComponent(data.uploadId), encodeURIComponent(data.catId)));

                            fetch(thisCompletedUrl)
                                .then(response => response.json())
                                .then(json => {
                                    // alert(JSON.stringify(json.UserData));
                                    var userData = parseUploadUserData(json.UserData);
                                    var finalUploadId = userData.uploadId;
                                    var finalCatId = userData.catId;
                                    //alert(finalUploadId)
                                    dispatch(removeUploadDocument(finalUploadId, finalCatId));
                                    if (json.ResponseStatus == 'OK') {

                                        let message = ""
                                        // if(isUpdateVersion)
                                        //   message = "Successfully updated document version"
                                        // else
                                        message = "File successfully uploaded"

                                        dispatch(navActions.emitToast("info", message));

                                    }
                                    else {

                                        // if(!isUpdateVersion)
                                        //     message = `Error. failed to upload file ${fileObject.name}`
                                        //   else
                                        //  message = "Error. failed to update version"
                                        message = "File successfully uploaded"
                                        dispatch(navActions.emitToast("error", message));
                                        //  writeToLog(env, sessionToken, constans.ERROR, `function uploadToKenesto - Failed to upload file to kenesto - url: ${url}`, JSON.stringify(fileObject))
                                    }



                                })
                                .catch((error) => {
                                    var userData = parseUploadUserData(json.UserData);
                                    dispatch(removeUploadDocument(userData.uploadId, userData.catId));
                                    dispatch(navActions.emitToast("info", "Error. failed to upload file 1"))
                                    writeToLog(env, sessionToken, constans.ERROR, `function uploadToKenesto - Failed to upload file to kenesto - url: ${uploadObj.url}`, JSON.stringify(fileObject), error)
                                })

                        })
                        .catch(err => {
                            var userData = parseUploadUserData(json.UserData);
                            dispatch(removeUploadDocument(userData.uploadId, userData.catId));
                            dispatch(navActions.emitToast("error", "Error. failed to upload file 2"))
                        });


                }
            })
            .catch((error) => {
                var userData = parseUploadUserData(json.UserData);
                dispatch(removeUploadDocument(userData.uploadId, userData.catId));
                dispatch(navActions.emitToast("error", "Error. failed to upload file 3"))
            })
    }
}


export function resumeUploadToKenesto(uploadId: string) {
    return (dispatch, getState) => {
        var documentlist = getDocumentsContext(getState().navReducer);
        let existingObj = _.find(getState().documentsReducer[documentlist.catId].uploadItems, { 'Id': uploadId });
        dispatch(updateUploadItems(existingObj.Id, existingObj.catId, -1));
        dispatch(uploadDocumentObject(existingObj.fileObject, existingObj.Id));
    }
}

export function uploadToKenesto(fileObject: object, url: string) {
    return (dispatch, getState) => {
        const uploadId = fileObject.name + "_" + Date.now();
        var documentlist = getDocumentsContext(getState().navReducer);
        if (url != '')
            url = url + "&ud=" + constrcutUploadUSerData(encodeURIComponent(uploadId), encodeURIComponent(documentlist.catId));

        const items = getState().documentsReducer[documentlist.catId].items;
        const totalFiles = getState().documentsReducer[documentlist.catId].totalFiles;
        const totalFolders = getState().documentsReducer[documentlist.catId].totalFolders;
        var xhr = new XMLHttpRequest();
        xhr.status = -1;
        var newUploadItems = [...getState().documentsReducer[documentlist.catId].uploadItems, { Id: uploadId, catId: documentlist.catId, FamilyCode: 'UPLOAD_PROGRESS', Name: fileObject.name, Size: fileObject.size, fileExtension: fileObject.fileExtension, uploadStatus: -1, xhr: xhr, fileObject: fileObject, url: url }];
        var datasource = AssembleTableDatasource(items, newUploadItems, totalFiles, totalFolders).ret;
        dispatch(updateUploadDocument(datasource, newUploadItems, documentlist.catId));
        dispatch(uploadDocumentObject(fileObject, uploadId));

    }
}

export function updateDocumentVersion(catId: string, fileObject: object, url: string, baseFileId: string, isUploading: boolean) {
    return (dispatch, getState) => {

        if (url != '')
            url = url + "&ud=" + constrcutUploadUSerData(encodeURIComponent(baseFileId), encodeURIComponent(catId));

        const items = getState().documentsReducer[catId].items;
        const uploadItems = getState().documentsReducer[catId].uploadItems;
        const totalFiles = getState().documentsReducer[catId].totalFiles;
        const totalFolders = getState().documentsReducer[catId].totalFolders;
        var xhr = new XMLHttpRequest();
        xhr.status = -1;
        for (var i = 0; i < items.length; i++) {
            if (items[i].Id == baseFileId) {
                items[i].IsUploading = isUploading;
                items[i].UploadUrl = url,
                    items[i].xhr = xhr,
                    items[i].fileObject = fileObject
            }
        }

        var datasource = AssembleTableDatasource(items, uploadItems, totalFiles, totalFolders).ret;
        dispatch(updateItemsState(datasource, items, catId));

        if (isUploading) {
            dispatch(uploadNewVersion(fileObject, baseFileId));
        }
        else {
            var documentlist = getDocumentsContext(getState().navReducer);
            if (catId == documentlist.catId) {
                dispatch(refreshTable(documentlist, false));
            }
            else {
                if (isDocumentsContextExists(getState().navReducer, catId)) {
                    documentlist = getDocumentsContextByCatId(getState().navReducer, catId)
                    dispatch(refreshTable(documentlist, false));
                }
                else {
                    dispatch(clearDocumentList(catId));
                }
            }
        }
    }
}

function uploadNewVersion(fileObject: object, baseFileId: string) {
    return (dispatch, getState) => {
        var documentlist = getDocumentsContext(getState().navReducer);
        let uploadObj = _.find(getState().documentsReducer[documentlist.catId].items, { 'Id': baseFileId });
        const {sessionToken, env, email} = getState().accessReducer;
        fetch(uploadObj.UploadUrl)
            .then(response => response.json())
            .then(json => {
                if (json.ResponseStatus == "FAILED") {

                    dispatch(emitToast("error", "failed to upload file"))
                }
                else {
                    var AccessUrl = json.ResponseData.AccessUrl;
                    var userData = parseUploadUserData(json.UserData);
                    var currUploadId = userData.uploadId;
                    //alert(currUploadId)
                    var currCatId = userData.catId;
                    uploadFile({ xhr: uploadObj.xhr, uploadId: currUploadId, url: AccessUrl, catId: currCatId }, fileObject)
                        .then((data) => {

                            // if (data.xhr.status == 0)  // xhr.abort was triggered from out side => upload paused 
                            // {
                            //     dispatch(updateUploadItems(data.uploadId, 0));
                            //     return;
                            // }

                            const thisCompletedUrl = getUploadFileCompletedUrl(getState().accessReducer.env, getState().accessReducer.sessionToken, data.url, constrcutUploadUSerData(encodeURIComponent(data.uploadId), encodeURIComponent(data.catId)));

                            fetch(thisCompletedUrl)
                                .then(response => response.json())
                                .then(json => {
                                    var userData = parseUploadUserData(json.UserData);
                                    var finalUploadId = userData.uploadId;
                                    var finalCatId = userData.catId;
                                    //alert(finalUploadId)
                                    dispatch(updateDocumentVersion(finalCatId, fileObject, "", finalUploadId, false));
                                    if (json.ResponseStatus == 'OK') {
                                        let message = "Successfully updated document version"
                                        dispatch(navActions.emitToast("info", message));
                                    }
                                    else {
                                        let message = "Error. failed to update version"
                                        dispatch(navActions.emitToast("error", message));
                                        writeToLog(email, constans.ERROR, `function uploadNewVersion - Failed to upload file to kenesto - AccessUrl: ${AccessUrl}`, JSON.stringify(fileObject))
                                    }



                                })
                                .catch((error) => {
                                    writeToLog(email, constans.ERROR, `function uploadDocumentVersion -failed to upload file`, error)
                                    var userData = parseUploadUserData(json.UserData);
                                    dispatch(updateDocumentVersion(userData.catId, fileObject, "", userData.uploadId, false));

                                    dispatch(navActions.emitToast("error", "Error. failed to update version"))
                                    writeToLog(env, sessionToken, constans.ERROR, `function uploadToKenesto - Failed to upload file to kenesto - url: ${uthisCompletedUrl}`, error)
                                })

                        })
                        .catch(err => {
                            writeToLog(email, constans.ERROR, `function uploadDocumentVersion -failed to upload file`, err)
                            var userData = parseUploadUserData(json.UserData);
                            dispatch(updateDocumentVersion(userData.catId, fileObject, "", userData.uploadId, false));
                            dispatch(navActions.emitToast("error", "Error. failed to update version"))
                        });


                }
            })
            .catch((error) => {
                writeToLog(email, constans.ERROR, `function uploadDocumentVersion -failed to upload file`, error)
                var userData = parseUploadUserData(json.UserData);
                dispatch(updateDocumentVersion(userData.catId, fileObject, "", userData.uploadId, false));
                dispatch(navActions.emitToast("error", "Error. failed to update version"))
            })
    }
}

// getDeleteFolderUrl
export function deleteAsset(id: string, familyCode: string) {
    return (dispatch, getState) => {
        dispatch(updateIsFetching(true));
        const {sessionToken, env, email} = getState().accessReducer;

        const url = getDeleteAssetUrl(env, sessionToken, id, familyCode);
        writeToLog(email, constans.DEBUG, `function deleteAsset - url: ${url}`)
        return fetch(url)
            .then(response => response.json())
            .then(json => {
                dispatch(updateIsFetching(false));
                if (json.ResponseStatus == "FAILED") {
                    dispatch(navActions.emitToast("error", "", "Error deleting asset"))
                    writeToLog(email, constans.ERROR, `function deleteAsset - Error deleting asset - url: ${url}`)
                }
                else {
                    dispatch(navActions.emitToast("success", "", "successfully deleted the asset"))
                    var documentlist = getDocumentsContext(getState().navReducer);
                    dispatch(refreshTable(documentlist, false))
                }
            })
            .catch((error) => {
                dispatch(navActions.emitToast("error", "", "Failed to delete asset"))
                writeToLog(email, constans.ERROR, `function deleteAsset - Failed to delete asset - url: ${url}`, error)
            })

    }
}

export function deleteFolder(id: string) {
    return (dispatch, getState) => {
        dispatch(updateIsFetching(true));
        const {sessionToken, env, email} = getState().accessReducer;
        const url = getDeleteFolderUrl(env, sessionToken, id);
        writeToLog(email, constans.DEBUG, `function deleteFolder - url: ${url}`)
        return fetch(url)
            .then(response => response.json())
            .then(json => {
                dispatch(updateIsFetching(false));
                if (json.ResponseStatus == "FAILED") {
                    dispatch(navActions.emitToast("error", "", "Error deleting folder"))
                    writeToLog(email, constans.ERROR, `function deleteFolder - Failed to delete folder - url: ${url}`)
                }
                else {
                    dispatch(navActions.emitToast("success", "", "successfully deleted the folder"))
                    var documentlist = getDocumentsContext(getState().navReducer);
                    dispatch(refreshTable(documentlist, false))
                }
            })
            .catch((error) => {
                dispatch(navActions.emitToast("error", error, "Failed to delete folder"))
                writeToLog(email, constans.ERROR, `function deleteFolder - Failed to delete folder - url: ${url}`, error)
            })

    }
}



export function SetSharingPermissions(tags: object) {

    var permissions = [];
    tags.map((t) => (
        permissions.push({
            ParticipantUniqueID: t.tagID, FamilyCode: t.aditionalData, AccessLinkID: '00000000-0000-0000-0000-000000000000',
            ForUpdate: "true", PermissionTypeValue: 'VIEW_ONLY', AllowShare: "false", AllowUpload: "false"
        })
    ))

    return {
        type: types.SET_SHARING_PERMISSIONS,
        sharingPermissions: permissions
    }
}


export function UpdateDocumentSharingPermission() {
    return (dispatch, getState) => {
        const documentLists = getState().documentsReducer;
        const navReducer = getState().navReducer;
        const document = getSelectedDocument(documentLists, navReducer);
        const triggerSelectedValue = navReducer.triggerSelectedValue;
        const uersDetails = getState().navReducer.clickedTrigger.split('_');
        const ParticipantUniqueID = uersDetails[1];
        const familyCode = uersDetails[2];
        const triggerId = 'trigger_' + ParticipantUniqueID;

        var sharingPermissions = [];
        sharingPermissions.push({
            ParticipantUniqueID: ParticipantUniqueID, FamilyCode: familyCode, AccessLinkID: '00000000-0000-0000-0000-000000000000',
            ForUpdate: "true", PermissionTypeValue: triggerSelectedValue, AllowShare: "false", AllowUpload: "false"
        });

        const sharingObject = {
            asset: {
                ID: document.Id,
                UsersPermissions: sharingPermissions
            }
        }

        const {sessionToken, env, email} = getState().accessReducer;
        const url = getShareDocumentUrl(env, sessionToken);
        writeToLog(email, constans.DEBUG, `function UpdateDocumentSharingPermission - ParticipantUniqueID:${ParticipantUniqueID} ID:${document.Id} url: ${url}`)

        var request = new Request(url, {
            method: 'post',
            mode: 'cors',
            redirect: 'follow',
            processData: false,
            cache: false,
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(sharingObject)
        });

        fetch(request).then(response => {
            //  setTimeout(function(){ dispatch(peopleActions.RemoveFromFetchingList(triggerId));}, 3000);
            dispatch(peopleActions.RemoveFromFetchingList(triggerId));
            //     alert(JSON.stringify(response))

        }).catch((error) => {
            dispatch(navActions.emitError(error, ""))
            writeToLog(email, constans.ERROR, `function UpdateDocumentSharingPermission - Failed! ParticipantUniqueID:${ParticipantUniqueID} ID:${document.Id} url: ${url}`, error)
        }).done();



    }
}

export function DiscardCheckOut() {

    return (dispatch, getState) => {
        const documentLists = getState().documentsReducer;
        const navReducer = getState().navReducer;
        var document = getSelectedDocument(documentLists, navReducer);
        const {sessionToken, env, email} = getState().accessReducer;
        const url = getDiscardCheckOutDocumentUrl(env, sessionToken, document.Id);
        writeToLog(email, constans.DEBUG, `function DiscardCheckOut - url: ${url}`)

        dispatch(updateIsFetching(true));
        fetch(url)
            .then(response => response.json())
            .then(json => {
                if (json.ResponseStatus == "FAILED") {
                    dispatch(updateIsFetching(false));
                    dispatch(navActions.emitError("Failed to discard Check-Out document", ""))
                    writeToLog(email, constans.ERROR, `function DiscardCheckOut - Failed to discard Check-Out document! - url: ${url}`)
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
                writeToLog(email, constans.ERROR, `function DiscardCheckOut - Failed to discard Check-Out document! - url: ${url}`, error)

            }).done();
    }

}
export function CheckOut() {

    return (dispatch, getState) => {
        const documentLists = getState().documentsReducer;
        const navReducer = getState().navReducer;
        var document = getSelectedDocument(documentLists, navReducer);
        const {sessionToken, env, email} = getState().accessReducer;
        const url = getCheckOutDocumentUrl(env, sessionToken, document.Id);
        writeToLog(email, constans.DEBUG, `function CheckOut - url: ${url}`)
        dispatch(updateIsFetching(true));
        fetch(url)
            .then(response => response.json())
            .then(json => {
                if (json.ResponseStatus == "FAILED") {
                    dispatch(updateIsFetching(false));
                    dispatch(navActions.emitError("Failed to Check-Out document", ""))
                    writeToLog(email, constans.ERROR, `function CheckOut - Failed to Check-Out document! - url: ${url}`)
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
                writeToLog(email, constans.ERROR, `function CheckOut - Failed to Check-Out document! - url: ${url}`, error)

            }).done();
    }

}


export function CheckIn(comment: string) {

    return (dispatch, getState) => {
        const documentLists = getState().documentsReducer;
        const navReducer = getState().navReducer;
        var document = getSelectedDocument(documentLists, navReducer);
        const {sessionToken, env, email} = getState().accessReducer;
        const url = getCheckInDocumentUrl(env, sessionToken);
        writeToLog(email, constans.DEBUG, `function CheckIn - url: ${url}`)
        dispatch(updateIsFetching(true));
        const jsonObject = {
            asset: {
                ID: document.Id,
                Comment: comment
            }
        }
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
                    writeToLog(email, constans.ERROR, `function CheckIn - Failed to Check-In document! - url: ${url}`)
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
                writeToLog(email, constans.ERROR, `function CheckIn - Failed to Check-In document! - url: ${url}`, error)
            }).done();
    }

}

export function EditFolder(fId: string, folderName: string, isVault: boolean) {

    return (dispatch, getState) => {
        var documentlist = getDocumentsContext(getState().navReducer);
        const {sessionToken, env, email} = getState().accessReducer;
        const url = getEditFolderUrl(env, sessionToken, fId, folderName, isVault);
        writeToLog(email, constans.DEBUG, `function EditFolder - url: ${url}`)

        dispatch(updateIsFetching(true));
        fetch(url)
            .then(response => response.json())
            .then(json => {
                if (json.ResponseStatus == "FAILED") {
                    dispatch(updateIsFetching(false));

                    if (json.ErrorMessage.indexOf('VAL10357') > -1) {
                        dispatch(navActions.emitError("Folder Name already exists"))
                        writeToLog(email, constans.ERROR, `function EditFolder - Folder Name already exists! - url: ${url}`)
                    }
                    else {
                        dispatch(navActions.emitError("Failed to edit folder", ""))
                        writeToLog(email, constans.ERROR, `function EditFolder - Failed to edit folder! - url: ${url}`)
                    }

                }
                else {
                    dispatch(updateIsFetching(false));
                    dispatch(refreshTable(documentlist, false));
                    dispatch(navActions.emitToast("success", "folder successfully updated.", ""));
                    dispatch(navActions.clearToast());
                }

            }).catch((error) => {
                dispatch(updateIsFetching(false));
                dispatch(navActions.emitError("Failed to edit folder", ""))
                writeToLog(email, constans.ERROR, `function EditFolder - Failed to edit folder! - url: ${url}`, error)
            }).done();
    }

}

export function EditDocument(documentId: string, documentName: string) {
    return (dispatch, getState) => {
        var documentlist = getDocumentsContext(getState().navReducer);
        const {sessionToken, env, email} = getState().accessReducer;
        const url = getEditDocumentUrl(env, sessionToken, documentId, documentName);
        writeToLog(email, constans.DEBUG, `function EditDocument - url: ${url}`)

        dispatch(updateIsFetching(true));
        fetch(url)
            .then(response => response.json())
            .then(json => {
                if (json.ResponseStatus == "FAILED") {
                    dispatch(updateIsFetching(false));
                    dispatch(navActions.emitError("Failed to edit document", ""))
                    writeToLog(email, constans.ERROR, `function EditFolder - Failed to edit document! - url: ${url}`)
                }
                else {
                    dispatch(updateIsFetching(false));
                    dispatch(refreshTable(documentlist, false));
                    dispatch(navActions.emitToast("success", "document successfully updated.", ""));
                    dispatch(navActions.clearToast());
                }

            }).catch((error) => {
                dispatch(updateIsFetching(false));
                dispatch(navActions.emitError("Failed to edit document", ""))
                writeToLog(email, constans.ERROR, `function EditFolder - Failed to edit document! - url: ${url}`, error)
            }).done();
    }

}


export function ShareDocument() {

    return (dispatch, getState) => {
        const documentLists = getState().documentsReducer;
        const navReducer = getState().navReducer;
        var document = getSelectedDocument(documentLists, navReducer);
        const addPeopleTriggerValue = getState().navReducer.addPeopleTriggerValue;
        const sharingPermissions = documentLists.sharingPermissions;
        const {sessionToken, env, email} = getState().accessReducer;

        for (var i = 0; i < sharingPermissions.length; i++) {
            sharingPermissions[i].PermissionTypeValue = addPeopleTriggerValue;
        }

        const sharingObject = {
            asset: {
                ID: document.Id,
                UsersPermissions: sharingPermissions
            }
        }

        const url = getShareDocumentUrl(env, sessionToken);
        writeToLog(email, constans.DEBUG, `function ShareDocument - ID:${document.Id} url: ${url}`)


        var request = new Request(url, {
            method: 'post',
            mode: 'cors',
            redirect: 'follow',
            processData: false,
            cache: false,
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(sharingObject)
        });

        fetch(request)
            .then(response => response.json())
            .then(json => {
                if (json.ResponseStatus == "FAILED") {
                    dispatch(navActions.emitError("Failed to share document", ""))
                    writeToLog(email, constans.ERROR, `function ShareDocument -Failed to share document! - ID:${document.Id} url: ${url}`)
                }
                else {
                    dispatch(navActions.pop());
                    dispatch(navActions.emitToast("success", "Sharing settings updated", ""));

                }

            }).catch((error) => {
                dispatch(navActions.emitError("Failed to share object", ""))
                writeToLog(email, constans.ERROR, `function ShareDocument -Failed to share document! - ID:${document.Id} url: ${url}`, error)
            }).done();
    }

}


export function updateUploadItemsState(datasource: object, uploadItems: object, catId: string) {
    return {
        type: types.UPDATE_UPLOAD_ITEM,
        datasource,
        uploadItems,
        catId
    }
}

export function updateItemsState(datasource: object, items: object, catId: string) {
    return {
        type: types.UPDATE_ITEMS,
        datasource,
        items,
        catId
    }
}

export function updateUploadItems(uploadId: string, catId: string, status: number) {

    return (dispatch, getState) => {

        //console.log('baba 3');


        const items = getState().documentsReducer[catId].items;
        const uploadItems = getState().documentsReducer[catId].uploadItems;
        const totalFiles = getState().documentsReducer[catId].totalFiles;
        const totalFolders = getState().documentsReducer[catId].totalFolders;

        //   var documentlist = getDocumentsContext(getState().navReducer);
        //  var uploadItems = getState().documentsReducer[documentlist.catId].uploadItems;

        var obj = _.find(uploadItems,
            { 'Id': uploadId }
        );

        obj.uploadStatus = status

        // _.remove(uploadItems, {
        //     Id: action.uploadId
        // });

        // uploadItems.push(obj)

        var datasource = AssembleTableDatasource(items, uploadItems, totalFiles, totalFolders).ret;

        dispatch(updateUploadItemsState(datasource, uploadItems, catId));


    }

}

