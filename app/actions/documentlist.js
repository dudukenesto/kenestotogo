import * as types from '../constants/ActionTypes'
import * as constans from '../constants/GlobalConstans'

let React = require('react-native')
let {
  Alert
} = React

export function updateDocumentList(catId: string, name: string, fId: string, sortDirection: string = constans.NAME_FIELD, sortBy: string = constans.ASCENDING) {
  return {
    type: types.UPDATE_DOCUMENTS_LIST,
    catId: catId,
    name: name,
    fId: fId,
    sortDirection: sortDirection,
    sortBy: sortBy
  }
}
