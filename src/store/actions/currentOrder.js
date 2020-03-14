import {ADD_P_TO_ORDER, DELETE_ORDER, EDIT_ORDER_ITEM, REMOVE_P_FROM_ORDER, SEND_ORDER} from './actionTypes'

export function addProductToOrder(item){
    return {
        type: ADD_P_TO_ORDER,
        item
    }
}

export function editOrderItem(item) {
    return {
        type: EDIT_ORDER_ITEM,
        item
    }
}

export function removeProductFromOrder(id) {
    return {
        type: REMOVE_P_FROM_ORDER,
        id
    }
}

export function sendOrder() {
    return {
        type: SEND_ORDER
    }
}

export function deleteOrder() {
    return{
        type: DELETE_ORDER
    }
}