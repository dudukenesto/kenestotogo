import * as types from '../constants/ActionTypes';
import * as routes from '../constants/routes'
import * as constans from '../constants/GlobalConstans'
import {getRetrieveShareObjectInfoUrl} from '../utils/ObjectUtil'
import { push, emitError} from './navActions'
export function updateIsFetching(isFetching: boolean){
    return {
        type: types.UPDATE_IS_FETCHING, 
        isFetching
    }
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
    const url = getRetrieveShareObjectInfoUrl(getState().accessReducer.env, getState().accessReducer.sessionToken, objectId, familyCode);
    return fetch(url)
      .then(response => response.json())
      .then(json => {
        alert(json.ResponseData.ResponseStatus);
        if (json.ResponseData.ResponseStatus == "FAILED") {
           dispatch(emitError(json.ResponseData.ErrorMessage,'error details'))
           dispatch(emitError(json.ResponseData.ErrorMessage,""))
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
        dispatch(emitError("Failed to retrieve share info: " + JSON.stringify(error),""))


      })
  }
}