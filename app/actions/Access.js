import * as types from '../constants/ActionTypes';
import {getAuthUrl, getLoginUrl, getForgotPasswordUrl, clearCredentials, setCredentials} from '../utils/accessUtils';
import { push, pop, emitInfo, emitError, navigateReset} from './navActions'

import * as routes from '../constants/routes'
import * as constans from '../constants/GlobalConstans'
import {clearDocumentlists} from '../actions/documentlists'
import {getDocumentsTitle} from '../utils/documentsUtils'

var stricturiEncode = require('strict-uri-encode');

export function updateIsFetching(isFetching: boolean){
    return {
        type: types.UPDATE_IS_FETCHING, 
        isFetching
    }
}

export function setEnv(env: string){
    return {
        type: types.SetEnv, 
        env
    }
}

export function updateLoginInfo(isLoggedIn: boolean, sessionToken: string, env: string, email: string, firstName: string, lastName: string, thumbnailPath: string) {

    return {
        type: types.UPDATE_LOGIN_INFO,
        isLoggedIn: isLoggedIn,
        sessionToken: sessionToken,
        env: env,
        email: email,
        firstName: firstName,
        lastName: lastName,
        thumbnailPath: thumbnailPath
    }
}

function Authenticate(userId : string, password: string) {
    return {
        type: types.AUTHENTICATE,  
        password
    }
}

function PasswordSent(sent: boolean) {
    return {
        type: types.PASSWORD_SENT,  
        sent
    }
}


function GetSessionToken(accessToken : string) {
    return {
        type: types.AUTHENTICATE, 
        accessToken
    }
}

function SubmitSuccess(message : string) {
    return {
        type: types.SUBMIT_SUCCESS, 
        message: message, 
        isFetching : false
    }
}


function DoNothing(message : string) {
    return {
        type: types.DO_NOTHING
    }
}

export function ActivateForgotPassword(username : string, env : string = 'dev') {
     return (dispatch, getstate) => {
        if (env == null)
        {
             const {stateEnv} = getState(); 
             env = stateEnv;
        }

         dispatch(updateIsFetching(true)); 

        var forgotPasswordUrl = getForgotPasswordUrl(env, username);
        return fetch(forgotPasswordUrl)
        .then((response) => response.json())
        .catch((error) => {
             dispatch(emitError('Fialed to reset password'))
        })
        .then( (responseData) => {
            if (responseData.ForgotPasswordResult.ResponseStatus == "FAILED")
            {
                 dispatch(updateIsFetching(false)); 
                 dispatch(emitError("Reset password failed", responseData.ForgotPasswordResult.ErrorMessage))
            }
            else{
                   dispatch(updateIsFetching(false)); 
                   dispatch(emitInfo("Password reset email sent", "Follow the instructions in the email to rest your password",() => dispatch(pop())))
            }
         
        }).done();

        
    }
}

export function logOut() {
    return (dispatch, getstate) => {
        clearCredentials();
        dispatch(navigateReset('root', [{ key: 'KenestoLauncher', title: 'Launcher' }], 0));
        dispatch(clearDocumentlists());

    }
}

export function login(userId : string, password: string, env: string = 'dev')  {
    return (dispatch, getstate) => {

     dispatch(updateIsFetching(true)); 

        if (env == null)
        {
             const {stateEnv} = getState(); 
             env = stateEnv;
        }

      
   
        var authUrl = getAuthUrl(env,userId, password);


        return fetch(authUrl)
            .then((response) => response.json())
            .catch((error) => {
                 dispatch(emitError('Failed to Login')); 
           
            })
            .then( (responseData) => {
                if (responseData.AuthenticateJsonResult.ResponseStatus == "FAILED")
                {

                    clearCredentials();
                    dispatch(updateIsFetching(false)); 
                }
  
                else{
                        var organizationId = responseData.AuthenticateJsonResult.Organizations[0].OrganizationIdentifier; 
                        var token = responseData.AuthenticateJsonResult.Token;
                        const loginUrl = getLoginUrl(env, organizationId, token);
                
                       fetch(loginUrl).then((response) => response.json())
                        .catch((error) => {
                             dispatch(emitError('Failed to Login')); 
                        })
                        .then( (responseData) => {
                            setCredentials(userId, password, env);
                            var sessionToken =  typeof (responseData.LoginJsonResult) != 'undefined'? responseData.LoginJsonResult.Token : "";

                            dispatch(updateLoginInfo(true, stricturiEncode(sessionToken), env, responseData.LoginJsonResult.User.EmailAddress, responseData.LoginJsonResult.User.FirstName, responseData.LoginJsonResult.User.LastName, responseData.LoginJsonResult.User.ThumbnailPath));
                               var data = {
                                                key : "documents",
                                                name: getDocumentsTitle(constans.MY_DOCUMENTS),
                                                catId: constans.MY_DOCUMENTS,
                                                fId: "",
                                                sortDirection: constans.ASCENDING,
                                                sortBy: constans.ASSET_NAME
                                            }
                                var rr = routes.documentsRoute(data)
                            dispatch(clearDocumentlists());
                            dispatch(push(rr.route));
                         

                        })
                }
            
        })

          

    }
}
