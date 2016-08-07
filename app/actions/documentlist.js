import * as types from '../constants/ActionTypes'
let React = require('react-native')
let {
  Alert
} = React

export function updateDocumentList(catId : string, name : string, fId : string) {
  return {
    type: types.UPDATE_DOCUMENTS_LIST,
    catId: catId,
    name: name,
    fId: fId
  }
}
