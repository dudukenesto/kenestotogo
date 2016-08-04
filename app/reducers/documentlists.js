import * as types from '../constants/ActionTypes'

let React = require('react-native')
function documentlist(state = {
  isFetching: false,
  items: [],
  nextUrl: false
}, action) {
  switch (action.type) {
    case types.RECEIVE_DOCUMENTS:
      return {
        ...state,
        isFetching: false,
        items: [...state.items, ...action.documents],
        nextUrl: action.nextUrl
      }

    case types.REQUEST_DOCUMENTS:
      return {
        ...state,
        isFetching: true,
        nextUrl: null
      }

    case types.REFRESH_DOCUMENTS_LIST:
      return {
        isFetching: false,
        items: [...action.documents],
        nextUrl: action.nextUrl
      }

    case types.CHANGE_DOCUMENTS_LIST:
      return {
        isFetching: false,
        items: [...action.documents],
        nextUrl: action.nextUrl,
        name: action.name,
        catId: action.catId,
        fId: action.fId,
        parentId: action.parentId,
        parentName: action.parentName,
      }

    default:
      return state
  }
}

export default function documentlists(state = {}, action) {
  switch (action.type) {
    case types.RECEIVE_DOCUMENTS:
      return Object.assign({}, state, {
        [action.catId]: documentlist(state[action.catId], action)
      })

    case types.REQUEST_DOCUMENTS:
      return Object.assign({}, state, {
        [action.catId]: documentlist(state[action.catId], action)
      })

    case types.REFRESH_DOCUMENTS_LIST:
      return Object.assign({}, state, {
        [action.catId]: documentlist(state[action.catId], action),
      })

    case types.CHANGE_DOCUMENTS_LIST:
      return Object.assign({}, state, {
        [action.catId]: documentlist(state[action.catId], action),
      })

    default:
      return state
  }
}
