import {config} from './app.config'
import _ from 'lodash'
import stricturiEncode from 'strict-uri-encode'
import * as constans from '../constants/GlobalConstans'

export function constructRetrieveDocumentsUrl(env, sessionToken, fId, sortBy, sortDirection, catId, keyboard) {
  var urls = _.find(config.urls, { 'env': env });
  const splitChars = '|';
  var apiBaseUrl = urls.ApiBaseUrl;
  var url
  keyboard = typeof (keyboard) == 'undefined' ? "":encodeURIComponent(keyboard)
  if (urls == null)
    return null;

  if (catId.indexOf(splitChars) >= 0) {
    var dtlStr = catId.split(splitChars);
    var key = dtlStr[0]
  }
  else {
    var key = catId
  }

  var functionName = 'RetrieveDocuments';
  switch (key) {
    case constans.MY_DOCUMENTS:
      functionName = 'RetrieveMyDocuments';
      break;
    case constans.ALL_DOCUMENTS:
      functionName = 'RetrieveDocuments';
      break;
    case constans.ARCHIVED_DOCUMENTS:
      functionName = 'RetrieveArchivedDocuments';
      break;
    case constans.DOCUMENTS_SHARE_WITH_ME:
      functionName = 'RetrieveSharedDocuments';
      break;
    case constans.CHECKED_OUT_DOCUMENTS:
      functionName = 'RetrieveCheckedOutDocuments';
    case constans.SEARCH_DOCUMENTS:
      functionName = 'DocumentsQuickSearch';
      break;
  }

  if(key == constans.SEARCH_DOCUMENTS)
  {
    return `${apiBaseUrl}/KDocuments.svc/${functionName}?t=${sessionToken}&k=${keyboard}`
  }
  else
  {
    if ( typeof (fId) == 'undefined' || fId == "") {
      return `${apiBaseUrl}/KDocuments.svc/${functionName}?t=${sessionToken}&sb=${sortBy}&sd=${sortDirection}`
    }
    else {
      return `${apiBaseUrl}/KDocuments.svc/${functionName}?t=${sessionToken}&fid=${fId}&sb=${sortBy}&sd=${sortDirection}`
    }
  }
}


export function getDocumentPermissionsUrl(env, sessionToken, documentId, familyCode) {
  var urls = _.find(config.urls, { 'env': env });
  var apiBaseUrl = urls.ApiBaseUrl;
  if (urls == null)
    return null;

  return `${apiBaseUrl}/KDocuments.svc/RetrieveObjectPermissions?t=${sessionToken}&oi=${documentId}&fc=${familyCode}`;
}

export function getCreateFolderUrl(env, sessionToken, fId, folderName, isVault) {
  var urls = _.find(config.urls, { 'env': env });
  var apiBaseUrl = urls.ApiBaseUrl;
  if (urls == null)
    return null;
  var folderId = (typeof (fId) == 'undefined' || fId == null || fId == '') ? '00000000-0000-0000-0000-000000000000' : fId;

  return `${apiBaseUrl}/KDocuments.svc/CreateFolder?t=${sessionToken}&pid=${folderId}&fn=${encodeURIComponent(folderName)}&iv=${isVault}&fd=''`;
}

export function getEditFolderUrl(env, sessionToken, fId, folderName, isVault) {
  var urls = _.find(config.urls, { 'env': env });
  var apiBaseUrl = urls.ApiBaseUrl;
  if (urls == null)
    return null;
 

  return `${apiBaseUrl}/KDocuments.svc/EditFolder?t=${sessionToken}&fid=${fId}&fn=${encodeURIComponent(folderName)}&iv=${isVault}`;
}

export function getEditDocumentUrl(env, sessionToken, documentId, documentName) {
  var urls = _.find(config.urls, { 'env': env });
  var apiBaseUrl = urls.ApiBaseUrl;
  if (urls == null)
    return null;
 

  return `${apiBaseUrl}/KDocuments.svc/UpdateAssetName?t=${sessionToken}&did=${documentId}&dn=${encodeURIComponent(documentName)}`;
}


export function getDocumentsContext(navReducer: Object) {
  //console.log("getDocumentsContext:" + JSON.stringify(navReducer))

  
  if (typeof (navReducer) == 'undefined' || navReducer == "" || navReducer.index == 0 || typeof (navReducer.routes[navReducer.index].data) == 'undefined') {
  
    return ({})
  }

  var currRoute = navReducer.routes[navReducer.index];
  return (
    {
      name: currRoute.data.name,
      catId: currRoute.data.catId,
      fId: currRoute.data.fId,
      sortDirection: currRoute.data.sortDirection,
      sortBy: currRoute.data.sortBy,
      keyboard:currRoute.data.keyboard

    })
}

