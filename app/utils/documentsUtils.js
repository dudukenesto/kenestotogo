import {config} from './app.config'
import _ from 'lodash'
import stricturiEncode from 'strict-uri-encode'


export function constructRetrieveDocumentsUrl(env, sessionToken, fId) {

    var urls = _.find(config.urls, { 'env': env });
    var apiBaseUrl = config.urls.ApiBaseUrl;
    const encodeSessionToken  = encodeURIComponent(sessionToken)
    var url
    if (urls == null)
        return null;

    if(fId == undefined || fId=="")
      {
        return  `${apiBaseUrl}/KDocuments.svc/RetrieveDocuments?t=${encodeSessionToken}`
      }
      else
      {
        return  `${apiBaseUrl}/KDocuments.svc/RetrieveDocuments?t=${encodeSessionToken}&fid=${fId}`
      }   

}

