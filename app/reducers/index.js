import { combineReducers } from 'redux'
import navReducer from './navReducer'
import documentlist from './documentlist'
import documentlists from './documentlists'
import tabReducer from './tabReducer'
import accessReducer from './accessReducer'

const rootReducer = combineReducers({
  tabReducer,
  navReducer, 
  accessReducer,
  documentlist,
  documentlists
})

export default rootReducer
