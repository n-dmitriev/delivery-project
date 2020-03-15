import {ADD_P_TO_ORDER, DELETE_ORDER, EDIT_ORDER_ITEM, REMOVE_P_FROM_ORDER, SEND_ORDER} from './actionTypes'

export function add(item) {
    return {
        type: ADD_P_TO_ORDER,
        item,
    }
}

export function addProductToOrder(item) {
    return (dispatch, getState) => {
        dispatch(add(item))
        localStorage.setItem('currentOrder', JSON.stringify(getState().currentOrder.order))
    }
}

export function editOrderItem(item) {
    return (dispatch, getState) => {
        const state = getState().currentOrder
        const index = getElementById(state.order, item.id)
        const arr = state.order[index].assign({}, item)
        dispatch(edit(arr))
        localStorage.setItem('currentOrder', JSON.stringify(getState().currentOrder.order))
    }
}

function getElementById(arr, id) {
    return arr.findIndex(x => x.id === id)
}

export function edit(item) {
    return {
        type: EDIT_ORDER_ITEM,
        item,
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
        dispatch(remove([...arr]))
        localStorage.setItem('currentOrder', JSON.stringify(getState().currentOrder.order))
    }
}

export function remove(item) {
    return {
        type: REMOVE_P_FROM_ORDER,
        item,
    }
}

export function sendOrder() {
    return {
        type: SEND_ORDER,
    }
}

export function deleteOrder() {
    return {
        type: DELETE_ORDER,
    }
}