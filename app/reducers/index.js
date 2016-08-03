import { combineReducers } from 'redux'
import navReducer from './navReducer'
import tabReducer from './tabReducer'
import accessReducer from './accessReducer'

const rootReducer = combineReducers({
  tabReducer,
  navReducer, 
  accessReducer 
})

export default rootReducer
