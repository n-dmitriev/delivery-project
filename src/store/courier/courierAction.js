import {dataBase} from '../../firebase/firebase'
import {dispatchAction, getElementById} from '../universalFunctions'
import {fetchUserInfo} from '../user/userActions'
import {
    SORT_ORDER_LIST,
    ADD_UNSUBSCRIBE,
    REMOVE_UNSUBSCRIBE_LIST,
    REMOVE_LAST_S, START_LOADING, NOT_EMPTY, END_LOADING
} from './actionTypes'
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
                    endTime = `${new Date()}`
                    break
                }
                case 4: {
                    description = 'Вы отменили заказ.'
                    endTime = `${new Date()}`
                    break
                }
                case 5: {
                    description = 'Ваш заказ некорректно заполнен!'
                    courierId = ''
                    endTime = `${new Date()}`
                    break
                }
                case -1: {
                    courierId = ''
                    description = 'Курьер посчитал ваш заказ некорректно заполненым!.'
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

export async function setOrderValue(id, orderValue) {
    try {
        await dataBase.collection('orders').doc(id)
            .update({orderValue})
    } catch (e) {
        console.log(e)
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

        // arr.sort((a, b) => {
        //     if (a.distance > b.distance) return 1
        //     if (a.distance < b.distance) return -1
        //     else return 0
        // })

        dispatch(dispatchAction(SORT_ORDER_LIST, arr))
    }
}

//Подписка на конкретный заказ
export function subscribeOrderInfo(courierId, status) {
    return async (dispatch) => {
        const answer = await dataBase.collection('user-orders')
            .where('status', '==', status)
            .where('courierId', '==', courierId)
            .get()

        let id

        answer.forEach((doc) => {
            id = doc.data().orderId
        })


        if (id) {
            const unsubscribe = dataBase.collection('orders').doc(id)
                .onSnapshot((change) => {
                    const data = change.data()
                    if (data.status === 0) {
                        dispatch(unsubscribeAllOrders())
                        dispatch(fetchUserInfo())
                    } else {
                        dispatch(dispatchAction(SET_USER_AL_SUCCESS, [data]))
                    }
                })
            dispatch(dispatchAction(ADD_UNSUBSCRIBE, unsubscribe))
        }
    }
}

// Подписка на списокк заказов
export function subscribe(coordinates = null, skip = 0) {
    return async (dispatch, getState) => {
        dispatch(dispatchAction(FETCH_USER_START, null))
        const unsubscribe = await dataBase.collection('orders')
            .where('status', '==', 0).orderBy('id')
            .startAfter(skip).limit(1)
            .onSnapshot(async (querySnapshot) => {
                dispatch(dispatchAction(START_LOADING, null))
                let order
                await querySnapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        order = change.doc.data()

                        if (order.id === undefined)
                            order.id = change.doc.id
                        dispatch(dispatchAction(ADD_USER_AL_SUCCESS, order))
                    }
                    if (change.type === 'modified') {
                        const data = change.doc.data()
                        const ordersList = getState().userReducer.listOfCurrentOrders
                        const index = getElementById(ordersList, data.id)

                        if (index === -1) {
                            return null
                        }
                        if (data.status === 0) {
                            ordersList[index] = data
                            dispatch(dispatchAction(AL_CHANGE, ordersList))
                        } else {
                            ordersList.splice(index, 1)
                            dispatch(dispatchAction(AL_CHANGE, [...ordersList]))
                        }
                    }
                    if (change.type === 'removed') {
                        const data = change.doc.data()
                        const ordersList = getState().userReducer.listOfCurrentOrders
                        const index = getElementById(ordersList, data.id)

                        if (index === -1) {
                            return null
                        }
                        ordersList.splice(index, 1)
                        dispatch(dispatchAction(AL_CHANGE, [...ordersList]))
                    }

                    if (coordinates !== null)
                        dispatch(sortArrayByDistance(coordinates))
                })
                if (order) {
                    dispatch(dispatchAction(NOT_EMPTY, null))
                } else
                    dispatch(dispatchAction(END_LOADING, null))
            })
        dispatch(dispatchAction(ADD_UNSUBSCRIBE, unsubscribe))
    }
}

export function unsubscribeAllOrders() {
    return (dispatch, getState) => {
        const unsubscribeList = getState().courierReducer.unsubscribeList

        unsubscribeList.forEach(unsubscribe => {
            unsubscribe()
        })

        dispatch(dispatchAction(REMOVE_UNSUBSCRIBE_LIST, null))
    }
}

export function removeLastSub() {
    return (dispatch, getState) => {
        const unsubscribeList = getState().courierReducer.unsubscribeList
        const lastSub = unsubscribeList.pop()
        lastSub()
        dispatch(dispatchAction(REMOVE_LAST_S, unsubscribeList))
    }
}

export function removeOrder(id) {
    return (dispatch, getState) => {
        const ordersList = getState().userReducer.listOfCurrentOrders

        const index = getElementById(ordersList, id)
        if (index === -1) {
            return null
        }
        ordersList.splice(index, 1)
        dispatch(dispatchAction(AL_CHANGE, [...ordersList]))
    }
}