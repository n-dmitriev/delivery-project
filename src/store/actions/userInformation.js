import {dataBase} from '../../firebase/firebase'
import {FETCH_USER_INFO_ERROR, FETCH_USER_INFO_START, FETCH_USER_INFO_SUCCESS} from './actionTypes'

export function dispatchAction(type, item) {
    return {
        type, item,
    }
}

export function fetchUserInfo() {
    return async (dispatch, getState) => {
       try {
           dispatch(dispatchAction(FETCH_USER_INFO_START, null))
           const docRef = dataBase.collection("users").doc(getState().authReducer.id);
           const answer = await docRef.get()
           const data = answer.data()
           dispatch(dispatchAction(FETCH_USER_INFO_SUCCESS, data))
       }
       catch (e) {
           dispatch(dispatchAction(FETCH_USER_INFO_ERROR, e))
       }
    }
}

export function setUserInfo(info) {
    return async (dispatch, getState) => {
        dataBase.collection('users').doc(getState().authReducer.id).update({
            name: info.name,
            numberPhone: info.numberPhone,
            address: info.address
        })
        dispatch(fetchUserInfo())
    }
}