import {config} from './app.config'
import _ from 'lodash'
import stricturiEncode from 'strict-uri-encode'
import * as constans from '../constants/GlobalConstans'

export function constructRetrieveDocumentsUrl(env, sessionToken, fId, sortBy, sortDirection) {
  var urls = _.find(config.urls, { 'env': env });
  var apiBaseUrl = urls.ApiBaseUrl;
  var url
  if (urls == null)
    return null;

  if (fId == undefined || fId == "") {
    return `${apiBaseUrl}/KDocuments.svc/RetrieveDocuments?t=${sessionToken}&sb=${sortBy}&sd=${sortDirection}`
  }
  else {
    return `${apiBaseUrl}/KDocuments.svc/RetrieveDocuments?t=${sessionToken}&fid=${fId}&sb=${sortBy}&sd=${sortDirection}`
  }

}

export function getCreateFolderUrl(env, sessionToken, fId, folderName) {
  var urls = _.find(config.urls, { 'env': env });
  var apiBaseUrl = urls.ApiBaseUrl;
  if (urls == null)
    return null;
  var folderId = (typeof (fId) == 'undefined' || fId == null || fId == '') ? '00000000-0000-0000-0000-000000000000' : fId;

  return `${apiBaseUrl}/KDocuments.svc/CreateFolder?t=${sessionToken}&pid=${folderId}&fn=${folderName}&folderDescription=''`;
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
      sortBy: currRoute.data.sortBy
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
    default:
      return "My Documents";

  }
}

export function getSelectedDocument(documentlists: Object, navReducer: Object){
   // debugger
    var context = getDocumentsContext(navReducer);
    var catId = context.catId;

    var items = documentlists[catId].items;
  
    const selectedId = documentlists.selectedId; 
    return selectedId == '' || selectedId == null ? null : _.find(items, { 'Id': selectedId }); 
}

