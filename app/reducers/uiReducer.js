import * as types from '../constants/ActionTypes'
function uiReducer(
    state = {
        openedDialogModalref: '',
        isSearchboxOpen: false, 
        isDrawerOpen: false, 
        isPopupMenuOpen: false
    }, action){
       switch (action.type) {
           case types.SET_DRAWER_STATE:
               return {
                   ...state, 
                   isDrawerOpen : action.isDrawerOpen
               }
            case types.SET_POPUP_MENU_STATE:
               return {
                   ...state, 
                   isPopupMenuOpen : action.isPopupMenuOpen
               }
            case types.SET_SEARCHBOX_STATE:
                return {
                    ...state, 
                    isSearchboxOpen : action.isSearchboxOpen
               }
            case types.SET_OPEN_MODAL_REF:
                return {
                    ...state, 
                    openedDialogModalref : action.openedDialogModalref
               }
           default:
               return state;
       }
    }

export default uiReducer