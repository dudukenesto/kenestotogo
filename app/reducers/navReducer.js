import * as actionTypes from '../constants/ActionTypes'
import { NavigationExperimental } from 'react-native'
var Orientation = require('../components/KenestoDeviceOrientation');
const {
  StateUtils: NavigationStateUtils
} = NavigationExperimental

const initialState = {
  index: 0,
  key: 'root',
  lastActionType:"",
  routes: [
    {
      key: 'KenestoLauncher',
      title: 'Launcher'
    }
  ], 

  toolbarVisible: true,
  isProcessing:false,
  orientation: Orientation.getInitialOrientation()
}

function navigationState(state = initialState, action) {
 
  switch (action.type) {
    case actionTypes.PUSH_ROUTE:
      if (state.routes[state.index].key === (action.route && action.route.key)) return state
      state.lastActionType =  actionTypes.PUSH_ROUTE;
      state.toolbarVisible = true;
      return NavigationStateUtils.push(state, action.route)
    case  actionTypes.POP_ROUTE:
      if (state.index === 0 || state.routes.length === 1) return state
      state.lastActionType =  actionTypes.POP_ROUTE;
      state.toolbarVisible = true;
      return NavigationStateUtils.pop(state)

    case  actionTypes.NAV_JUMP_TO_KEY:
     state.lastActionType =  actionTypes.NAV_JUMP_TO_KEY;
      state.toolbarVisible = true;
      return NavigationStateUtils.jumpTo(state, action.key)

    case  actionTypes.NAV_JUMP_TO_INDEX:
      state.lastActionType = actionTypes.NAV_JUMP_TO_INDEX;
      state.toolbarVisible = true;
      return NavigationStateUtils.jumpToIndex(state, action.index)

    case  actionTypes.NAV_RESET:
      return {
			  ...state,
        key: action.key,
        index: action.index,
        routes: action.routes,
        lastActionType: actionTypes.NAV_RESET
      }

    case  actionTypes.UPDATE_ROUTE_DATA:
      state.routes[state.index].data = action.routeData;
      return {
        ...state,
        lastActionType:  actionTypes.UPDATE_ROUTE_DATA
      }
    case  actionTypes.SUBMIT_INFO:
      return {
        ...state,
        HasInfo: true,
        GlobalInfoTitle: action.infoTitle,
        GlobalInfoDetails: action.infoDetails,
        GlobalInfoOkAction: action.infoOkAction,
        isProcessing: action.isProcessing

      }
    case actionTypes.CLEAR_INFO:
      return {
        ...state,
        HasInfo: false,
      }
    case  actionTypes.SUBMIT_ERROR:
      return {
        ...state, 
        HasError: true, 
        GlobalErrorTitle: action.errorTitle, 
        GlobalErrorDetails: action.errorDetails,
        GlobalErrorOkAction: action.errorOkAction,
        isProcessing: action.isProcessing
      }

    case  actionTypes.SUBMIT_CONFIRM:
      return {
        ...state, 
        HasConfirm: true, 
        GlobalConfirmTitle: action.confirmTitle, 
        GlobalConfirmDetails: action.confirmDetails,
        GlobalConfirmOkAction: action.confirmOkAction,
        isProcessing: action.isProcessing
      }
    case  actionTypes.CLEAR_CONFIRM:
      return {
        ...state,
        HasConfirm: false,
      }
    case  actionTypes.CLEAR_ERROR:
      return {
        ...state, 
        HasError: false, 
        GlobalErrorTitle:null, 
        GlobalErrorDetails: null,
        GlobalErrorOkAction: null
      }
    case  actionTypes.SUBMIT_TOAST:
        return {
          ...state, 
          HasToast: true, 
          GlobalToastType: action.toastType,
          GlobalToastTitle:action.toastTitle, 
          GlobalToastMessage: action.toastMessage, 
          isProcessing: action.isProcessing
        }
   case  actionTypes.CLEAR_TOAST:
        return {
          ...state, 
          HasToast: false, 
          HideToast: false, 
          GlobalToastType: null,
          GlobalToastTitle:null, 
          GlobalToastMessage: null
        }
   case  actionTypes.HIDE_TOAST:
     return {
          ...state,
       HideToast: true,
       GlobalToastType: null,
       GlobalToastTitle: null,
       GlobalToastMessage: null
     }
    case  actionTypes.TOGGLE_TOOLBAR: 
      var thistoolbarVisible = action.toolbarVisible == null? !state.toolbarVisible: action.toolbarVisible; 
      return{
          ...state,
          toolbarVisible: thistoolbarVisible,
      }
    case  actionTypes.UPDATE_ORIENTATION:
      return{
          ...state,
          orientation: action.orientation,
      }
   case actionTypes.UPDATE_IS_PROCESSING:

      return {
        ...state,
        isProcessing: action.isProcessing,
      }
    default:
      return state
  }
  
}

export default navigationState

// You can also manually create your reducer::
// export default (state = initialState, action) => {
//   const {
//     index,
//     routes
//   } = state
//   console.log('action: ', action)
//   switch (action.type) {
//     case PUSH_ROUTE:
//       return {
//         ...state,
//         routes: [
//           ...routes,
//           action.route
//         ],
//         index: index + 1
//       }
//     case POP_ROUTE:
//       return index > 0 ? {
//         ...state,
//         routes: routes.slice(0, routes.length - 1),
//         index: index - 1
//       } : state
//     default:
//       return state
//   }
// }

