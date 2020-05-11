import {authWithFirebase, dataBase} from '../../firebase/firebase'
import {dispatchAction} from '../universalFunctions'
import {
    AUTH_ADMIN_ERROR,
    AUTH_ADMIN_SUCCESS,
    AUTH_ADMIN_LOGOUT,
    FETCH_COURIERS_SUCCESS,
    FETCH_USERS_SUCCESS,
    CREATE_NEW_COURIER_S,
    CREATE_NEW_COURIER_E,
} from './actionTypes'
import {SET_USER_INFO_ERROR, SET_USER_INFO_SUCCESS} from '../user/actionTypes'

// Функция аунтификации
export function authAdmin(email, password) {
    return async dispatch => {
        try {
            await authWithFirebase.signInWithEmailAndPassword(email, password)
            authWithFirebase.onAuthStateChanged(async (user) => {
                if (user) {
                    const docRef = dataBase.collection('appData').doc(user.uid)
                    const answer = await docRef.get()
                    const data = answer.data()

                    if (data !== undefined && data.role === 'admin') {
                        const expirationDate = new Date(new Date().getTime() + 3600 * 1000)
                        localStorage.setItem('expirationDate', expirationDate)
                        localStorage.setItem('adminId', JSON.stringify(user.uid))
                        dispatch(dispatchAction(AUTH_ADMIN_SUCCESS, user.uid))
                    } else
                        dispatch(dispatchAction(AUTH_ADMIN_ERROR, null))
                } else {
                    dispatch(dispatchAction(AUTH_ADMIN_ERROR, null))
                    new Error('Карамба, что-то пошло не так!')
                }
            })
        } catch (e) {
            console.log(e)
            dispatch(dispatchAction(AUTH_ADMIN_ERROR, null))
        }

    }
}

// Функция авто выхода
export function autoLogOut(time) {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout())
        }, time * 1000)
    }
}

// Функция подтверждения аунтификации
export function authSuccess(adminId) {
    return {
        type: AUTH_ADMIN_SUCCESS,
        adminId,
    }
}

//Функция выхода
export function logout() {
    localStorage.removeItem('adminId')
    localStorage.removeItem('expirationDate')
    return {
        type: AUTH_ADMIN_LOGOUT,
    }
}

//Функция атво входа
export function autoLogin() {
    return dispatch => {
        const adminId = localStorage.getItem('adminId')
        if (!adminId) {
            dispatch(logout())
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'))
            if (expirationDate <= new Date()) {
                dispatch(logout())
            } else {
                dispatch(authSuccess(adminId))
                dispatch(autoLogOut((expirationDate.getTime() - new Date().getTime()) / 1000))
            }
        }
    }
}

// Запрос информации о пользователях
export function fetchDataBase(collection) {
    return async (dispatch) => {
        let type = ''
        collection === 'users'
            ? type = FETCH_USERS_SUCCESS
            : type = FETCH_COURIERS_SUCCESS

        dataBase.collection(collection).get().then((answer) => {
            const docArray = []
            answer.forEach((doc, count = 0) => {
                docArray.push(doc.data())
                docArray[count].id = doc.id
                count++
            })
            dispatch(dispatchAction(type, docArray))
        })
    }
}

export function registrationNewCourier(email, password) {
    return async dispatch => {
        try {
            await authWithFirebase.createUserWithEmailAndPassword(email, password)

            authWithFirebase.onAuthStateChanged(async (user) => {
                if (user) {
                    const info = {
                        name: '',
                        numberPhone: '',
                        address: '',
                        email: email,
                        role: 'courier',
                        // -1 - не работает
                        // 0 - свободен/ищет заказ
                        // 1 - осуществляет закупку
                        // 2 - доставляет заказ
                        courierStatus: -1,
                    }
                    dataBase.collection('couriers').doc(user.uid).set(info)
                    localStorage.setItem('addedCourierId', JSON.stringify(user.uid))

                    dispatch(dispatchAction(CREATE_NEW_COURIER_S, null))
                    dispatch(fetchDataBase('courier'))
                } else {
                    new Error('Карамба, что-то пошло не так!')
                }
            })
        } catch (e) {
            dispatch(dispatchAction(CREATE_NEW_COURIER_E, null))
        }
    }
}

export function setCourierInfo(info) {
    return async (dispatch) => {
        try {
            let id
            if (info.id === undefined)
                id = localStorage.getItem('addedCourierId') ? JSON.parse(localStorage.getItem('addedCourierId')) : ''
            else
                id = info.id

            dataBase.collection('couriers').doc(id).update({
                name: info.name,
                numberPhone: info.numberPhone,
                address: info.address
            })
            dispatch(dispatchAction(SET_USER_INFO_SUCCESS, null))
            localStorage.removeItem('addedCourierId')
            dispatch(fetchDataBase('courier'))
        } catch (e) {
            dispatch(dispatchAction(SET_USER_INFO_ERROR, e))
        }
    }
}

export function removeCourier(id) {
    return (dispatch) => {
        dataBase.collection("couriers").doc(id).delete()
        dispatch(fetchDataBase('courier'))
    }
}