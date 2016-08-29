import { POP_ROUTE, PUSH_ROUTE, NAV_JUMP_TO_KEY, NAV_JUMP_TO_INDEX, NAV_RESET, CHANGE_TAB, UPDATE_ROUTE_DATA, SUBMIT_ERROR, CLEAR_ERROR,
  SUBMIT_INFO, CLEAR_INFO, SUBMIT_CONFIRM, CLEAR_CONFIRM} from '../constants/ActionTypes'

export function push (route) {
  return {
    type: PUSH_ROUTE,
    route
  }
}

export function pop () {
  return {
    type: POP_ROUTE
  }
}

export function navigateJumpToKey(key) {
  return {
    type: NAV_JUMP_TO_KEY,
    key
  }
}

export function navigateJumpToIndex(index) {
  return {
    type: NAV_JUMP_TO_INDEX,
    index
  }
}

export function navigateReset(key,routes, index) {
  return {
    type: NAV_RESET,
    key,
    index,
    routes
  }
}

export function updateRouteData (routeData) {
  return {
    type: UPDATE_ROUTE_DATA,
    routeData
  }
}

export function emitError(errorTitle: string, errorDetails: string, okAction: Object = null){
  return {
    type: SUBMIT_ERROR, 
    errorTitle: errorTitle, 
    errorDetails: errorDetails,
    errorOkAction: okAction
  }
  
}
export function clearError(){
  return {
    type: CLEAR_ERROR
  }
}

export function emitConfirm(confirmTitle: string, confirmDetails: string, okAction: Object = null){
  return {
    type: SUBMIT_CONFIRM, 
    confirmTitle: confirmTitle, 
    confirmDetails: confirmDetails,
    confirmOkAction: okAction
  }
  
}
export function clearConfirm(){
  return {
    type: CLEAR_CONFIRM
  }
}

export function emitInfo(infoTitle: string, infoDetails: string, okAction: Object = null){
  return {
    type: SUBMIT_INFO, 
    infoTitle: infoTitle, 
    infoDetails: infoDetails,
    infoOkAction: okAction
  }
  
}

export function clearInfo(){
  return {
    type: CLEAR_INFO
}

}
export function changeTab (index) {
  return {
    type: CHANGE_TAB,
    index
  }
}