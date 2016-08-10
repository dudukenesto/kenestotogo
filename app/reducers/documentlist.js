import * as types from '../constants/ActionTypes'
import * as constans from '../constants/GlobalConstans'

export default function documentlist(state = {
  name: "All Documents",
  catId: constans.ALL_DOCUMENTS,
  fId: "",
  sortDirection:constans.ASCENDING,
  sortBy:constans.MODIFICATION_DATE

}, action) {
  switch (action.type) {
    case types.UPDATE_DOCUMENTS_LIST:
      return action;
    default:
      return state
  }
}
