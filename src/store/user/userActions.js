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
    SET_USER_FL_SUCCESS, ADD_USER_FL_SUCCESS, ADD_USER_AL_SUCCESS
} from './actionTypes'
import {dispatchAction} from '../universalFunctions'
import {FETCH_O_STOP} from '../courier/actionTypes'
import {SET_SAMPLE} from '../admin/actionTypes'
import {sortArrayByDistance} from '../courier/courierAction'

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
                dispatch(fetchOrderList('active', 'courierId', null, [1, 2]))
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
    console.log(skip)
    return async (dispatch, getState) => {
        let actionType
        if (listType === 'active') {
            actionType = skip === 0 ? SET_USER_AL_SUCCESS : ADD_USER_AL_SUCCESS
        } else if (listType === 'finish') {
            actionType = skip === 0 ? SET_USER_FL_SUCCESS : ADD_USER_FL_SUCCESS
        } else if (listType === 'sample') {
            actionType = SET_SAMPLE
        }
        if (statusList.length > 0) {
            dispatch(dispatchAction(FETCH_USER_START, null))
            let answer

            if (typeId === 'all')
                answer = await dataBase.collection('user-orders')
                    .where('status', 'in', statusList).startAt(0).limit(5).get()
            else {
                if (soughtId === null)
                    soughtId = getState().authReducer.id

                const userOrders = dataBase.collection('user-orders')

                answer = await userOrders
                     .where(typeId, '==', soughtId).where('status', 'in', statusList)
                    .orderBy('orderId').limit(2).startAfter(skip).get()
            }

            const listOrdersInfo = [], orderList = []

            answer.forEach((item) => {
                listOrdersInfo.push(item.data())
            })

            console.log('------------------')
            for (let el of listOrdersInfo) {
                console.log(el?.orderId)
            }


            const orderRef = dataBase.collection('orders')

            for (let item of listOrdersInfo) {
                const order = await orderRef.doc(item.orderId).get()
                const orderData = order.data()
                orderList.push(orderData)
            }

            dispatch(dispatchAction(actionType, orderList))
        } else
            dispatch(dispatchAction(actionType, []))
    }
}

//Подписка
export function subscribe(listening, listType, typeId, soughtId, statusList, coordinates) {
    return (dispatch) => {
        const un = dataBase.collection('orders')
            .onSnapshot(async () => {
                await dispatch(fetchOrderList(listType, typeId, soughtId, statusList))
                if (coordinates !== null)
                    dispatch(sortArrayByDistance(coordinates))
            })
        if (!listening)
            un()
    }
}