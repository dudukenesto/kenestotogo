import { PUSH_ROUTE, POP_ROUTE, NAV_JUMP_TO_KEY, NAV_JUMP_TO_INDEX, NAV_RESET, UPDATE_ROUTE_DATA, SUBMIT_ERROR, CLEAR_ERROR,
  SUBMIT_INFO, CLEAR_INFO,SUBMIT_CONFIRM, CLEAR_CONFIRM} from '../constants/ActionTypes'
import { NavigationExperimental } from 'react-native'
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
  ]
}

function navigationState(state = initialState, action) {
  switch (action.type) {
    case PUSH_ROUTE:
      if (state.routes[state.index].key === (action.route && action.route.key)) return state
      state.lastActionType = PUSH_ROUTE;
      return NavigationStateUtils.push(state, action.route)
    case POP_ROUTE:
      if (state.index === 0 || state.routes.length === 1) return state
      state.lastActionType = POP_ROUTE;
      return NavigationStateUtils.pop(state)

    case NAV_JUMP_TO_KEY:
     state.lastActionType = NAV_JUMP_TO_KEY;
      return NavigationStateUtils.jumpTo(state, action.key)

    case NAV_JUMP_TO_INDEX:
      state.lastActionType = NAV_JUMP_TO_INDEX;
      return NavigationStateUtils.jumpToIndex(state, action.index)

    case NAV_RESET:
      return {
			  ...state,
        key: action.key,
        index: action.index,
        routes: action.routes,
        lastActionType:NAV_RESET
      }

    case UPDATE_ROUTE_DATA:
      state.routes[state.index].data = action.routeData;
      return {
        ...state,
        lastActionType:UPDATE_ROUTE_DATA
      }
    case SUBMIT_INFO:
      return {
        ...state,
        HasInfo: true,
        GlobalInfoTitle: action.infoTitle,
        GlobalInfoDetails: action.infoDetails,
        GlobalInfoOkAction: action.infoOkAction

      }
    case CLEAR_INFO:
      return {
        ...state,
        HasInfo: false,
      }
    case SUBMIT_ERROR:
      return {
        ...state, 
        HasError: true, 
        GlobalErrorTitle: action.errorTitle, 
        GlobalErrorDetails: action.errorDetails,
        GlobalErrorOkAction: action.errorOkAction
      }

    case SUBMIT_CONFIRM:
      return {
        ...state, 
        HasConfirm: true, 
        GlobalConfirmTitle: action.confirmTitle, 
        GlobalConfirmDetails: action.confirmDetails,
        GlobalConfirmOkAction: action.confirmOkAction
      }
    case CLEAR_CONFIRM:
      return {
        ...state,
        HasConfirm: false,
      }
    case CLEAR_ERROR:
      return {
        ...state, 
        HasError: false, 
        GlobalErrorTitle:null, 
        GlobalErrorDetails: null,
        GlobalErrorOkAction: null


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

