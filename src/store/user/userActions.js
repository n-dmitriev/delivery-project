import {dataBase, authWithFirebase} from '../../firebase/firebase'
import {
    FETCH_USER_INFO_ERROR,
    FETCH_USER_START,
    FETCH_USER_INFO_SUCCESS,
    SET_USER_INFO_ERROR,
    SET_USER_INFO_SUCCESS,
    SET_USER_PASSWORD_ERROR,
    SET_USER_PASSWORD_SUCCESS,
    SET_USER_AL_SUCCESS,
    SET_USER_FL_SUCCESS, ADD_USER_FL_SUCCESS, ADD_USER_AL_SUCCESS, AL_END, FL_END
} from './actionTypes'
import {dispatchAction} from '../universalFunctions'
import {ADD_SAMPLE, ADMIN_START, SAMPLE_END, SET_SAMPLE} from '../admin/actionTypes'

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
        } catch (e) {
            dispatch(dispatchAction(FETCH_USER_INFO_ERROR, e))
        }
    }
}

//Функция измененяющая пользваотельские данные
export function setUserInfo(info) {
    return async (dispatch, getState) => {
        try {
            await dataBase.collection('users').doc(getState().authReducer.id).update({
                clientName: info.clientName,
                clientNumberPhone: info.clientNumberPhone,
                clientAddress: info.clientAddress,
                coordinate: info.coordinate
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
//listType - состояния active/finish/sample отвечает за массив доставленных/активных/любых заказов
//typeId - состояния courierId/userId/orderId отвечает за тип id, в случае all - выбирает всё
//soughtId - искомый id
//statusList - список желаемых статусов, принимает значения от -1 до 4
export function fetchOrderList(listType = '', typeId = '', soughtId = '', statusList = [], skip = 0) {
    return async (dispatch, getState) => {
        let actionType, endOfList
        if (listType === 'active') {
            actionType = skip === 0 ? SET_USER_AL_SUCCESS : ADD_USER_AL_SUCCESS
            endOfList = AL_END
        } else if (listType === 'finish') {
            actionType = skip === 0 ? SET_USER_FL_SUCCESS : ADD_USER_FL_SUCCESS
            endOfList = FL_END
        } else if (listType === 'sample') {
            actionType = skip === 0 ? SET_SAMPLE : ADD_SAMPLE
            endOfList = SAMPLE_END
        }
        if (statusList.length > 0) {
            const limit = 5
            if (listType === 'sample')
                dispatch(dispatchAction(ADMIN_START, null))
            else
                dispatch(dispatchAction(FETCH_USER_START, null))
            let answer

            if (typeId === 'all')
                answer = await dataBase.collection('user-orders')
                    .where('status', 'in', statusList).orderBy('orderId')
                    .startAfter(skip).limit(limit).get()
            else {
                if (soughtId === null)
                    soughtId = getState().authReducer.id

                const userOrders = dataBase.collection('user-orders')
                answer = await userOrders
                    .where(typeId, '==', soughtId).where('status', 'in', statusList)
                    .orderBy('orderId').startAfter(skip).limit(limit).get()
            }

            const listOrdersInfo = [], orderList = []

            answer.forEach((item) => {
                listOrdersInfo.push(item.data())
            })

            const orderRef = dataBase.collection('orders')

            for (let item of listOrdersInfo) {
                const order = await orderRef.doc(item.orderId).get()
                const orderData = order.data()
                orderList.push(orderData)
            }

            if (listOrdersInfo.length < limit)
                dispatch(dispatchAction(endOfList, null))
            dispatch(dispatchAction(actionType, orderList))
        } else
            dispatch(dispatchAction(actionType, []))
    }
}