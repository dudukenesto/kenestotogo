import * as types from '../constants/ActionTypes'

function peopleReducer(state = {isFetching: false, UsersAndGroups: null, ObjectInfo: null}, action){
     switch (action.type) {
        case types.UPDATE_IS_FETCHING:
            return {
                ...state,
                isFetching: action.isFetching
            }
        case types.RETRIEVE_SHARE_OBJECT_INFO:
            return {
                ...state,
                UsersAndGroups: action.UsersAndGroups, 
                ObjectInfo: action.ObjectInfo, 
                isFetching: false

            }
        default:
        return state
     }
   
}

export default peopleReducer