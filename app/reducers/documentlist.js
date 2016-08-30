import * as types from '../constants/ActionTypes'
import * as constans from '../constants/GlobalConstans'
import {getDocumentsTitle} from '../utils/documentsUtils'
export default function documentlist(state = {
  name: getDocumentsTitle(constans.MY_DOCUMENTS),
  catId: constans.MY_DOCUMENTS,
  fId: "",
  sortDirection: constans.ASCENDING,
  sortBy: constans.ASSET_NAME

}, action) {
  switch (action.type) {
    case types.UPDATE_DOCUMENTS_LIST:
      return action;
    default:
      return state
  }
}

