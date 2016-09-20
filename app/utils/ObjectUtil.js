import _ from 'lodash'
import {config} from './app.config'

export function getRetrieveShareObjectInfoUrl(env: string, token: string, objectId: string, familyCode: string){
    var urls = _.find(config.urls, { 'env': env });
    var apiBaseUrl = urls.ApiBaseUrl;
    var url
    if (urls == null)
        return null;
    
    return `${apiBaseUrl}/KObject.svc/RetrieveShareObjectInfo?t=${token}&oi=${objectId}&fc=${familyCode}`; 
}