import {config} from './app.config'
import _ from 'lodash'
import stricturiEncode from 'strict-uri-encode'


export function constructRetrieveDocumentsUrl(env, sessionToken, fId) {
    var urls = _.find(config.urls, { 'env': env });
    var apiBaseUrl = urls.ApiBaseUrl;
    var url
    if (urls == null)
        return null;

    if(fId == undefined || fId=="")
      {
        return  `${apiBaseUrl}/KDocuments.svc/RetrieveDocuments?t=${sessionToken}`
      }
      else
      {
        return  `${apiBaseUrl}/KDocuments.svc/RetrieveDocuments?t=${sessionToken}&fid=${fId}`
      }   

}

export function getCreateFolderUrl(env, sessionToken, fId, folderName){
    var urls = _.find(config.urls, { 'env': env });
    var apiBaseUrl = urls.ApiBaseUrl;
    if (urls == null)
        return null;

   return `${apiBaseUrl}/KDocuments.svc/CreateFolder?t=${sessionToken}&pid=${fId}&fn=${folderName}&folderDescription=''`;
}