export function getDocumentsTitle(categoryType: String) {
  switch (categoryType) {
    case constans.MY_DOCUMENTS:
      return "My Documents";
    case constans.ALL_DOCUMENTS:
      return "All Documents";
    case constans.DOCUMENTS_SHARE_WITH_ME:
      return "Shared with me";
    case constans.CHECKED_OUT_DOCUMENTS:
      return "Checked-out Documents";
    case constans.ARCHIVED_DOCUMENTS:
      return "Archived Documents";
       case constans.SEARCH_DOCUMENTS:
      return "Search Documents";
    default:
      return "My Documents";

  }
}

export function getSelectedDocument(documentlists: Object, navReducer: Object){


    var context = getDocumentsContext(navReducer);
    var catId = context.catId;
    var items = documentlists[catId].items;

    const selectedId = documentlists.selectedObject.id; 
   return selectedId == '' || selectedId == null ? null : _.find(items, { 'Id': selectedId }); 
}


export function getFileUploadUrl(env: string, sessionToken: string, path: string, fileDescription : string= "", fileKeyword: string ="", folderId: string = '00000000-0000-0000-0000-000000000000', baseFileId: string = '00000000-0000-0000-0000-000000000000', userData :string = ''){
  const urls = _.find(config.urls, { 'env': env });
   const apiBaseUrl = urls.ApiBaseUrl; 
   return  `${apiBaseUrl}/KDocuments.svc/UploadFile?t=${sessionToken}&p=${path}&fd=${fileDescription}&fk=${fileKeyword}&fid=${folderId}&bid=${baseFileId}&ud=${userData}`;
}

export function getUploadFileCompletedUrl(env: string, sessionToken: string,url: string, userData: string = ''){
   const urls = _.find(config.urls, { 'env': env });
   const apiBaseUrl = urls.ApiBaseUrl; 
     return  `${apiBaseUrl}/KDocuments.svc/UploadFileCompleted?t=${sessionToken}&u=${url}&ud=${userData}`;
}

export function getDownloadFileUrl(env: string, sessionToken: string,assetId: string, userData: string = ''){
   const urls = _.find(config.urls, { 'env': env });
   const apiBaseUrl = urls.ApiBaseUrl; 
     return  `${apiBaseUrl}/KDocuments.svc/DownloadFile?t=${sessionToken}&fid=${assetId}&ud=${userData}`;
}

export function getDeleteAssetUrl(env: string, sessionToken: string,assetId: string, familyCode: string, userData: string = ''){
   const urls = _.find(config.urls, { 'env': env });
   const apiBaseUrl = urls.ApiBaseUrl; 
     return  `${apiBaseUrl}/KDocuments.svc/DeleteAsset?t=${sessionToken}&aid=${assetId}&fc=${familyCode}&ud=${userData}`;
}

export function getDeleteFolderUrl(env: string, sessionToken: string,folderId: string, userData: string = ''){
   const urls = _.find(config.urls, { 'env': env });
   const apiBaseUrl = urls.ApiBaseUrl; 
     return  `${apiBaseUrl}/KDocuments.svc/DeleteFolder?t=${sessionToken}&fid=${folderId}&ud=${userData}&async=true`;
}


export function getShareDocumentUrl(env: string, sessionToken: string, userData: string = ''){
   const urls = _.find(config.urls, { 'env': env });
   const apiBaseUrl = urls.ApiBaseUrl; 
     return  `${apiBaseUrl}/KDocuments.svc/ShareDocument?t=${sessionToken}&ud=${userData}`;
}

export function getCheckInDocumentUrl(env: string, sessionToken: string, userData: string = ''){
   const urls = _.find(config.urls, { 'env': env });
   const apiBaseUrl = urls.ApiBaseUrl; 
     return  `${apiBaseUrl}/KDocuments.svc/CheckIn?t=${sessionToken}&ud=${userData}`;
}

export function getCheckOutDocumentUrl(env: string, sessionToken: string, documentId:string, userData: string = ''){
   const urls = _.find(config.urls, { 'env': env });
   const apiBaseUrl = urls.ApiBaseUrl; 
     return  `${apiBaseUrl}/KDocuments.svc/CheckOut?t=${sessionToken}&dId=${documentId}&ud=${userData}`;
}



