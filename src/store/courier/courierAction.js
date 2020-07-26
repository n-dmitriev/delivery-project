import {dataBase} from '../../firebase/firebase'
import {dispatchAction, getDate, getElementById} from '../universalFunctions'
import {fetchUserInfo} from '../user/userActions'
import {SORT_ORDER_LIST} from './actionTypes'
import {ADD_USER_AL_SUCCESS, AL_CHANGE, FETCH_USER_START, SET_USER_AL_SUCCESS} from '../user/actionTypes'

// 6 статусов
// 0 - заказ отменён курьером, 1 - курьер принял заказ, 2 - курьер осуществляет доставку
// 3 - заказ выполнен, 4 - заказ отменён пользователем, -1 - подозрение на троллинг
// 5 - заказ омменён, так как он не корректно заполнен
export function changeOrderData(status, data) {
    return async (dispatch, getState) => {
        try {
            const state = getState()
            const order = data.order
            let courierId = state.authReducer.id,
                description = '',
                endTime = '',
                courierStatus = 0,
                orderInfo = {}

            switch (status) {
                case 0: {
                    courierId = ''
                    description = 'Курьер ещё не принял заказ'
                    for (let item of order) {
                        item.purchased = false
                    }
                    orderInfo.order = order
                    break
                }
                case 1: {
                    description = `Курьер ${state.userReducer.info.name} принял ваш заказ.\n Контактный номер курьера: ${state.userReducer.info.numberPhone}`
                    courierStatus = 1
                    break
                }
                case 2: {
                    description = `Курьер ${state.userReducer.info.name} доставляет ваш заказ.\n Контактный номер курьера: ${state.userReducer.info.numberPhone}`
                    courierStatus = 2
                    orderInfo.order = order
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
                default: {
                    break
                }
            }

            dispatch(updateCourierStatus(courierStatus))

            const userOrders = dataBase.collection('user-orders')
            const answer = await userOrders.where('orderId', '==', data.id).get()
            answer.forEach((doc) => {
                userOrders.doc(doc.id).update({
                    courierId, status
                })
            })

            orderInfo.endTime = endTime
            orderInfo.description = description
            orderInfo.status = status

            await dataBase.collection('orders').doc(data.id).update(orderInfo)

            dispatch(fetchUserInfo())
        } catch (e) {
            console.log(e)
        }
    }
}

export function updateCourierStatus(status) {
    return async (dispatch, getState) => {
        const id = getState().authReducer.id
        await dataBase.collection('couriers').doc(id).update({courierStatus: status})
    }
}

export function calculateThePrice(id, price, distance) {
    return async (dispatch) => {
        try {
            const priceFor1Km = 20
            const minPrice = 150

            let deliveryValue = Math.round(distance * priceFor1Km)

            if (deliveryValue < minPrice)
                deliveryValue = minPrice

            await dataBase.collection('orders').doc(id)
                .update({orderValue: price, deliveryValue: deliveryValue})
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
            arr = state.userReducer.listOfCurrentOrders[0].order,
            index = getElementById(arr, id)
        if (index !== -1) {
            arr[index].purchased = flag
        }
    }
}

export function sortArrayByDistance(coordinate) {
    return async (dispatch, getState) => {
        const arr = []
        const ordersList = getState().userReducer.listOfCurrentOrders

        for (let order of ordersList) {
            if (order.distance === undefined) {
                const route = await window.ymaps.route([coordinate, order.coordinate])
                order.distance = Math.ceil(route.getLength()) / 1000
            }
            arr.push(order)
        }

        arr.sort((a, b) => {
            if (a.distance > b.distance) return 1
            if (a.distance < b.distance) return -1
            else return 0
        })

        dispatch(dispatchAction(SORT_ORDER_LIST, arr))
    }
}

//Подписка на конкретный заказ
export function subscribeOrderInfo(listening, id) {
    return (dispatch) => {
        const unsubscribe = dataBase.collection('orders').doc(id)
            .onSnapshot((change) => {
                const data = change.data()
                console.log(data)
                if (data.status === 0) {
                    dispatch(fetchUserInfo())
                } else {
                    dispatch(dispatchAction(SET_USER_AL_SUCCESS, [data]))
                }
                //dispatch(fetchOrderList('active', 'courierId', null, [1]))
            })
        if (!listening) {
            unsubscribe()
        }
    }
}

export function subscribe(listening, coordinates = null, skip = 0) {
    return async (dispatch, getState) => {
        const subscribeOrderList = () => {
            const idList = []

            const orderList = getState().userReducer.listOfCurrentOrders

            for (let el of orderList) {
                idList.push(el.id)
            }

            if (idList.length === 0)
                return

            const unsubscribeCurOrders = dataBase.collection('orders').where('id', 'in', idList)
                .onSnapshot((querySnapshot) => {
                    querySnapshot.docChanges().forEach((change) => {
                        if (change.type === 'modified') {
                            //console.log('modified', change.doc.data())
                            const data = change.doc.data()
                            const index = getElementById(orderList, data.id)
                            if (index === -1) {
                                return null
                            }

                            if (orderList[index].status === 0) {
                                orderList[index] = data
                                dispatch(dispatchAction(AL_CHANGE, orderList))
                                if (coordinates !== null)
                                    dispatch(sortArrayByDistance(coordinates))
                            } else {
                                orderList.splice(index, 1)
                                dispatch(dispatchAction(AL_CHANGE, [...orderList]))
                            }
                        }
                        if (change.type === 'removed') {
                            //console.log('removed', change.doc.data())
                            const data = change.doc.data()
                            const index = getElementById(orderList, data.id)
                            orderList[index] = data
                            if (index === -1) {
                                return null
                            }
                            orderList.splice(index, 1)
                            dispatch(dispatchAction(AL_CHANGE, [...orderList]))
                        }
                    })
                })
            if (!listening) {
                unsubscribeCurOrders()
            }
        }

        dispatch(dispatchAction(FETCH_USER_START, null))

        const unsubscribeAllOrders = await dataBase.collection('orders')
            .where('status', '==', 0).orderBy('id')
            .onSnapshot((querySnapshot) => {
                querySnapshot.docChanges().forEach(async (added) => {
                    if (added.type === 'added') {
                        const order = added.doc.data()
                        //console.log('add', order)

                        if (order.id === undefined)
                            order.id = added.doc.id

                        await dispatch(dispatchAction(ADD_USER_AL_SUCCESS, order))
                    }
                })
                subscribeOrderList()
                if (coordinates !== null)
                    dispatch(sortArrayByDistance(coordinates))
            })

        // if (getState().userReducer.listOfCurrentOrders.length < limit){
        //     console.log(getState().userReducer.listOfCurrentOrders)
        //     dispatch(dispatchAction(AL_END, null))
        // }
        if (!listening) {
            // console.log('net')
            unsubscribeAllOrders()
            subscribeOrderList()
        }
    }
}