import { POP_ROUTE, PUSH_ROUTE, NAV_JUMP_TO_KEY, NAV_JUMP_TO_INDEX, NAV_RESET, CHANGE_TAB, UPDATE_ROUTE_DATA, SUBMIT_ERROR, CLEAR_ERROR,
  SUBMIT_INFO, CLEAR_INFO, SUBMIT_CONFIRM, CLEAR_CONFIRM, SUBMIT_TOAST, CLEAR_TOAST, UPDATE_DROPDOWN_DATA,UPDATE_SELECTED_TRIGGER_VALUE} from '../constants/ActionTypes'
import * as peopleActions from '../actions/peopleActions'
import {getSelectedDocument} from '../utils/documentsUtils'
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

export function emitToast(type: string, messge: string, title: string){
    return {
    type: SUBMIT_TOAST, 
    toastTitle: title, 
    toastType: type,
    toastMessage: messge
  }
}

export function clearToast(){
  return {
    type: CLEAR_TOAST
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

export function toggleDropdown(showDropDown: boolean){
  return {
    type: TOGGLE_DROPDOWN, 
    showDropDown: showDropDown
  }
}

export function updateDropdownData(clickedTrigger: string, triggerSettings: object, options: object, optionTemplate: object, showDropDown: boolean = true){
  return {
      type: UPDATE_DROPDOWN_DATA, 
      clickedTrigger: clickedTrigger,
      triggerSettings: triggerSettings, 
      options: options,
      optionTemplate: optionTemplate,
      showDropDown : showDropDown
    }
  }

export function updatedSelectedTrigerValue(value: string){
  return{
    type: UPDATE_SELECTED_TRIGGER_VALUE,
    value: value
  }
}

export function requestUpdateTrigger(value: string){
   return (dispatch, getState) => {
      const documentLists = getState().documentlists; 
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

