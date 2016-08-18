import { POP_ROUTE, PUSH_ROUTE, CHANGE_TAB,UPDATE_ROUTE } from '../constants/ActionTypes'

export function push (route) {
  return {
    type: PUSH_ROUTE,
    route
  }
}

export function pop () {
  return {
    type: POP_ROUTE
  }
}

export function updateRoute (routeData) {
  return {
    type: UPDATE_ROUTE,
    routeData
  }
}
export function changeTab (index) {
  return {
    type: CHANGE_TAB,
    index
  }
}
