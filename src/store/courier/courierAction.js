import {dataBase} from '../../firebase/firebase'
import {dispatchAction, getElementById} from '../universalFunctions'
import {fetchOrderList, fetchUserInfo} from '../userInformation/userActions'

//Подписка на конкретный заказ
export function subscribeOrderInfo(listening, id) {
    return (dispatch) => {
        const unsubscribe = dataBase.collection('orders').doc(id)
            .onSnapshot(() => {
                dispatch(fetchOrderList('active', 'courierId', null, [1]))
            })
        if (!listening)
            unsubscribe()
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
                endTime = '',
                courierStatus = 0

            switch (status) {
                case 1: {
                    description = `Курьер ${state.userInfReducer.info.name} принял ваш заказ.Контактный номер курьера: ${state.userInfReducer.info.numberPhone}`
                    courierStatus = 1
                    break
                }
                case 2: {
                    description = `Курьер ${state.userInfReducer.info.name} доставляет ваш заказ. Контактный номер курьера: ${state.userInfReducer.info.numberPhone}`
                    courierStatus = 2
                    break
                }
                case 3: {
                    description = `Заказ завершён!`
                    endTime = `${new Date()}`
                    break
                }
                case 4: {
                    courierId = ''
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

            dataBase.collection('couriers').doc(state.authReducer.id).update({
                courierStatus: courierStatus
            })

            const userOrders = dataBase.collection('user-orders')
            const answer = await userOrders.where('orderId', '==', data.orderItem.id).get()
            answer.forEach((doc) => {
                userOrders.doc(doc.id).update({
                    courierId, status: finalStatus,
                })
            })

            dataBase.collection('orders').doc(data.orderItem.id).update({
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
        const arr = getState().userInfReducer.listOfCurrentOrders[0].orderItem.order
        const index = getElementById(arr, id)
        if (index !== -1) {
            arr[index].purchased = flag
        }

    }
}