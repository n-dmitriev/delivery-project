import {dataBase} from '../../firebase/firebase'
import {dispatchAction} from './universalFunctions'
import * as firebase from 'firebase/app'
import {
    FETCH_ACTIVE_ORDERS_ERROR,
    FETCH_ACTIVE_ORDERS_SUCCESS, FETCH_DELIVERED_ORDER, FETCH_O_START,
} from './actionTypes'
import {fetchUserInfo} from './userInformation'


export function fetchActiveOrders() {
    return (dispatch) => {
        try {
            dispatch(dispatchAction(FETCH_O_START,null))
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

export function subscribeUsers(listening) {
    return (dispatch) => {
        const unsubscribe = dataBase.collection("users")
            .onSnapshot(() => {
                dispatch(fetchActiveOrders())
            })
        if(!listening)
            unsubscribe()

    }
}

export function subscribeOrderInfo(listening) {
    return (dispatch, getState) => {
        const id = getState().userInfReducer.info.deliveredOrder.userId
        const unsubscribe = dataBase.collection("couriers").doc(id)
            .onSnapshot(() => {
                dispatch(fetchUserInfo())
            })
        if(!listening)
            unsubscribe()
    }
}

export function fetchDeliveredOrder() {
    return async (dispatch, getState) => {
        dispatch(dispatchAction(FETCH_O_START,null))
        try {
            const orderInfo = getState().userInfReducer.info.deliveredOrder

            if(Object.keys(orderInfo).length > 0){
                const docRef = dataBase.collection('users').doc(orderInfo.userId)
                const answer = await docRef.get()
                const data = answer.data()

                const info = {
                    uid: orderInfo.userId,
                    address: data.address,
                    name: data.name,
                    numberPhone: data.numberPhone,
                }


                for(let order of data.listOfCurrentOrders){
                    if(order.id === orderInfo.orderId)
                    {
                        info.orderInfo = order
                        dispatch(dispatchAction(FETCH_DELIVERED_ORDER, info))
                    }
                }
            }
            else {
                dispatch(dispatchAction(FETCH_DELIVERED_ORDER, {}))
            }

        } catch (e) {
            console.log(e)
        }
    }
}

// 6 статусов
// 0 - заказ на обработке, 1 - курьер принял заказ, 2 - курьер осуществляет доставку
// 3 - заказ выполнен, 4 - заказ отменён курьером, -1 - подозрение на троллинг
export function changeOrderData(status, data) {
    return (dispatch, getState) => {
        try {
            const state = getState()
            let courierId = state.authReducer.id,
                finalStatus = status,
                description = data.orderInfo.description,
                endTime = ''

            switch (status) {
                case 1: {
                    const order = {
                        userId: data.uid,
                        orderId: data.orderInfo.id
                    }
                    dataBase.collection('couriers').doc(courierId).update({deliveredOrder:  order})
                    description = `Курьер ${state.userInfReducer.info.name} принял ваш заказ.Контактный номер курьера: ${state.userInfReducer.info.numberPhone}`
                    break
                }
                case 2: {
                    description = `Курьер ${state.userInfReducer.info.name} доставляет ваш заказ.
                    Контактный номер курьера: ${state.userInfReducer.info.numberPhone}`
                    break
                }
                case 3: {
                    const courier = dataBase.collection('couriers').doc(courierId)
                    courier.update({completedOrders: firebase.firestore.FieldValue.arrayUnion(state.userInfReducer.info.deliveredOrder)})
                    courier.update({deliveredOrder:  {}})
                    description = `Заказ завершён!`
                    endTime = `${new Date()}`
                    break
                }
                case 4: {
                    dataBase.collection('couriers').doc(courierId).update({deliveredOrder:  {}})
                    description = 'Курьер ещё не принял заказ'
                    finalStatus = 0
                    break
                }
                case -1: {
                    courierId = ''
                    description = 'Ваш заказ проверяется на корректность'
                    break
                }
            }

            const orderInfo = {
                id: data.orderInfo.id,
                name: data.orderInfo.name,
                order: data.orderInfo.order,
                startTime: data.orderInfo.startTime,
                endTime: endTime,
                status: finalStatus,
                courierId: courierId,
                description: description,
            }


            dataBase.collection('users').doc(data.uid).update({
                listOfCurrentOrders: firebase.firestore.FieldValue.arrayRemove(data.orderInfo),
            })

            dataBase.collection('users').doc(data.uid).update({
                listOfCurrentOrders: firebase.firestore.FieldValue.arrayUnion(orderInfo),
            })
            dispatch(fetchUserInfo())
        }
        catch (e) {
            console.log(e)
        }
    }
}