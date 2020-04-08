import {dataBase} from '../../firebase/firebase'
import {dispatchAction} from './universalFunctions'
import {FETCH_ACTIVE_ORDERS_ERROR, FETCH_ACTIVE_ORDERS_SUCCESS} from './actionTypes'
import * as firebase from 'firebase'

export function getActiveOrders() {
    return (dispatch) => {
        try {
            dataBase.collection('users').get().then((answer) => {
                const docArray = []
                answer.forEach((doc) => {
                    const user = doc.data()
                    const orders = user.listOfCurrentOrders.filter((order) => order.status === 0)

                    if (orders.length > 0) {
                        docArray.push({
                            id: doc.id,
                            address: user.address,
                            name: user.name,
                            numberPhone: user.numberPhone,
                            orders: orders,
                        })
                    }
                })
                dispatch(dispatchAction(FETCH_ACTIVE_ORDERS_SUCCESS, docArray))
            })
        } catch (e) {
            dispatch(dispatchAction(FETCH_ACTIVE_ORDERS_ERROR, null))
        }
    }
}



export function takeOrder(info) {
    return (dispatch, getState) => {
        try {
            const state = getState()
            const id = state.authReducer.id

            const order = {
                userId: info.uid,
                orderId: info.selectedOrder.id
            }

            dataBase.collection('couriers').doc(id).update({executableOrders:  firebase.firestore.FieldValue.arrayUnion(order)})

            const orderInfo = {
                id: info.selectedOrder.id,
                name: info.selectedOrder.name,
                order: info.selectedOrder.order,
                startTime: info.selectedOrder.startTime,
                endTime: '',
                status: 1,
                courierId: id,
                description: `Курьер ${state.userInfReducer.info.name} принял ваш заказ. Контактный номер курьера: ${state.userInfReducer.info.numberPhone}`,
            }

            dataBase.collection('users').doc(order.userId).update({
                listOfCurrentOrders: firebase.firestore.FieldValue.arrayRemove(info.selectedOrder),
            })

            dataBase.collection('users').doc(order.userId).update({
                listOfCurrentOrders: firebase.firestore.FieldValue.arrayUnion(orderInfo),
            })
        }
        catch (e) {
            console.log(e)
        }
    }
}

export function itsTroll(info) {
    return (dispatch) => {
        try {
            const orderInfo = {
                id: info.selectedOrder.id,
                name: info.selectedOrder.name,
                order: info.selectedOrder.order,
                startTime: info.selectedOrder.startTime,
                courierId: info.selectedOrder.courierId,
                endTime: '',
                status: 4,
                description: 'Ваш заказ проверяется на корректность',
            }

            dataBase.collection('users').doc(info.uid).update({
                listOfCurrentOrders: firebase.firestore.FieldValue.arrayRemove(info.selectedOrder),
            })

            dataBase.collection('users').doc(info.uid).update({
                listOfCurrentOrders: firebase.firestore.FieldValue.arrayUnion(orderInfo),
            })

        }
        catch (e) {
            console.log(e)
        }
    }
}