import {config} from './app.config'
import _ from 'lodash'
import stricturiEncode from 'strict-uri-encode'


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

export function getCreateFolderUrl(env, sessionToken, fId, folderName){
    var urls = _.find(config.urls, { 'env': env });
    var apiBaseUrl = urls.ApiBaseUrl;
    if (urls == null)
        return null;
    var folderId =  (typeof(fId) == 'undefined' ||  fId == null || fId == '') ? '00000000-0000-0000-0000-000000000000' :fId;

   return `${apiBaseUrl}/KDocuments.svc/CreateFolder?t=${sessionToken}&pid=${folderId}&fn=${folderName}&folderDescription=''`;
}


export function getDocumentsContext(props) {
  const {navReducer} = props
  var currRoute = navReducer.routes[navReducer.index];
  console.log("getDocumentsContext:" + JSON.stringify(currRoute))
  return (
    {
      name: currRoute.data.name,
      catId: currRoute.data.catId,
      fId: currRoute.data.fId,
      sortDirection: currRoute.data.sortDirection,
      sortBy: currRoute.data.sortBy
    })
}