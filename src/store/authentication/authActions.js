import {AUTH_ERROR, AUTH_LOGOUT, AUTH_OK, AUTH_SUCCESS, AUTH_START} from './actionTypes'
import {fetchUserInfo} from '../user/userActions'
import {authWithFirebase, dataBase} from '../../firebase/firebase'
import {dispatchAction} from '../universalFunctions'
import {RESET_USER_INFO} from '../user/actionTypes'


//Функция авторизации
//На вход email и password, isLogin - флаг, true - авторизация, false - регистрация
//collectionType - кто авторизовывается курьер или пользователь
export function authActions(email, password, isLogin, collectionType) {
    return async dispatch => {
        try {
            dispatch(dispatchAction(AUTH_START, null))
            if (isLogin)
                await authWithFirebase.signInWithEmailAndPassword(email, password)
            else
                await authWithFirebase.createUserWithEmailAndPassword(email, password)

            const collection = dataBase.collection(collectionType)

            authWithFirebase.onAuthStateChanged(async (user) => {
                if (user) {
                    if (isLogin) {
                        const answer = await collection.doc(user.uid).get()
                        const data = answer.data()

                        if (data === undefined) {
                            dispatch(dispatchAction(AUTH_ERROR, null))
                            return
                        }
                    } else {
                        await user.sendEmailVerification()
                        const info = {
                            clientName: '',
                            clientNumberPhone: '',
                            clientAddress: '',
                            email: email,
                            role: 'user',
                            id: user.uid,
                            deliveryValue: ''
                        }
                        await collection.doc(user.uid).set(info)
                    }

                    const path = collectionType === 'users' ? '/user-account/' : '/courier-account/'

                    if (collectionType === 'couriers') {
                        const userOrders = dataBase.collection('user-orders')
                        const answer = await userOrders
                            .where('courierId', '==', user.uid).where('status', 'in', [1, 2]).get()
                        answer.forEach(item => {
                            const status = item.data().status
                            collection.doc(user.uid).update({courierStatus: status})
                        })
                    }

                    dispatch(dispatchAction(AUTH_SUCCESS, {id: user.uid, path}))
                    localStorage.setItem('id', JSON.stringify(user.uid))
                    localStorage.setItem('path', JSON.stringify(path))
                    dispatch(fetchUserInfo())
                } else {
                    dispatch(dispatchAction(AUTH_ERROR, null))
                    new Error('Карамба, что-то пошло не так!')
                }
            })
        } catch (e) {
            dispatch(dispatchAction(AUTH_ERROR, null))
        }
    }
}

export function resetPassword(email) {
    return () => {
        authWithFirebase.sendPasswordResetEmail(email)
    }
}

//Функция обнуления ошибки, используется при переключении между окнами
export function removeError() {
    return {
        type: AUTH_OK
    }
}

//Функция выхода из аккаунта
export function logout() {
    return dispatch => {
        dispatch(dispatchAction(AUTH_LOGOUT, null))
        dispatch(dispatchAction(RESET_USER_INFO, null))
        localStorage.removeItem('id')
        localStorage.removeItem('path')
    }
}