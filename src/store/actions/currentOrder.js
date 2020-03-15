import {
    ADD_P_TO_RESTAURANT_ORDER,
    ADD_P_TO_SHOP_ORDER,
    DELETE_ORDER, EDIT_ORDER_RESTAURANT_ITEM,
    EDIT_ORDER_SHOP_ITEM, REMOVE_P_FROM_RESTAURANT_ORDER,
    REMOVE_P_FROM_SHOP_ORDER,
    SEND_ORDER,
} from './actionTypes'

function getElementById(arr, id) {
    return arr.findIndex(x => x.id === id)
}

function updateLocalStorage(getState, list) {
    if(list === 'shop-tab')
        localStorage.setItem('shopOrder', JSON.stringify(getState().currentOrder.shopOrder))
    else if(list === 'restaurant-tab')
        localStorage.setItem('restaurantOrder', JSON.stringify(getState().currentOrder.restaurantOrder))
    else localStorage.clear()
}

function dispatchAction(actionType, item) {
    return {
        type: actionType,
        item,
    }
}

export function addProductToOrder(item, list) {
    return (dispatch, getState) => {
        list === 'shop-tab'
            ? dispatch(dispatchAction(ADD_P_TO_SHOP_ORDER, item))
            : dispatch(dispatchAction(ADD_P_TO_RESTAURANT_ORDER, item))
        updateLocalStorage(getState, list)
    }
}

export function editOrderItem(item, list) {
    return (dispatch, getState) => {
        const state = getState().currentOrder
        let arr, type
        if (list === 'shop-tab') {
            arr = state.shopOrder
            type = EDIT_ORDER_SHOP_ITEM
        } else {
            arr = state.restaurantOrder
            type = EDIT_ORDER_RESTAURANT_ITEM
        }

        const index = getElementById(arr, item.id)
        arr[index] = item
        dispatch(dispatchAction(type, arr))
        updateLocalStorage(getState, list)
    }
}

export function removeProductFromOrder(id, list) {
    return (dispatch, getState) => {
        const state = getState().currentOrder
        let arr, type
        if (list === 'shop-tab') {
            arr = state.shopOrder
            type = REMOVE_P_FROM_SHOP_ORDER
        } else {
            arr = state.restaurantOrder
            type = REMOVE_P_FROM_RESTAURANT_ORDER
        }
        const index = getElementById(arr, id)
        if (index === -1) {
            return null
        }
        arr.splice(index, 1)
        dispatch(dispatchAction(type, [...arr]))
        updateLocalStorage(getState, list)
    }
}

export function sendOrder() {
    return (dispatch, getState) => {
        dispatch(dispatchAction(SEND_ORDER, null))
        updateLocalStorage(getState, null)
    }
}

export function deleteOrder() {
    return (dispatch, getState) => {
        dispatch(dispatchAction(DELETE_ORDER, null))
        updateLocalStorage(getState, null)
    }
}