import * as types from '../constants/ActionTypes'
import * as constans from '../constants/GlobalConstans'

let React = require('react-native')
let {
  Alert
} = React

export function updateDocumentList(documentList) {
  return {
    type: types.UPDATE_DOCUMENTS_LIST,
    name: documentList.name,
    catId: documentList.catId,
    fId:  documentList.fId,
    sortDirection: documentList.sortDirection,
    sortBy: documentList.sortBy
  }
}
