import * as actionTypes from '../constants/ActionTypes'
import * as peopleActions from '../actions/peopleActions'
import {getSelectedDocument} from '../utils/documentsUtils'
import {isRouteKeyExists} from '../utils/ObjectUtils'
export function push (route) {
   return (dispatch, getState) => {
      const navReducer = getState().navReducer;
      if(isRouteKeyExists(route.key, navReducer.routes))
      {
        route.key =  route.key+"~"+ Math.random();
      }
      dispatch(pushRouth(route));
   }
}

export function pushRouth (route) {
  return {
          type: actionTypes.PUSH_ROUTE,
          route
    }
}
export function pop () {
  return {
    type: actionTypes.POP_ROUTE
  }
}

export function navigateJumpToKey(key) {
  return {
    type: actionTypes.NAV_JUMP_TO_KEY,
    key
  }
}

export function navigateJumpToIndex(index) {
  return {
    type: actionTypes.NAV_JUMP_TO_INDEX,
    index
  }
}

export function navigateReset(key,routes, index) {
  return {
    type: actionTypes.NAV_RESET,
    key,
    index,
    routes
  }
}

export function updateRouteData (routeData) {
  return {
    type: actionTypes.UPDATE_ROUTE_DATA,
    routeData
  }
}

export function emitToast(type: string, messge: string, title: string){
    return {
    type: actionTypes.SUBMIT_TOAST, 
    toastTitle: title, 
    toastType: type,
    toastMessage: messge
  }
}

export function hideToast() {
  return {
    type: actionTypes.HIDE_TOAST
  }
}

export function clearToast(){
  return {
    type: actionTypes.CLEAR_TOAST
  }
}

export function emitError(errorTitle: string, errorDetails: string, okAction: Object = null){
  return {
    type: actionTypes.SUBMIT_ERROR, 
    errorTitle: errorTitle, 
    errorDetails: errorDetails,
    errorOkAction: okAction
  }
  
}
export function clearError(){
  return {
    type: actionTypes.CLEAR_ERROR
  }
}

export function emitConfirm(confirmTitle: string, confirmDetails: string, okAction: Object = null){
  return {
    type: actionTypes.SUBMIT_CONFIRM, 
    confirmTitle: confirmTitle, 
    confirmDetails: confirmDetails,
    confirmOkAction: okAction
  }
  
}
export function clearConfirm(){
  return {
    type: actionTypes.CLEAR_CONFIRM
  }
}

export function emitInfo(infoTitle: string, infoDetails: string, okAction: Object = null){
  return {
    type: actionTypes.SUBMIT_INFO, 
    infoTitle: infoTitle, 
    infoDetails: infoDetails,
    infoOkAction: okAction
  }
}

export function clearInfo(){
  return {
    type: actionTypes.CLEAR_INFO
}

}
export function changeTab (index) {
  return {
    type: actionTypes.CHANGE_TAB,
    index
  }
}

export function toggleDropdown(showDropDown: boolean){
  return {
    type: actionTypes.TOGGLE_DROPDOWN, 
    showDropDown: showDropDown
  }
}

export function updateDropdownData(clickedTrigger: string, triggerSettings: object, options: object, optionTemplate: object, showDropDown: boolean = true){
  return {
      type: actionTypes.UPDATE_DROPDOWN_DATA, 
      clickedTrigger: clickedTrigger,
      triggerSettings: triggerSettings, 
      options: options,
      optionTemplate: optionTemplate,
      showDropDown : showDropDown
    }
  }

export function updatedSelectedTrigerValue(value: string){
  return{
    type: actionTypes.UPDATE_SELECTED_TRIGGER_VALUE,
    value: value
  }
}

export function updatedOrientation(orientation: string){
  return{
    type: actionTypes.UPDATE_ORIENTATION,
    orientation
  }
}

export function requestUpdateTrigger(value: string){
   return (dispatch, getState) => {
      const documentLists = getState().documentsReducer; 
      const navReducer = getState().navReducer;
      const document = getSelectedDocument(documentLists, navReducer);
      const triggerSelectedValue = navReducer.triggerSelectedValue;
      const uersDetails = getState().navReducer.clickedTrigger.split('_');
      const ParticipantUniqueID = uersDetails[1];
      const familyCode = uersDetails[2];
      const triggerId = 'trigger_' + ParticipantUniqueID; 
      dispatch(peopleActions.AddtoFetchingList(triggerId));
      dispatch(updatedSelectedTrigerValue(value));
   }
        
}

export function hideToolbar(){
 return{
    type: actionTypes.TOGGLE_TOOLBAR,
    toolbarVisible: false
  }
}

export function showToolbar(){
 return{
    type: actionTypes.TOGGLE_TOOLBAR,
    toolbarVisible: true
  }
}

export function toggleToolbar(){
 return{
    type: actionTypes.TOGGLE_TOOLBAR,
    toolbarVisible: null
  }
}

