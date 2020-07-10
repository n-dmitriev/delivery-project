import {
    ADD_P_TO_RESTAURANT_ORDER,
    ADD_P_TO_SHOP_ORDER, CHANGE_RESTAURANT_NAME, CHANGE_SHOP_NAME,
    DELETE_ORDER, EDIT_ORDER_RESTAURANT_ITEM,
    EDIT_ORDER_SHOP_ITEM, REMOVE_P_FROM_RESTAURANT_ORDER,
    REMOVE_P_FROM_SHOP_ORDER,
    SEND_ORDER,
} from './actionTypes'
import {dataBase} from '../../firebase/firebase'
import {fetchOrderList, fetchUserInfo} from '../user/userActions'
import {dispatchAction, getDate, getElementById} from '../universalFunctions'
import {ADD_P_TO_SENT_ORDER, EDIT_SENT_ORDER_ITEM, REMOVE_P_FROM_SENT_ORDER} from '../user/actionTypes'

//Обновление localStorage при внесении изменений в заказ
function updateLocalStorage(getState, list) {
    if (list === 'shop-tab')
        localStorage.setItem('shopOrder', JSON.stringify(getState().orderReducer.shopOrder))
    else if (list === 'restaurant-tab')
        localStorage.setItem('restaurantOrder', JSON.stringify(getState().orderReducer.restaurantOrder))
    else {
        localStorage.removeItem('shopOrder')
        localStorage.removeItem('restaurantOrder')
        localStorage.removeItem('nameOfRestaurant')
        localStorage.removeItem('nameOfShop')
    }
}

//Отправка заказа на сервер
export function sendOrder(info) {
    return async (dispatch, getState) => {
        const state = getState().orderReducer
        const userId = getState().authReducer.id


        // 6 статусов
        // 0 - заказ на обработке, 1 - курьер принял заказ, 2 - курьер осуществляет доставку
        // 3 - заказ выполнен, 4 - заказ отменён пользователем, -1 - подозрение на троллинг
        const fullOrderInfo = {
            startTime: getDate(),
            endTime: '',
            orderValue: '',
            deliveryValue: '',
            description: 'Курьер ещё не принял заказ',
            status: 0,
            clientName: info.name,
            clientNumberPhone: info.numberPhone,
            clientAddress: info.address,
            coordinate: info.coordinate
        }
        if (state.shopOrder.length !== 0) {
            fullOrderInfo.name = state.nameOfShop === '' ? 'Из любого магизна' : state.nameOfShop
            fullOrderInfo.order = state.shopOrder

            const orders = dataBase.collection("orders")
            const docRef = await orders.add(fullOrderInfo)
            const orderId = docRef.id
            await orders.doc(orderId).update({
                id: orderId,
            })

            dataBase.collection('user-orders').add({
                userId: userId,
                orderId:orderId,
                courierId: '',
                status: 0
            })
        }
        if (state.restaurantOrder.length !== 0 && state.nameOfRestaurant !== '') {
            fullOrderInfo.name = state.nameOfRestaurant
            fullOrderInfo.order = state.restaurantOrder

            const orders = dataBase.collection("orders")
            const docRef = await orders.add(fullOrderInfo)
            const orderId = docRef.id
            await orders.doc(orderId).update({
                id: orderId,
            })

            dataBase.collection('user-orders').add({
                userId: userId,
                orderId:orderId,
                courierId: '',
                status: 0
            })
        }
        dispatch(dispatchAction(SEND_ORDER, null))
        updateLocalStorage(getState, null)
        dispatch(fetchUserInfo())
    }
}

//Отмена заказа пользователем
export function cancelOrder(id) {
    return async (dispatch) => {
        try {
            const userOrders = dataBase.collection('user-orders')
            const answer = await userOrders.where('orderId', '==', id).get()
            answer.forEach((el) => {
                userOrders.doc(el.id).update({
                    status: 4
                })
            })

            dataBase.collection('orders').doc(id).update({
                description: 'Вы отменили заказ',
                endTime: getDate(),
                status: 4
            })


            dispatch(fetchOrderList('active', 'userId', null, [0, 1, 2]))
        } catch (e) {
            console.log(e)
        }
    }
}

