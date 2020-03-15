import {ADD_P_TO_ORDER, DELETE_ORDER, EDIT_ORDER_ITEM, REMOVE_P_FROM_ORDER, SEND_ORDER} from './actionTypes'

function getElementById(arr, id) {
    return arr.findIndex(x => x.id === id)
}

function updateLocalStorage(getState) {
    localStorage.setItem('currentOrder', JSON.stringify(getState().currentOrder.order))
}

function dispatchAction(actionType, item) {
    return {
        type: actionType,
        item
    }
}

export function addProductToOrder(item) {
    return (dispatch, getState) => {
        dispatch(dispatchAction(ADD_P_TO_ORDER,item))
        updateLocalStorage(getState)
    }
}

export function editOrderItem(item) {
    return (dispatch, getState) => {
        const state = getState().currentOrder
        const index = getElementById(state.order, item.id)
        const arr = state.order
        arr[index] = item
        dispatch(dispatchAction(EDIT_ORDER_ITEM, arr))
        updateLocalStorage(getState)
    }
}

export function removeProductFromOrder(id) {
    return (dispatch, getState) => {
        const state = getState().currentOrder
        const index = getElementById(state.order, id)
        if (index < -1) {
            return null
        }
        const arr = state.order
        arr.splice(index, 1)
        dispatch(dispatchAction(REMOVE_P_FROM_ORDER,[...arr]))
        updateLocalStorage(getState)
    }
}

export function sendOrder() {
    return (dispatch, getState) => {
        dispatch(dispatchAction(SEND_ORDER, null))
        updateLocalStorage(getState)
    }
}

export function deleteOrder() {
    return (dispatch, getState) => {
        dispatch(dispatchAction(DELETE_ORDER, null))
        updateLocalStorage(getState)
    }
}