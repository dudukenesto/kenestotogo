import * as types from '../constants/ActionTypes'
import {getDocumentsTitle} from '../utils/documentsUtils'
let React = require('react-native')
import _ from "lodash";
function documentlist(state = {
  items: [],
  uploadItems:[],
  totalFiles :0,
  totalFolders :0,
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
        totalFiles: action.totalFiles,
        totalFolders:action.totalFolders,
        dataSource: action.dataSource,
        nextUrl: action.nextUrl,
        hasError: false,
        errorMessage: ''
      }
  case types.UPDATE_UPLOAD_LIST:
      return {
        ...state,
        dataSource: action.datasource, 
        uploadItems: action.uploadItems
      }
     case types.UPDATE_UPLOAD_ITEM:
     return {
             ...state,
        uploadItems: action.uploadItems
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
         ...state,
        items: [...action.documents],
        totalFiles: action.totalFiles,
        totalFolders:action.totalFolders,
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

export default function documentsReducer(state = initDocumentsReducer(), action) {
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
      return state = initDocumentsReducer()
 
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
       return {
          ...state, 
           [action.catId]: documentlist(state[action.catId], action)
         
       }


   case types.UPDATE_UPLOAD_ITEM: 
    return {
      ...state, 
     [action.catId]: documentlist(state[action.catId], action)
    }
   
    default:
      return state
  }
}


function initDocumentsReducer()
{
  return {isFetching: false,isFetchingSelectedObject:false}
}