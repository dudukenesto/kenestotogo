import * as types from '../constants/ActionTypes'
import * as constans from '../constants/GlobalConstans'

let React = require('react-native')
let {
  Alert
} = React

export function updateDocumentList(catId: string, name: string, fId: string="", sortDirection: string =constans.ASCENDING , sortBy: string = constans.ASSET_NAME) {
  return {
    type: types.UPDATE_DOCUMENTS_LIST,
    catId: catId,
    name: name,
    fId: fId,
    sortDirection: sortDirection,
    sortBy: sortBy
  }
}
