import {dataBase} from '../../firebase/firebase'
import {getDate, getElementById} from '../universalFunctions'
import {fetchOrderList, fetchUserInfo} from '../userInformation/userActions'

// 6 статусов
// 0 - заказ отменён курьером, 1 - курьер принял заказ, 2 - курьер осуществляет доставку
// 3 - заказ выполнен, 4 - заказ отменён пользователем, -1 - подозрение на троллинг
// 5 - заказ омменён, так как он не корректно заполнен
export function changeOrderData(status, data) {
    return async (dispatch, getState) => {
        try {
            const state = getState()
            const order = data.orderItem.order
            let courierId = state.authReducer.id,
                description = '',
                endTime = '',
                courierStatus = 0

            switch (status) {
                case 0: {
                    courierId = ''
                    description = 'Курьер ещё не принял заказ'
                    for (let item of order) {
                        item.purchased = false
                    }
                    break
                }
                case 1: {
                    description = `Курьер ${state.userInfReducer.info.name} принял ваш заказ. Контактный номер курьера: ${state.userInfReducer.info.numberPhone}`
                    courierStatus = 1
                    break
                }
                case 2: {
                    description = `Курьер ${state.userInfReducer.info.name} доставляет ваш заказ. Контактный номер курьера: ${state.userInfReducer.info.numberPhone}`
                    courierStatus = 2
                    break
                }
                case 3: {
                    description = `Заказ завершён.`
                    endTime = getDate()
                    break
                }
                case 4: {
                    description = 'Вы отменили заказ.'
                    endTime = getDate()
                    break
                }
                case 5: {
                    description = 'Ваш заказ некорректно заполнен!'
                    courierId = ''
                    endTime = getDate()
                    break
                }
                case -1: {
                    courierId = ''
                    description = 'Ваш заказ проверяется на корректность.'
                    break
                }
            }

            dataBase.collection('couriers').doc(state.authReducer.id).update({
                courierStatus: courierStatus,
            })

            const userOrders = dataBase.collection('user-orders')
            const answer = await userOrders.where('orderId', '==', data.orderItem.id).get()
            answer.forEach((doc) => {
                userOrders.doc(doc.id).update({
                    courierId, status: status,
                })
            })

            const orderInfo = {
                order: order,
                endTime: endTime,
                description: description,
            }

            if (status === 2)
                orderInfo.order = data.orderItem.order

            dataBase.collection('orders').doc(data.orderItem.id).update(orderInfo)

            dispatch(fetchUserInfo())
        } catch (e) {
            console.log(e)
        }
    }
}

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

export function calculateThePrice(id, price, position) {
    return async (dispatch) => {
        try {
            dataBase.collection('orders').doc(id).update({orderValue: price, deliveryValue: 100})
            dispatch(fetchUserInfo())
        } catch (e) {
            console.log(e)
        }
    }
}

// Взаимодейтсвие с чекбоксами
export function interactWithPurchased(id, flag) {
    return (dispatch, getState) => {
        const state = getState(),
            arr = state.userInfReducer.listOfCurrentOrders[0].orderItem.order,
            index = getElementById(arr, id)
        if (index !== -1) {
            arr[index].purchased = flag
        }
    }
}