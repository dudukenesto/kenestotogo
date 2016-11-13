import _ from 'lodash'
import {config} from './app.config'

import PubNub from 'pubnub'
const pubnub = new PubNub({
    subscribeKey: "demo",
    publishKey: "demo",
    ssl: true
})


export function getRetrieveShareObjectInfoUrl(env: string, token: string, objectId: string, familyCode: string){
    var urls = _.find(config.urls, { 'env': env });
    var apiBaseUrl = urls.ApiBaseUrl;
    var url
    if (urls == null)
        return null;
    
    return `${apiBaseUrl}/KObject.svc/RetrieveShareObjectInfo?t=${token}&oi=${objectId}&fc=${familyCode}`; 
}

export function getWriteToLogUrl(env: string, sessionToken: string, userData: string = ''){
    var urls = _.find(config.urls, { 'env': env });
    var apiBaseUrl = urls.ApiBaseUrl;
    var url
    if (urls == null)
        return null;
    
    return `${apiBaseUrl}/KObject.svc/WriteToLog?t=${sessionToken}&ud=${userData}`; 
}

export function isRouteKeyExists(key:string, routes:Object)
{
      for (index = 0; index < routes.length; ++index) {
          if(routes[index].key == key)
          return true;
      }
      return false;
}


export function writeToLog(env: string, token: string = "", category: string = "", ...values) {
    try {
        // const url = getWriteToLogUrl(env, token);
        // const jsonObject = {
        //     logMessage: {
        //         Category: category,
        //         Values: values
        //     }
        // }
        // var request = new Request(url, {
        //     method: 'post',
        //     headers: new Headers({
        //         'Content-Type': 'application/json'
        //     }),
        //     body: JSON.stringify(jsonObject)
        // });

        // fetch(request)
        //     .then(response => response.json())
        //     .then(json => {
        //         if (json.ResponseStatus == "FAILED") {
        //         }
        //         else {
        //         }
        //     }).catch((error) => {
        //     }).done();

        // pubnub.publish({
        //     channel: 'ReactChat',
        //     message: 'Hello World',
        // });
    }
    catch (err) {
      
    }
}
