import * as types from '../constants/ActionTypes'

function accessReducer (state = { isLoggedIn : false, token: "" , env : 'dev', isFetching : true}, action) {
  switch (action.type) {
    case types.UPDATE_IS_FETCHING: 
        return {
          ...state, 
          isFetching : action.isFetching
        }
     case types.SUBMIT_ERROR: 
        return {
          ...state, 
          isFetching : false, 
          HasError: true, 
          GlobalErrorMessage: action.message
        }
     case types.SUBMIT_SUCCESS: 
        return {
          ...state, 
          isFetching : false, 
          HasError: false, 
          GlobalErrorMessage: "", 
          GlobalSuccessMessage: action.messge
        }
    case types.SetEnv:
        return {
          ...state,
          env: action.env
        }
        case types.PASSWORD_SENT:
        return {
          ...state,
          passwordSent: action.sent,
          isFetching: false
        }
    case types.LOGIN: {
        return{
            ...state, 
            accessToken: action.accessToken
        }
       
    }
    case types.UPDATE_LOGIN_INFO: {
        return{
            ...state, 
            isLoggedIn: action.isLoggedIn, 
            sessionToken: action.sessionToken, 
            isFetching: false,
            env: action.env
        }
       
    }

    default:
      return state
  }
}

export default accessReducer