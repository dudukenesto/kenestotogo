import { combineReducers } from 'redux'
import navReducer from './navReducer'
import documentlists from './documentlists'
import tabReducer from './tabReducer'
import accessReducer from './accessReducer'
import peopleReducer from './peopleReducer'

const rootReducer = combineReducers({
  navReducer, 
  accessReducer,
  documentlists, 
  peopleReducer
})

export default rootReducer
