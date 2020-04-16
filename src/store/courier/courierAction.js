import {dataBase} from '../../firebase/firebase'
import {dispatchAction, getElementById} from '../universalFunctions'
import {
    FETCH_DELIVERED_ORDER, FETCH_O_START, FETCH_O_STOP,
} from './actionTypes'
import {fetchUserInfo} from '../userInformation/userActions'

//Подписка на конкретный заказ
export function subscribeOrderInfo(listening, id) {
    return (dispatch) => {
        const unsubscribe = dataBase.collection('orders').doc(id)
            .onSnapshot(() => {
                dispatch(fetchUserInfo())
            })
        if (!listening)
            unsubscribe()
    }
}

export function fetchDeliveredOrder() {
    return async (dispatch, getState) => {
        dispatch(dispatchAction(FETCH_O_START, null))
        try {
            const orderInfo = getState().userInfReducer.info.deliveredOrder

            if (Object.keys(orderInfo).length > 0) {
                const docRef = dataBase.collection('users').doc(orderInfo.userId)
                const answer = await docRef.get()
                const data = answer.data()

                const info = {
                    uid: orderInfo.userId,
                    address: data.address,
                    name: data.name,
                    numberPhone: data.numberPhone,
                }


                for (let order of data.listOfCurrentOrders) {
                    if (order.id === orderInfo.orderId) {
                        info.orderInfo = order
                        dispatch(dispatchAction(FETCH_DELIVERED_ORDER, info))
                    }
                }
            } else {
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
    return async (dispatch, getState) => {
        try {
            const state = getState()
            let courierId = state.authReducer.id,
                finalStatus = status,
                description = '',
                endTime = ''

            switch (status) {
                case 1: {
                    description = `Курьер ${state.userInfReducer.info.name} принял ваш заказ.Контактный номер курьера: ${state.userInfReducer.info.numberPhone}`
                    break
                }
                case 2: {
                    description = `Курьер ${state.userInfReducer.info.name} доставляет ваш заказ. Контактный номер курьера: ${state.userInfReducer.info.numberPhone}`
                    break
                }
                case 3: {
                    description = `Заказ завершён!`
                    endTime = `${new Date()}`
                    break
                }
                case 4: {
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

            const userOrders = dataBase.collection('user-orders')
            const answer = await userOrders.where('orderId', '==', data.orderInfo.orderItem.id).get()
            answer.forEach((doc) => {
                userOrders.doc(doc.id).update({
                    courierId, status: finalStatus,
                })
            })

            dataBase.collection('orders').doc(data.orderInfo.orderItem.id).update({
                endTime: endTime,
                description: description,
            })
            dispatch(fetchUserInfo())
        } catch (e) {
            console.log(e)
        }
    }
}

export function interactWithPurchased(id, flag) {
    return (dispatch, getState) => {
        const arr = getState().courier.deliveredOrder.orderInfo.order
        const index = getElementById(arr, id)
        if (index !== -1) {
            arr[index].purchased = flag
        }
    }
}