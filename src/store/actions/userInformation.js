import {dataBase, authWithFirebase} from '../../firebase/firebase'
import {
    FETCH_USER_INFO_ERROR,
    FETCH_USER_INFO_START,
    FETCH_USER_INFO_SUCCESS,
    SET_USER_INFO_ERROR,
    SET_USER_INFO_SUCCESS, SET_USER_PASSWORD_ERROR, SET_USER_PASSWORD_SUCCESS,
} from './actionTypes'

export function dispatchAction(type, item) {
    return {
        type, item,
    }
}

export function fetchUserInfo() {
    return async (dispatch, getState) => {
        try {
            dispatch(dispatchAction(FETCH_USER_INFO_START, null))
            const docRef = dataBase.collection('users').doc(getState().authReducer.id)
            const answer = await docRef.get()
            const data = answer.data()
            dispatch(dispatchAction(FETCH_USER_INFO_SUCCESS, data))
        } catch (e) {
            dispatch(dispatchAction(FETCH_USER_INFO_ERROR, e))
        }
    }
}

export function setUserInfo(info) {
    return async (dispatch, getState) => {
        try {
            dataBase.collection('users').doc(getState().authReducer.id).update({
                name: info.name,
                numberPhone: info.numberPhone,
                address: info.address,
            })
            dispatch(dispatchAction(SET_USER_INFO_SUCCESS, null))
            dispatch(fetchUserInfo())
        } catch (e) {
            dispatch(dispatchAction(SET_USER_INFO_ERROR, e))
        }

    }
}

export function passwordChange(oldPassword, newPassword) {
    return async (dispatch, getState) => {
        try {
            await authWithFirebase.signInWithEmailAndPassword(getState().authReducer.email, oldPassword)
            const user = authWithFirebase.currentUser
            await user.updatePassword(newPassword)
            dispatch(dispatchAction(SET_USER_PASSWORD_SUCCESS))
        } catch
            (e) {
            dispatch(dispatchAction(SET_USER_PASSWORD_ERROR, e))
        }
    }
}