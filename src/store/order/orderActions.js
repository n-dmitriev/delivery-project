import {
    ADD_PRODUCT, CHANGE_NAME,
    DELETE_ORDER_INFO,
    EDIT_ORDER,
    REMOVE_PRODUCT
} from './actionTypes'
import {dataBase} from '../../firebase/firebase'
import {fetchOrderList} from '../user/userActions'
import {dispatchAction, getElementById} from '../universalFunctions'
import {ADD_P_TO_SENT_ORDER, AL_CHANGE, EDIT_SENT_ORDER_ITEM, REMOVE_P_FROM_SENT_ORDER} from '../user/actionTypes'

function removeOrder() {
    localStorage.removeItem('name')
    localStorage.removeItem('order')
}

//Отправка заказа на сервер
export function sendOrder(info) {
    return async (dispatch, getState) => {
        const state = getState()
        const orderReducer = state.orderReducer

        // 6 статусов
        // 0 - заказ на обработке, 1 - курьер принял заказ, 2 - курьер осуществляет доставку
        // 3 - заказ выполнен, 4 - заказ отменён пользователем, -1 - подозрение на троллинг
        const fullOrderInfo = {
            startTime: `${new Date()}`,
            endTime: '',
            orderValue: '',
            description: 'Курьер ещё не принял ваш заказ.',
            status: 0,
            clientName: info.name,
            clientNumberPhone: info.numberPhone,
            clientAddress: info.address,
            coordinate: info.coordinate,
            deliveryValue: info.deliveryValue,
            order: orderReducer.order,
            name: orderReducer.name
        }

        const orders = dataBase.collection('orders')
        const docRef = await orders.add(fullOrderInfo)
        const orderId = docRef.id
        await orders.doc(orderId).update({
            id: orderId
        })

        await dataBase.collection('user-orders').add({
            userId: state.authReducer.id,
            orderId: orderId,
            courierId: '',
            status: 0
        })
        dispatch(dispatchAction(DELETE_ORDER_INFO, null))
        removeOrder()
    }
}

//Отмена заказа пользователем
export function cancelOrder(id) {
    return async (dispatch, getState) => {
        try {
            const userOrders = dataBase.collection('user-orders')
            const answer = await userOrders.where('orderId', '==', id).get()
            answer.forEach((el) => {
                const courierId = el.data().courierId
                dataBase.collection('couriers').doc(courierId).update({courierStatus: 0})
                userOrders.doc(el.id).update({
                    status: 4
                })
            })

            await dataBase.collection('orders').doc(id).update({
                description: 'Вы отменили заказ.',
                endTime: `${new Date()}`,
                status: 4
            })

            const arr = getState().userReducer.listOfCurrentOrders

            const index = getElementById(arr, id)
            if (index === -1) {
                return null
            }
            arr.splice(index, 1)
            dispatch(dispatchAction(AL_CHANGE, [...arr]))
            dispatch(fetchOrderList('active', 'userId', null, [0, 1, 2]))
        } catch (e) {
            console.log(e)
        }
    }
}

//Функция локально добавляющая продукт в заказ
export function addProductToOrder(item) {
    return (dispatch, getState) => {
        dispatch(dispatchAction(ADD_PRODUCT, item))
        localStorage.setItem('order', JSON.stringify(getState().orderReducer.order))
    }
}

//Функция локально редактирующая продукт в заказе
export function editOrderItem(item) {
    return (dispatch, getState) => {
        const arr = getState().orderReducer.order
        const index = getElementById(arr, item.id)
        arr[index] = item
        dispatch(dispatchAction(EDIT_ORDER, arr))
        localStorage.setItem('order', JSON.stringify(getState().orderReducer.order))
    }
}

//Функция локально удаляющая продукт из заказа
export function removeProductFromOrder(id) {
    return (dispatch, getState) => {
        const state = getState().orderReducer
        const arr = state.order
        const index = getElementById(arr, id)
        if (index === -1) {
            return null
        }
        arr.splice(index, 1)
        dispatch(dispatchAction(REMOVE_PRODUCT, [...arr]))
        localStorage.setItem('order', JSON.stringify(getState().orderReducer.order))
    }
}

//Функция локально удаляющая заказ
export function deleteOrder() {
    return (dispatch, getState) => {
        dispatch(dispatchAction(DELETE_ORDER_INFO, null))
        removeOrder()
    }
}

//Функция локально изменяющая имя
export function changeName(name) {
    return (dispatch, getState) => {
        dispatch(dispatchAction(CHANGE_NAME, name))
        localStorage.setItem('name', JSON.stringify(getState().orderReducer.name))
    }
}

//Далее идут фу-ии по работе с уже отправленным заказом

export function reOrder(orderInfo) {
    return async (dispatch, getState) => {
        const userId = getState().authReducer.id

        const order = orderInfo.order

        for (let item of order) {
            item.purchased = false
        }

        const fullOrderInfo = {
            startTime: `${new Date()}`,
            endTime: '',
            orderValue: '',
            deliveryValue: '',
            description: 'Курьер ещё не принял заказ',
            name: orderInfo.name,
            order: order,
            coordinate: orderInfo.coordinate,
            status: 0,
            clientAddress: orderInfo.clientAddress,
            clientName: orderInfo.clientName,
            clientNumberPhone: orderInfo.clientNumberPhone
        }

        const orders = dataBase.collection('orders')
        const docRef = await orders.add(fullOrderInfo)
        const orderId = docRef.id
        await orders.doc(orderId).update({
            id: orderId
        })

        dataBase.collection('user-orders').add({
            userId: userId,
            orderId: orderId,
            courierId: '',
            status: 0
        })
    }
}

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
            if (itemIndex === -1) {
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
            orderInfo.deliveryValue = userInfo.deliveryValue

            dataBase.collection('orders').doc(orderInfo.id).update(orderInfo)
        } catch (e) {
            console.log(e)
        }
    }
}