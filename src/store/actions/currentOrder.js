import {
    ADD_P_TO_RESTAURANT_ORDER,
    ADD_P_TO_SHOP_ORDER, CHANGE_RESTAURANT_NAME, CHANGE_SHOP_NAME,
    DELETE_ORDER, EDIT_ORDER_RESTAURANT_ITEM,
    EDIT_ORDER_SHOP_ITEM, REMOVE_NAMES, REMOVE_P_FROM_RESTAURANT_ORDER,
    REMOVE_P_FROM_SHOP_ORDER,
    SEND_ORDER,
} from './actionTypes'
import {dataBase} from '../../firebase/firebase'
import * as firebase from 'firebase/app'
import {fetchUserInfo} from './userInformation'

export function getElementById(arr, id) {
    return arr.findIndex(x => x.id === id)
}

function updateLocalStorage(getState, list) {
    if (list === 'shop-tab')
        localStorage.setItem('shopOrder', JSON.stringify(getState().currentOrder.shopOrder))
    else if (list === 'restaurant-tab')
        localStorage.setItem('restaurantOrder', JSON.stringify(getState().currentOrder.restaurantOrder))
    else {
        localStorage.removeItem('shopOrder')
        localStorage.removeItem('restaurantOrder')
        localStorage.removeItem('nameOfRestaurant')
        localStorage.removeItem('nameOfShop')
    }
}

function dispatchAction(actionType, item) {
    return {
        type: actionType,
        item,
    }
}

function removeNames() {
    return {
        type: REMOVE_NAMES,
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

export function cancelOrder(order) {
    return (dispatch, getState) => {
        try {
            dataBase.collection('users').doc(getState().authReducer.id).update({
                listOfCurrentOrders: firebase.firestore.FieldValue.arrayRemove(order),
            })
            order.description = 'Вы отменили заказ'
            order.endTime = `${new Date()}`
            order.status = 5
            dataBase.collection('users').doc(getState().authReducer.id).update({
                listOfDeliveredOrders: firebase.firestore.FieldValue.arrayUnion(order),
            })
            dispatch(fetchUserInfo())
        }
        catch (e) {
            console.log(e)
        }
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
        dispatch(addOrderToOrderList())
        dispatch(dispatchAction(SEND_ORDER, null))
        dispatch(removeNames())
        updateLocalStorage(getState, null)
        dispatch(fetchUserInfo())
    }
}

export function deleteOrder() {
    return (dispatch, getState) => {
        dispatch(dispatchAction(DELETE_ORDER, null))
        dispatch(removeNames())
        updateLocalStorage(getState, null)
    }
}

export function changeRestaurantName(name) {
    return (dispatch, getState) => {
        dispatch(dispatchAction(CHANGE_RESTAURANT_NAME, name))
        localStorage.setItem('nameOfRestaurant', JSON.stringify(getState().currentOrder.nameOfRestaurant))
    }
}

export function changeShopName(name) {
    return (dispatch, getState) => {
        dispatch(dispatchAction(CHANGE_SHOP_NAME, name))
        localStorage.setItem('nameOfShop', JSON.stringify(getState().currentOrder.nameOfShop))
    }
}

export function addOrderToOrderList() {
    return async (dispatch, getState) => {
        const state = getState().currentOrder
        const orderInfo = {
            // 3 статуса 0 - заказ на обработке, 1 - курьер принял заказ, 2 - заказ выполнен или отменён
            status: 0,
            startTime: `${new Date()}`,
            courierId: '',
            endTime: '',
            description: 'Курьер ещё не принял заказ',
        }
        if (state.shopOrder.length !== 0) {
            orderInfo.id = Math.random().toString(36).substr(2, 9)
            orderInfo.name = state.nameOfShop === '' ? 'Из любого магизна' : state.nameOfShop
            orderInfo.order = state.shopOrder
            dataBase.collection('users').doc(getState().authReducer.id).update({
                listOfCurrentOrders: firebase.firestore.FieldValue.arrayUnion(orderInfo),
            })
        }
        if (state.restaurantOrder.length !== 0 && state.nameOfRestaurant !== '') {
            orderInfo.id = Math.random().toString(36).substr(2, 9)
            orderInfo.name = state.nameOfRestaurant
            orderInfo.order = state.restaurantOrder
            dataBase.collection('users').doc(getState().authReducer.id).update({
                listOfCurrentOrders: firebase.firestore.FieldValue.arrayUnion(orderInfo),
            })
        }
    }
}

export function createUserStore(info) {
    return async (dispatch, getState) => {
        dataBase.collection('users').doc(getState().authReducer.id).set(info)
        dispatch(fetchUserInfo())
    }
}

