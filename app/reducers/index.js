import { combineReducers } from 'redux'
import navReducer from './navReducer'
import documentsReducer from './documentsReducer'
import tabReducer from './tabReducer'
import accessReducer from './accessReducer'
import peopleReducer from './peopleReducer'

const rootReducer = combineReducers({
  navReducer, 
  accessReducer,
  documentsReducer, 
  peopleReducer
})

export default rootReducer
