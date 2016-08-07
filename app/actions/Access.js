import * as types from '../constants/ActionTypes';
import {getAuthUrl, getLoginUrl, getForgotPasswordUrl, clearCredentials, setCredentials} from '../utils/accessUtils';
import { push, pop } from './navActions'
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

export function updateLoginInfo(isLoggedIn : boolean, sessionToken: string, env: string) {
    
    return {
        type: types.UPDATE_LOGIN_INFO, 
        isLoggedIn: isLoggedIn, 
        sessionToken : sessionToken, 
        env : env
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

function SubmitError(message : string) {
    return {
        type: types.SUBMIT_ERROR, 
        errorMessage: message, 
        hasError: true,
        isFetching : false, 
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

        var forgotPasswordUrl = getForgotPasswordUrl(env, username);
        fetch(forgotPasswordUrl)
        .then((response) => response.json())
        .catch((error) => {
            return dispatch(SubmitError('Fialed to reset password'))
            //this._updateIsLoading(false);
           //  Actions.error({data: 'Failed to reset password'})
        })
        .then( (responseData) => {
        
            if (responseData.ForgotPasswordResult.ResponseStatus == "FAILED")
            {
                 return dispatch(SubmitError(responseData.ForgotPasswordResult.ErrorMessage));
                 
                 //this._updateIsLoading(false);
                 //Actions.error({data: responseData.ForgotPasswordResult.ErrorMessage}); 
            }

            return dispatch(PasswordSent(true));
           // this._updateIsLoading(false);
            //this.setState({responseStatus: responseData.ForgotPasswordResult.ResponseStatus}); 
        }).done();

          return dispatch(updateIsFetching(true)); 
    }
}

export function login(userId : string, password: string, env: string = 'dev')  {

    return (dispatch, getstate) => {



        if (env == null)
        {
             const {stateEnv} = getState(); 
             env = stateEnv;
        }

      
   
        var authUrl = getAuthUrl(env,userId, password);


        fetch(authUrl)
            .then((response) => response.json())
            .catch((error) => {
                 console.log('Failed to Login')
                return dispatch(SubmitError('Failed to Login')); 
           
            })
            .then( (responseData) => {
                if (responseData.AuthenticateJsonResult.ResponseStatus == "FAILED")
                {

                    clearCredentials();
                    return dispatch(updateIsFetching(false)); 
                }
  
                else{
                        var organizationId = responseData.AuthenticateJsonResult.Organizations[0].OrganizationIdentifier; 
                        var token = responseData.AuthenticateJsonResult.Token;
                        const loginUrl = getLoginUrl(env, organizationId, token);
                
                       fetch(loginUrl).then((response) => response.json())
                        .catch((error) => {
                             console.log('Failed to Login')
                              return dispatch(SubmitError('Failed to Login')); 
                        })
                        .then( (responseData) => {
                            setCredentials(userId, password, env);
                            var sessionToken =  typeof (responseData.LoginJsonResult) != 'undefined'? responseData.LoginJsonResult.Token : "";

                            return dispatch(updateLoginInfo(true, stricturiEncode(sessionToken), env));
                         

                        })
                }
            
        })

           return dispatch(updateIsFetching(true)); 

    }
}