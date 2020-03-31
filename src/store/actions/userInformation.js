import {dataBase, authWithFirebase} from '../../firebase/firebase'
import {
    ADD_P_TO_SENT_ORDER, EDIT_SENT_ORDER_ITEM,
    FETCH_USER_INFO_ERROR,
    FETCH_USER_INFO_START,
    FETCH_USER_INFO_SUCCESS, REMOVE_P_FROM_SENT_ORDER,
    SET_USER_INFO_ERROR,
    SET_USER_INFO_SUCCESS, SET_USER_PASSWORD_ERROR, SET_USER_PASSWORD_SUCCESS,
} from './actionTypes'
import {getElementById} from './currentOrder'

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

export function addProductToSentOrder(listId, item) {
    return (dispatch, getState) => {
        const state = getState().userInfReducer
        const info = state.info
        const ordersList = info.listOfCurrentOrders
        const indexOrder = getElementById(ordersList, listId)
        if (indexOrder === -1) {
            return null
        }
        const order = ordersList[indexOrder].order
        order.unshift(item)

        dispatch(dispatchAction(ADD_P_TO_SENT_ORDER, info))
    }
}

export function editSentOrderItem(listId, item) {
    return (dispatch, getState) => {
        try {
            const state = getState().userInfReducer
            const info = state.info
            const ordersList = info.listOfCurrentOrders
            const indexOrder = getElementById(ordersList, listId)
            if (indexOrder === -1) {
                return null
            }
            const order = ordersList[indexOrder].order
            const itemIndex = getElementById(order, item.id)
            if (indexOrder === -1) {
                return null
            }
            order[itemIndex] = item
            dispatch(dispatchAction(EDIT_SENT_ORDER_ITEM, info))
        } catch (e) {
            console.log(e)
        }
    }
}

export function removeProductFromSentOrder(listId, id) {
    return (dispatch, getState) => {

        const state = getState().userInfReducer
        const info = state.info
        const ordersList = info.listOfCurrentOrders
        const indexOrder = getElementById(ordersList, listId)
        if (indexOrder === -1) {
            return null
        }
        const order = ordersList[indexOrder].order
        const itemIndex = getElementById(order, id)
        if (indexOrder === -1) {
            return null
        }
        order.splice(itemIndex, 1)
        dispatch(dispatchAction(REMOVE_P_FROM_SENT_ORDER, info))

    }
}

export function editSentOrder() {
    return (dispatch, getState) => {
        try {
            dataBase.collection('users').doc(getState().authReducer.id).update({
                listOfCurrentOrders: getState().userInfReducer.info.listOfCurrentOrders,
            })
            dispatch(fetchUserInfo())
        } catch (e) {
            console.log(e)
        }
    }
}