//Функция локально добавляющая продукт в заказ
export function addProductToOrder(item, list) {
    return (dispatch, getState) => {
        list === 'shop-tab'
            ? dispatch(dispatchAction(ADD_P_TO_SHOP_ORDER, item))
            : dispatch(dispatchAction(ADD_P_TO_RESTAURANT_ORDER, item))
        updateLocalStorage(getState, list)
    }
}

//Функция локально редактирующая продукт в заказе
export function editOrderItem(item, list) {
    return (dispatch, getState) => {
        const state = getState().orderReducer
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

//Функция локально удаляющая заказ
export function deleteOrder() {
    return (dispatch, getState) => {
        dispatch(dispatchAction(DELETE_ORDER, null))
        updateLocalStorage(getState, null)
    }
}

//Функция локально удаляющая продукт из заказа
export function removeProductFromOrder(id, list) {
    return (dispatch, getState) => {
        const state = getState().orderReducer
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

//Функция локально изменяющая имя ресторана
export function changeRestaurantName(name) {
    return (dispatch, getState) => {
        dispatch(dispatchAction(CHANGE_RESTAURANT_NAME, name))
        localStorage.setItem('nameOfRestaurant', JSON.stringify(getState().orderReducer.nameOfRestaurant))
    }
}

//Функция локально изменяющая имя Магазина
export function changeShopName(name) {
    return (dispatch, getState) => {
        dispatch(dispatchAction(CHANGE_SHOP_NAME, name))
        localStorage.setItem('nameOfShop', JSON.stringify(getState().orderReducer.nameOfShop))
    }
}

//Далее идут фу-ии по работе с уже отправленным заказом

//Функция локально добавляющая продукт в уже отправленный заказ, без отправки на сервер
export function addProductToSentOrder(listId, item) {
    return (dispatch, getState) => {
        const state = getState().userReducer
        const ordersList = state.listOfCurrentOrders
        const indexOrder = getElementById(ordersList, listId)
        if (indexOrder === -1) {
            return null
        }
        const order = ordersList[indexOrder].order
        order.unshift(item)

        dispatch(dispatchAction(ADD_P_TO_SENT_ORDER, ordersList))
    }
}

//Функция локально редактирующая продукт в уже отправленном заказе, без отправки на сервер
export function editSentOrderItem(listId, item) {
    return (dispatch, getState) => {
        try {
            const state = getState().userReducer
            const ordersList = state.listOfCurrentOrders
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
            dispatch(dispatchAction(EDIT_SENT_ORDER_ITEM, ordersList))
        } catch (e) {
            console.log(e)
        }
    }
}


//Функция локально удаляющая продукт в уже отправленном заказе, без отправки на сервер
export function removeProductFromSentOrder(listId, id) {
    return (dispatch, getState) => {
        try {
            const state = getState().userReducer
            const ordersList = state.listOfCurrentOrders
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
            dispatch(dispatchAction(REMOVE_P_FROM_SENT_ORDER, ordersList))
        } catch (e) {
            console.log(e)
        }
    }
}

export function editSentOrder(orderInfo, userInfo) {
    return (dispatch) => {
        try {
            if (orderInfo.order.length === 0) {
                dispatch(cancelOrder(orderInfo.id))
            }

            orderInfo.clientName = userInfo.name
            orderInfo.clientNumberPhone = userInfo.numberPhone
            orderInfo.clientAddress = userInfo.address
            orderInfo.coordinate = userInfo.coordinate

            dataBase.collection('orders').doc(orderInfo.id).update(orderInfo)
            dispatch(fetchUserInfo())
        } catch (e) {
            console.log(e)
        }
    }
}

export function reOrder(orderInfo) {
    return async (dispatch, getState) => {
        const userId = getState().authReducer.id

        const order = orderInfo.order

        for (let item of order) {
            item.purchased = false
        }

        const fullOrderInfo = {
            startTime: getDate(),
            endTime: '',
            orderValue: '',
            deliveryValue: '',
            description: 'Курьер ещё не принял заказ',
            name: orderInfo.name,
            order: order,
            coordinate: orderInfo.coordinate
        }

            const orders = dataBase.collection("orders")
            const docRef = await orders.add(fullOrderInfo)
            const orderId = docRef.id
            await orders.doc(orderId).update({
                id: orderId,
            })

            dataBase.collection('user-orders').add({
                userId: userId,
                orderId:orderId,
                courierId: '',
                status: 0
            })
        dispatch(fetchOrderList('active', 'userId', null, [0, 1, 2]))
    }
}
