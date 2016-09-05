import * as types from '../constants/ActionTypes'

function accessReducer(state =
  {
    isLoggedIn: false,
    token: "",
    env: 'dev',
    isFetching: false,
    email: "",
    firstName: "",
    lastName: "",
    thumbnailPath: "",
    statistics: {
      totalMyDocuments: 0,
      totalAllDocuments: 0,
      totalSharedWithMe: 0,
      totalCheckedoutDocuments: 0,
      totalArchivedDocuments: 0,
      totalUsageSpace: 0,
    }
  }, action) {
  switch (action.type) {
    case types.UPDATE_IS_FETCHING:
      return {
          ...state,
        isFetching: action.isFetching
      }
    case types.SUBMIT_ERROR:
      return {
          ...state,
        isFetching: false,
        HasError: true,
        GlobalErrorMessage: action.message
      }
    case types.SUBMIT_SUCCESS:
      return {
          ...state,
        isFetching: false,
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
      return {
            ...state,
        accessToken: action.accessToken
      }

    }
    case types.UPDATE_LOGIN_INFO: {
      return {
            ...state,
        isLoggedIn: action.isLoggedIn,
        sessionToken: action.sessionToken,
        isFetching: false,
        env: action.env,
        email: action.email,
        firstName: action.firstName,
        lastName: action.lastName,
        thumbnailPath: action.thumbnailPath
      }

    }
    case types.UPDATE_STATISTICS: {
      return {
          ...state,
        statistics: {
          totalMyDocuments: action.totalMyDocuments,
          totalAllDocuments: action.totalAllDocuments,
          totalSharedWithMe: action.totalSharedWithMe,
          totalCheckedoutDocuments: action.totalCheckedoutDocuments,
          totalArchivedDocuments: action.totalArchivedDocuments,
          totalUsageSpace: action.totalUsageSpace,
        }
      }

    }
    default:
      return state
  }
}

export default accessReducer