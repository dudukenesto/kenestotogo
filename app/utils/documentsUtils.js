import {config} from './app.config'
import _ from 'lodash'
import stricturiEncode from 'strict-uri-encode'
import * as constans from '../constants/GlobalConstans'

export function constructRetrieveDocumentsUrl(env, sessionToken, fId, sortBy, sortDirection, catId, keyboard) {
  var urls = _.find(config.urls, { 'env': env });
  const splitChars = '|';
  var apiBaseUrl = urls.ApiBaseUrl;
  var url
  keyboard = typeof (keyboard) == 'undefined' ? "" : encodeURIComponent(keyboard)
  if (urls == null)
    return null;

  if (catId.indexOf(splitChars) >= 0) {
    var dtlStr = catId.split(splitChars);
    var key = dtlStr[0]
  }
  else {
    var key = catId
  }
  var asOwner = false;
  var functionName = 'RetrieveDocuments';
  switch (key) {
    case constans.MY_DOCUMENTS:
      functionName = 'RetrieveDocuments';
      asOwner = true;
      break;
    case constans.ALL_DOCUMENTS:
      functionName = 'RetrieveDocuments';
      asOwner = false;
      break;
    case constans.ARCHIVED_DOCUMENTS:
      functionName = 'RetrieveArchivedDocuments';
      break;
    case constans.DOCUMENTS_SHARE_WITH_ME:
      functionName = 'RetrieveSharedDocuments';
      break;
    case constans.CHECKED_OUT_DOCUMENTS:
      functionName = 'RetrieveCheckedOutDocuments';
      break;
    case constans.SEARCH_DOCUMENTS:
      functionName = 'DocumentsQuickSearch';
      break;
  }

  if (key == constans.SEARCH_DOCUMENTS) {
    return `${apiBaseUrl}/KDocuments.svc/${functionName}?t=${sessionToken}&k=${keyboard}`
  }
  else {
    if (typeof (fId) == 'undefined' || fId == "") {
      return `${apiBaseUrl}/KDocuments.svc/${functionName}?t=${sessionToken}&sb=${sortBy}&sd=${sortDirection}&ao=${asOwner}`
    }
    else {
      return `${apiBaseUrl}/KDocuments.svc/${functionName}?t=${sessionToken}&fid=${fId}&sb=${sortBy}&sd=${sortDirection}&ao=${asOwner}`
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
      keyboard: currRoute.data.keyboard,
      baseFileId: currRoute.data.baseFileId
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

export function getSelectedDocument(documentsReducer: Object, navReducer: Object) {


  var context = getDocumentsContext(navReducer);
  var catId = context.catId;
  var items = documentsReducer[catId].items;

  const selectedId = documentsReducer.selectedObject.id;
  return selectedId == '' || selectedId == null ? null : _.find(items, { 'Id': selectedId });
}


export function getFileUploadUrl(env: string, sessionToken: string, path: string, fileDescription: string = "", fileKeyword: string = "", folderId: string = '00000000-0000-0000-0000-000000000000', baseFileId: string = '00000000-0000-0000-0000-000000000000', userData: string = '') {
  const urls = _.find(config.urls, { 'env': env });
   const apiBaseUrl = urls.ApiBaseUrl; 
   folderId = (typeof (folderId) == 'undefined' || folderId == null || folderId == '') ? '00000000-0000-0000-0000-000000000000' : folderId;
   baseFileId = (typeof (baseFileId) == 'undefined' || baseFileId == null || baseFileId == '') ? '00000000-0000-0000-0000-000000000000' : baseFileId;
   return  `${apiBaseUrl}/KDocuments.svc/UploadFile?t=${sessionToken}&p=${path}&fd=${fileDescription}&fk=${fileKeyword}&fid=${folderId}&bid=${baseFileId}`;
}

export function getUploadFileCompletedUrl(env: string, sessionToken: string,url: string, uploadId: string = ''){

   const urls = _.find(config.urls, { 'env': env });
   const apiBaseUrl = urls.ApiBaseUrl; 
     return  `${apiBaseUrl}/KDocuments.svc/UploadFileCompleted?t=${sessionToken}&u=${url}&ui=${uploadId}`;
}

export function getDownloadFileUrl(env: string, sessionToken: string, assetId: string, userData: string = '') {
  const urls = _.find(config.urls, { 'env': env });
  const apiBaseUrl = urls.ApiBaseUrl;
  return `${apiBaseUrl}/KDocuments.svc/DownloadFile?t=${sessionToken}&fid=${assetId}&ud=${userData}`;
}

export function getDeleteAssetUrl(env: string, sessionToken: string, assetId: string, familyCode: string, userData: string = '') {
  const urls = _.find(config.urls, { 'env': env });
  const apiBaseUrl = urls.ApiBaseUrl;
  return `${apiBaseUrl}/KDocuments.svc/DeleteAsset?t=${sessionToken}&aid=${assetId}&fc=${familyCode}&ud=${userData}`;
}

export function getDeleteFolderUrl(env: string, sessionToken: string, folderId: string, userData: string = '') {
  const urls = _.find(config.urls, { 'env': env });
  const apiBaseUrl = urls.ApiBaseUrl;
  return `${apiBaseUrl}/KDocuments.svc/DeleteFolder?t=${sessionToken}&fid=${folderId}&ud=${userData}&async=true`;
}


export function getShareDocumentUrl(env: string, sessionToken: string, userData: string = '') {
  const urls = _.find(config.urls, { 'env': env });
  const apiBaseUrl = urls.ApiBaseUrl;
  return `${apiBaseUrl}/KDocuments.svc/ShareDocument?t=${sessionToken}&ud=${userData}`;
}

export function getCheckInDocumentUrl(env: string, sessionToken: string, userData: string = '') {
  const urls = _.find(config.urls, { 'env': env });
  const apiBaseUrl = urls.ApiBaseUrl;
  return `${apiBaseUrl}/KDocuments.svc/CheckIn?t=${sessionToken}&ud=${userData}`;
}

export function getCheckOutDocumentUrl(env: string, sessionToken: string, documentId: string, userData: string = '') {
  const urls = _.find(config.urls, { 'env': env });
  const apiBaseUrl = urls.ApiBaseUrl;
  return `${apiBaseUrl}/KDocuments.svc/CheckOut?t=${sessionToken}&dId=${documentId}&ud=${userData}`;
}



export function getDiscardCheckOutDocumentUrl(env: string, sessionToken: string, documentId: string, userData: string = '') {
  const urls = _.find(config.urls, { 'env': env });
  const apiBaseUrl = urls.ApiBaseUrl;
  return `${apiBaseUrl}/KDocuments.svc/DiscardCheckOut?t=${sessionToken}&dId=${documentId}&ud=${userData}`;
}

export function getIconNameFromExtension(extension: string) {
  var iconName = "";
  var customStyle = "";
  
  if (typeof (extension) == 'undefined' || extension == "") 
  {
    return {
        iconName: "file",
        customStyle: ""
      }
  }

  switch (extension.toLowerCase()) {
    case ".asmdot":
    case ".asmprp":
    case ".btl":
    case ".cex":
    case ".drwdot":
    case ".drwprp":
    case ".e3d":
    case ".easm":
    case ".easmx":
    case ".edrw":
    case ".edrwx":
    case ".edw":
    case ".eprt":
    case ".journal.doc":
    case ".lin":
    case ".p2m":
    case ".prtdot":
    case ".prtprp":
    case ".sldasm":
    case ".sldblk":
    case ".sldbombt":
    case ".sldclr":
    case ".slddrt":
    case ".slddrw":
    case ".slddwg":
    case ".sldgtolfvt":
    case ".sldholtbt":
    case ".sldlfp":
    case ".sldmat":
    case ".sldprt":
    case ".sldreg":
    case ".sldrevtbt":
    case ".sldsffvt":
    case ".sldstd":
    case ".sldtbt":
    case ".sldweldfvt":
    case ".sldwldtbt":
    case ".swb":
    case ".swj":
    case ".swp":
      iconName = "solidw";
      customStyle = { color: "#87CEFA" }
      break;
    case "link":
      iconName = "web";
      break;
    case ".csv":
      iconName = "file-chart";
      break;
    case ".xlsx":
    case ".xlsm":
    case ".xltx":
    case ".xltm":
    case ".xlsb":
    case ".xlam":
    case ".xls":
      iconName = "file-excel";
      customStyle = { color: "#2C9963" }
      break;
    case ".pdf":
      iconName = "file-pdf";
      customStyle = { color: "#BB0706" }
      break;
    case ".ppt":
    case ".pps":
    case ".pptx":
    case ".pptm":
    case ".potx":
    case ".potm":
    case ".ppam":
    case ".ppsx":
    case ".ppsm":
      iconName = "file-powerpoint";
      customStyle = { color: "#E74B3E" }
      break;
    case ".docx":
    case ".docm":
    case ".dotx":
    case ".dotm":
    case ".doc":
      iconName = "file-word";
      customStyle = { color: "#1672B7" }
      break;
    case "sldx": // autocad
    case ".sldm":
    case ".thmx": // theme file
      iconName = "file";
      break;
    case ".zip":
    case ".rar":
    case ".tar":
    case ".7z":
    case ".gz":
      iconName = "zip-box";
      break;
    case ".jt":
      iconName = "file";
      break;
    case ".jpg":
    case ".png":
    case ".gif":
    case ".bmp":
      iconName = "file-image";
      break;
    case ".mp3":
      iconName = "file-music";
      customStyle = { color: "#FF9900" }
      break;
    case ".mp4":
    case ".webm":
    case ".ogv":
    case ".avi":
    case ".3g2":
    case ".3gp":
    case ".asf":
    case ".asx":
    case ".avs":
    case ".flv":
    case ".mov":
    case ".mpg":
    case ".rm":
    case ".srt":
    case ".swf":
    case ".vob":
    case ".wmv":
      iconName = "file-video";
      break;
    default:
      iconName = "file";
      break;
  }

  return {
    iconName: iconName,
    customStyle: customStyle
  }
}

export function getIconNameFromMimeType(mimeType: string) {
  let iconName = "";
  let customStyle = "";
  const generalType = mimeType.split('/')[0];

  switch (generalType) {

    case 'audio':
      iconName = "file-music";
      break;

    case 'application':
      iconName = "file";
      break;

    case 'video':
      iconName = "file-video";
      break;

    case 'text':
      iconName = "file-document";
      break;

    case 'image':
      iconName = "file-image";
      break;

    default:
      iconName = "file";
  }
  
  return iconName;
}