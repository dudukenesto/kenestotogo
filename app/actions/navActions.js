import { POP_ROUTE, PUSH_ROUTE, CHANGE_TAB,UPDATE_ROUTE_DATA, SUBMIT_ERROR, CLEAR_ERROR, 
  SUBMIT_INFO, CLEAR_INFO } from '../constants/ActionTypes'

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

export function updateRouteData (routeData) {
  return {
    type: UPDATE_ROUTE_DATA,
    routeData
  }
}
export function emitError(errorTitle: string, errorDetails: string){
  return {
    type: SUBMIT_ERROR, 
    errorTitle: errorTitle, 
    errorDetails: errorDetails
  }
  
}

export function clearError(){
  return {
    type: CLEAR_ERROR
  }
}

export function emitInfo(infoTitle: string, infoDetails: string, okAction: Object){
  return {
    type: SUBMIT_INFO, 
    infoTitle: infoTitle, 
    infoDetails: infoDetails,
    okAction: okAction
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
