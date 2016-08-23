import { PUSH_ROUTE, POP_ROUTE,UPDATE_ROUTE_DATA , SUBMIT_ERROR, CLEAR_ERROR,
  SUBMIT_INFO,CLEAR_INFO } from '../constants/ActionTypes'
import { NavigationExperimental } from 'react-native'
const {
 StateUtils: NavigationStateUtils
} = NavigationExperimental

const initialState = {
  index: 0,
  key: 'root',
  routes: [
    {
      key: 'KenestoLauncher',
      title: 'Launcher'
    }
  ]
}

function navigationState (state = initialState, action) {
  switch (action.type) {
    case PUSH_ROUTE:
     if (state.routes[state.index].key === (action.route && action.route.key)) return state
      return NavigationStateUtils.push(state, action.route)
    case POP_ROUTE:
      if (state.index === 0 || state.routes.length === 1) return state
      return NavigationStateUtils.pop(state)
    case UPDATE_ROUTE_DATA:
      state.routes[state.index].data = action.routeData;
     return {
        ...state
      }
      case SUBMIT_INFO: 
      return {
        ...state, 
        HasInfo: true, 
        GlobalInfoTitle: action.infoTitle, 
        GlobalInfoDetails: action.infoDetails

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
        GlobalErrorDetails: action.errorDetails

      }
      case CLEAR_ERROR: 
      return {
        ...state, 
        HasError: false, 

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

