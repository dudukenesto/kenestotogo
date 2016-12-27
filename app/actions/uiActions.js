import * as types from '../constants/ActionTypes';

export function setDrawerState(isDrawerOpen: bool){
    return {
        type: types.SET_DRAWER_STATE, 
        isDrawerOpen : isDrawerOpen
    }
}

export function setSearchboxState(isSearchboxOpen: bool){
    return {
        type: types.SET_SEARCHBOX_STATE, 
        isSearchboxOpen : isSearchboxOpen
    }
}
export function setPopupMenuState(isPopupMenuOpen: bool){
    return {
        type: types.SET_POPUP_MENU_STATE, 
        isPopupMenuOpen : isPopupMenuOpen
    }
}
export function setOpenModalRef(openedDialogModalref: string){
    return {
        type: types.SET_OPEN_MODAL_REF, 
        openedDialogModalref : openedDialogModalref
    }
}

