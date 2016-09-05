import {config} from './app.config'
import _ from 'lodash'
import stricturiEncode from 'strict-uri-encode'
import {AsyncStorage} from 'react-native'

export function getApiBaseUrl(env: string){
    var urls = _.find(config.urls, {'env' : env});
    if (urls == null)
        return null;

    return urls.ApiBaseUrl; 

}

export function getAuthUrl(env: string,username: string, password: string){

    var urls = _.find(config.urls, {'env' : env});

    if (urls == null)
        return null;

    var authUrl = urls.AuthUrlTemplate.replace('{0}', username).replace('{1}', password);
    return authUrl;

}

export function getEnvIp(env: string){

    var urls = _.find(config.urls, {'env' : env});

    if (urls == null)
        return null;

    return urls.Ip;

}

export function getForgotPasswordUrl(env: string,username: string){
    var urls = _.find(config.urls, {'env' : env});

    if (urls == null)
            return null;

    return urls.ForgotPasswordUrl.replace('{0}', username);

}

export function getLoginUrl(env: string, orgId: string, token : Object){
    var urls = _.find(config.urls, {'env' : env});
    if (urls == null)
        return null;

  return urls.LoginUrlTemplate.replace('{0}', orgId).replace('{1}',  stricturiEncode(token));

}


export function getRetrieveStatisticsUrl(env, sessionToken) {
  var urls = _.find(config.urls, { 'env': env });
  var apiBaseUrl = urls.ApiBaseUrl;
  var url
  if (urls == null)
    return null;
  
  return `${apiBaseUrl}/KDocuments.svc/RetrieveStatistics?t=${sessionToken}`
}

export function clearCredentials()
{
        AsyncStorage.multiRemove(["kenestoU","kenestoP", "env"]); 
}

export async function getCredentials(props: Object) : Object{
    
    var res  = await AsyncStorage.multiGet(["kenestoU", "kenestoP", "env"]);
      var env = null; 
     
         res.map( (result, i, res) => {
                let key = res[i][0];
                let val = res[i][1];
                if (key == "kenestoU")
                    storedUserName  = val;
                else if (key == "kenestoP")
                    storedPassword = val;
                 else
                    env = val;
            });

          if (storedPassword != null && storedUserName != null)
               {
                
                   return   { hasCredentials: true, storedUserName : storedUserName, storedPassword : storedPassword, env : env, props: props};
               }
               else
                    return { hasCredentials: false,  props: props};
}


export function setCredentials(username, password, env){
      AsyncStorage.setItem("kenestoU", username); 
      AsyncStorage.setItem("kenestoP", password); 
      AsyncStorage.setItem("env", env); 

}



