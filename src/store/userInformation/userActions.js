import {dataBase, authWithFirebase} from '../../firebase/firebase'
import {
    FETCH_USER_INFO_ERROR,
    FETCH_USER_START,
    FETCH_USER_INFO_SUCCESS,
    SET_USER_INFO_ERROR,
    SET_USER_INFO_SUCCESS,
    SET_USER_PASSWORD_ERROR,
    SET_USER_PASSWORD_SUCCESS,
    FETCH_USER_AL_SUCCESS,
    FETCH_USER_FL_SUCCESS,
} from './actionTypes'
import {dispatchAction} from '../universalFunctions'
import {FETCH_O_STOP} from '../courier/actionTypes'

//Фунцкция запрашивающая пользовательские данные
export function fetchUserInfo() {
    return async (dispatch, getState) => {
        try {
            dispatch(dispatchAction(FETCH_USER_START, null))
            const path = JSON.parse(localStorage.getItem('path'))
            const collection = path === '/user-account/' ? 'users' : 'couriers'

            const docRef = dataBase.collection(collection).doc(getState().authReducer.id)
            const answer = await docRef.get()
            const data = answer.data()
            dispatch(dispatchAction(FETCH_USER_INFO_SUCCESS, data))
            if (collection === 'couriers') {
                dispatch(fetchOrderList('active', 'courierId', null, [1]))
                dispatch(dispatchAction(FETCH_O_STOP, null))
            }
        } catch (e) {
            dispatch(dispatchAction(FETCH_USER_INFO_ERROR, e))
        }
    }
}

//Функция измененяющая пользваотельские данные
export function setUserInfo(info) {
    return async (dispatch, getState) => {
        try {
            dataBase.collection('users').doc(getState().authReducer.id).update({
                name: info.name,
                numberPhone: info.numberPhone,
                address: info.address,
            })
            dispatch(dispatchAction(SET_USER_INFO_SUCCESS, null))
            dispatch(fetchUserInfo())
        } catch (e) {
            dispatch(dispatchAction(SET_USER_INFO_ERROR, e))
        }
    }
}

//Функция меняющая пароль
export function passwordChange(oldPassword, newPassword) {
    return async (dispatch, getState) => {
        try {
            await authWithFirebase.signInWithEmailAndPassword(getState().authReducer.email, oldPassword)
            const user = authWithFirebase.currentUser
            await user.updatePassword(newPassword)
            dispatch(dispatchAction(SET_USER_PASSWORD_SUCCESS))
        } catch
            (e) {
            dispatch(dispatchAction(SET_USER_PASSWORD_ERROR, e))
        }
    }
}

//Функция запрашвающая список заказов
//listType - состояния active/finish отвечает за массив доставленных или активных заказов
//typeId - состояния courierId/userId/orderId отвечает за тип id
//soughtId - искомый id
//statusList - список желаемых статусов
export function fetchOrderList(listType, typeId, soughtId, statusList) {
    return async (dispatch, getState) => {
        dispatch(dispatchAction(FETCH_USER_START, null))
        if (soughtId === null)
            soughtId = getState().authReducer.id
        const answer = await dataBase.collection('user-orders')
            .where(typeId, '==', soughtId).where('status', 'in', statusList).get()

        const listOrdersInfo = [], orderList = []

        answer.forEach((item) => {
            listOrdersInfo.push(item.data())
        })

        const orderRef = dataBase.collection('orders')
        const userRef = dataBase.collection('users')

        for (let item of listOrdersInfo) {
            const order = await orderRef.doc(item.orderId).get()
            const user = await userRef.doc(item.userId).get()
            const orderData = order.data()

            if (typeId === 'courierId')
                    orderList.push({
                        ...user.data(), orderItem: orderData
                    })
            else if(typeId = 'userId')
                orderList.push(orderData)
        }

        let type
        if (listType === 'active')
            type = FETCH_USER_AL_SUCCESS
        else
            type = FETCH_USER_FL_SUCCESS
        dispatch(dispatchAction(type, orderList))
    }
}

//Подписка
export function subscribe(listening, listType, typeId, soughtId, statusList) {
    return (dispatch) => {
        const un = dataBase.collection('orders')
            .onSnapshot(() => {
                dispatch(fetchOrderList(listType, typeId, soughtId, statusList))
            })
        if(!listening)
            un()
    }
}