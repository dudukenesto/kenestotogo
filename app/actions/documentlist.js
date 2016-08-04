import * as types from '../constants/ActionTypes'
let React = require('react-native')
let {
  Alert
} = React

export function updateDocumentList(catId, name, fId, parentId, parentName) {
  return {
    type: types.UPDATE_DOCUMENTS_LIST,
    catId: catId,
    name: name,
    fId: fId,
    parentId: parentId,
    parentName: parentName
  }
}
