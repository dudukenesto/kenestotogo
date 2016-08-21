import { POP_ROUTE, PUSH_ROUTE, CHANGE_TAB,UPDATE_ROUTE_DATA } from '../constants/ActionTypes'

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

export function updateRouteData (routeData) {
  return {
    type: UPDATE_ROUTE_DATA,
    routeData
  }
}
export function changeTab (index) {
  return {
    type: CHANGE_TAB,
    index
  }
}
