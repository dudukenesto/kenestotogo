import * as types from '../constants/ActionTypes';
import * as routes from '../constants/routes'
import * as constans from '../constants/GlobalConstans'
import {getRetrieveShareObjectInfoUrl,writeToLog} from '../utils/ObjectUtils'
import { push, emitError} from './navActions'
import _ from "lodash";
export function updateIsFetching(isFetching: boolean){
    return {
        type: types.UPDATE_IS_FETCHING, 
        isFetching
    }
}

export function AddtoFetchingList(id: string){
    return{
         type: types.ADD_TO_FETCHING_LIST, 
         id
    }
}

export function updateFetchingList(fetchingList: object){
    return{
         type: types.REMOVE_FROM_FETCHING_LIST, 
         fetchingList
    }
}

export function RemoveFromFetchingList(id: string){

    return{
         type: types.REMOVE_FROM_FETCHING_LIST, 
         id
    }

//   return (dispatch, getState) => {
   
//  const fetchingListNow = getState().peopleReducer.fetchingList; 



// //   alert(fetchingListNow + ' ' + getState().peopleReducer.fetchingList)
// //             _.remove(fetchingListNow, function (thisid) {
// //                 return thisid === id
// //                 });

// //alert(fetchingListNow + ' ' + getState().peopleReducer.fetchingList)

//         dispatch(updateFetchingList(fetchingListNow));
//  }
}

export function RetrieveShareObjectInfo(ObjectInfo : Object, UsersAndGroups: Object)
{
   
    return {
        type: types.RETRIEVE_SHARE_OBJECT_INFO,
        ObjectInfo: ObjectInfo,
        UsersAndGroups: UsersAndGroups
    }
}
export function RequestShareObjectInfo(objectId : string, familyCode: string, objectName: string){
    
  return (dispatch, getState) => {

      dispatch(updateIsFetching(true));
    const {sessionToken, env} = getState().accessReducer;
    const url = getRetrieveShareObjectInfoUrl(env, sessionToken, objectId, familyCode);
    writeToLog(env, sessionToken, constans.DEBUG, `function RequestShareObjectInfo - url: ${url}`)
    return fetch(url)
      .then(response => response.json())
      .then(json => {
       // alert(json.ResponseData.ObjectInfo);
        if (json.ResponseStatus == "FAILED") {
           dispatch(emitError("Failed to retrieve sharing info",""))
        writeToLog(env, sessionToken, constans.ERROR, `function RequestShareObjectInfo - Failed to retrieve sharing info`)
        }
        else {
            const ObjectInfo = json.ResponseData.ObjectInfo; 
            const UsersAndGroups = json.ResponseData.UsersAndGroups;
            dispatch(RetrieveShareObjectInfo(ObjectInfo, UsersAndGroups))

            //  var data = {
            //         key: "addPeople",
            //         name: objectName,
            //         documentId: objectId,
            //     }

            // dispatch(push(routes.addPeopleRoute(data).route));

        }
      })
      .catch((error) => {
        //console.log("error:" + JSON.stringify(error))
        dispatch(emitError("Failed to retrieve sharing info" ,""))
        writeToLog(env, sessionToken, constans.ERROR, `function RequestShareObjectInfo - Failed to retrieve sharing info`,error)
      })
  }
}

export function removeFromSharingList(id: string){
    
    return {
        type: types.REMOVE_FROM_SHARING_LIST,
        id
    }
}