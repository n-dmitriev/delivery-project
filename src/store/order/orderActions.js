import {
    UPDATE_ORDER_INFO
} from './actionTypes'
import {dataBase} from '../../firebase/firebase'
import {dispatchAction, getElementById} from '../universalFunctions'


const updateLocalStorage = (orderInfo) => {
    if (orderInfo !== null)
        localStorage.setItem('orderInfo', JSON.stringify(orderInfo))
    else
        localStorage.removeItem('orderInfo')
}

const getOrderInfo = (getState) => {
    return JSON.parse(JSON.stringify(getState().orderReducer.orderInfo))
}

//Отправка заказа на сервер
export function sendOrder(info) {
    return async (dispatch, getState) => {
        const state = getState()

        // 6 статусов
        // 0 - заказ на обработке, 1 - курьер принял заказ, 2 - курьер осуществляет доставку
        // 3 - заказ выполнен, 4 - заказ отменён пользователем, -1 - подозрение на троллинг
        Object.assign(info, {
            startTime: `${new Date()}`,
            endTime: '',
            orderValue: '',
            description: 'Курьер ещё не принял ваш заказ.',
            status: 0
        })

        const orders = dataBase.collection('orders')
        const docRef = await orders.add(info)
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
        dispatch(deleteOrder())
    }
}

//Отмена заказа пользователем
export function cancelOrder(id) {
    return async () => {
        try {
            const userOrders = dataBase.collection('user-orders')
            const answer = await userOrders.where('orderId', '==', id).get()
            answer.forEach((el) => {
                const courierId = el.data().courierId
                if (courierId.replace(/\s+/g, '') !== '') {
                    dataBase.collection('couriers').doc(courierId).update({courierStatus: 0})
                }
                userOrders.doc(el.id).update({
                    status: 4
                })
            })

            await dataBase.collection('orders').doc(id).update({
                description: 'Вы отменили заказ.',
                endTime: `${new Date()}`,
                status: 4
            })
        } catch (e) {
            console.log(e)
        }
    }
}

// Повторный заказ
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
            description: 'Курьер ещё не принял заказ',
            name: orderInfo.name,
            order: order,
            coordinate: orderInfo.coordinate,
            status: 0,
            clientAddress: orderInfo.clientAddress,
            clientName: orderInfo.clientName,
            clientNumberPhone: orderInfo.clientNumberPhone,
            deliveryValue: orderInfo.deliveryValue
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

//Функция локально добавляющая продукт в заказ
export function addProductToOrder(item) {
    return (dispatch, getState) => {
        const orderInfo = getOrderInfo(getState)
        if (orderInfo.order)
            orderInfo.order = [...orderInfo.order, item]
        else
            orderInfo.order = [item]
        dispatch(dispatchAction(UPDATE_ORDER_INFO, orderInfo))
        updateLocalStorage(orderInfo)
    }
}

//Функция локально редактирующая продукт в заказе
export function editOrderItem(item) {
    return (dispatch, getState) => {
        const orderInfo = getOrderInfo(getState)
        const arr = orderInfo.order
        const index = getElementById(arr, item.id)
        arr[index] = item
        dispatch(dispatchAction(UPDATE_ORDER_INFO, orderInfo))
        updateLocalStorage(orderInfo)
    }
}

//Функция локально удаляющая продукт из заказа
export function removeProductFromOrder(id) {
    return (dispatch, getState) => {
        const orderInfo = getOrderInfo(getState)
        const arr = orderInfo.order
        const index = getElementById(arr, id)
        if (index === -1) {
            return null
        }
        arr.splice(index, 1)
        dispatch(dispatchAction(UPDATE_ORDER_INFO, orderInfo))
        updateLocalStorage(orderInfo)
    }
}

//Функция локально удаляющая заказ
export function deleteOrder() {
    return (dispatch) => {
        dispatch(dispatchAction(UPDATE_ORDER_INFO, {}))
        updateLocalStorage(null)
    }
}

export function mergedData(data) {
    return (dispatch, getState) => {
        const orderInfo = getOrderInfo(getState)
        const mergedObject = Object.assign(orderInfo, data)
        dispatch(dispatchAction(UPDATE_ORDER_INFO, mergedObject))
        updateLocalStorage(mergedObject)
    }
}