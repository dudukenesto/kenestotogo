import * as types from '../constants/ActionTypes'
import * as constans from '../constants/GlobalConstans'
export default function documentlist(state = {
  name: "All Documents",
  catId: constans.ALL_DOCUMENTS,
  fId: "",
  parentId: "",
  parentName: ""
}, action) {
  switch (action.type) {
    case types.UPDATE_DOCUMENTS_LIST:
      return action;
    default:
      return state
  }
}
