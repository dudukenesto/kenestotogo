import * as types from '../constants/ActionTypes'
import {getDocumentsTitle} from '../utils/documentsUtils'
let React = require('react-native')
function documentlist(state = {
  items: [],
  nextUrl: false,
  errorMessage: '',
  hasError: false,
  dataSource: {}, 
  sharingPermissions: null, 
}, action) {
  switch (action.type) {
    
    case types.RECEIVE_DOCUMENTS:
      return {
        ...state,
        items: [...action.documents],
        dataSource: action.dataSource,
        nextUrl: action.nextUrl,
        hasError: false,
        errorMessage: ''
      }
  case types.UPDATE_UPLOAD_LIST:
      return {
        ...state,
        dataSource: action.datasource,
      }
    
    case types.REQUEST_DOCUMENTS:
      return {
        ...state,
        nextUrl: null,
        hasError: false,
        errorMessage: ''
      }
    case types.SUBMIT_ERROR:
      return {
        ...state,
        hasError: true,
        errorMessage: action.errorMessage,
        nextUrl: action.nextUrl
      }
     case types.SET_SHARING_PERMISSIONS:
            return {
              ...state,
              sharingPermissions: action.sharingPermissions
            }
    case types.REFRESH_DOCUMENTS_LIST:
      return {
        items: [...action.documents],
        dataSource: action.dataSource,
        nextUrl: action.nextUrl,
        hasError: false,
        errorMessage: ''
      }
 

    default:
      return state
  }
}

function setUploaded(){
  // var uploadItems = []; 
  //  uploadItems.push({ Id: 'scanned_1', FamilyCode: 'UPLOAD_PROGRESS', Name: 'scanned_1'}); 
  //         uploadItems.push({ Id: 'scanned_2', FamilyCode: 'UPLOAD_PROGRESS', Name: 'scanned_2'}); 
  //         return uploadItems;

          return [];
}

export default function documentsReducer(state = {isFetching: false,isFetchingSelectedObject:false, uploadItems:setUploaded()}, action) {
  switch (action.type) {
    case types.RECEIVE_DOCUMENTS:
      return Object.assign({}, state, {
        isFetching: false,
        [action.catId]: documentlist(state[action.catId], action)
      })

    case types.REQUEST_DOCUMENTS:
      return Object.assign({}, state, {
        isFetching: true,
        [action.catId]: documentlist(state[action.catId], action)
      })

    case types.REFRESH_DOCUMENTS_LIST:
      return Object.assign({}, state, {
        isFetching: false,
        [action.catId]: documentlist(state[action.catId], action),

      })
    case types.REQUEST_CREATE_FOLDER: {
      return {
        ...state,
        creatingFolder: action.creatingFolder
      }
    }
    case types.SET_SHARING_PERMISSIONS:
            return {
              ...state,
               isFetching: false,
              sharingPermissions: action.sharingPermissions
            }
    case types.SUBMIT_ERROR:
      return Object.assign({}, state, {
         isFetching: false,
        [action.catId]: documentlist(state[action.catId], action)
      })
  case types.UPDATE_SELECTED_OBJECT:
      return {
        ...state,
         isFetching: false,
        selectedObject: action.selectedObject
      }
    case types.CLEAR_ALL_DOCUMENTS_LIST:
      return state ={isFetching: false,isFetchingSelectedObject:false, uploadItems: setUploaded() }
 
   case types.UPDATE_IS_FETCHING_SELECTED_OBJECT:
      return {
          ...state,
        isFetchingSelectedObject: action.isFetchingSelectedObject
      }
      case types.UPDATE_IS_FETCHING:
      return {
          ...state,
        isFetching: action.isFetching
      }
       case types.UPDATE_UPLOAD_LIST:

       //action.dataSource
       //action.catId
    //   uploadItems: action.uploadItems, 
      //   [action.catId]: documentlist(action.dataSource, action)
       return {
          ...state, 
          uploadItems: action.uploadItems,
           [action.catId]: documentlist(state[action.catId], action)
         
       }




      
    default:
      return state
  }
}
