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

