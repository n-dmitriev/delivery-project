import {AUTH_ERROR, AUTH_LOGOUT, AUTH_OK, AUTH_SUCCESS, AUTH_START} from './actionTypes'
import {fetchUserInfo} from '../user/userActions'
import {authWithFirebase, dataBase} from '../../firebase/firebase'
import {dispatchAction} from '../universalFunctions'


//Функция авторизации
//На вход email и password, isLogin - флаг, true - авторизация, false - регистрация
//collectionType - кто авторизовывается курьер или пользователь
export function authActions(email, password, isLogin, collectionType) {
    return async dispatch => {
        try {
            dispatch(dispatchAction(AUTH_START, null))
            if(isLogin)
                await authWithFirebase.signInWithEmailAndPassword(email, password)
            else
                await authWithFirebase.createUserWithEmailAndPassword(email, password)

            authWithFirebase.onAuthStateChanged(async (user) => {
                if (user) {
                    const collection = dataBase.collection(collectionType)
                    if(isLogin){
                        const answer = await collection.doc(user.uid).get()
                        const data = answer.data()

                        if(data === undefined){
                            dispatch(dispatchAction(AUTH_ERROR, null))
                            return
                        }
                    }
                    else {
                        const info = {
                            name: '',
                            numberPhone: '',
                            address: '',
                            email: email,
                            role: 'user',
                            id: user.uid
                        }
                        await collection.doc(user.uid).set(info)
                        dispatch(fetchUserInfo())
                    }

                    const path = collectionType === 'users' ? '/user-account/' : '/courier-account/'

                    dispatch(dispatchAction(AUTH_SUCCESS, {id: user.uid, path}))
                    localStorage.setItem('id', JSON.stringify(user.uid))
                    localStorage.setItem('path', JSON.stringify(path))
                    dispatch(fetchUserInfo())
                } else {
                    new Error('Карамба, что-то пошло не так!')
                }
            })
        } catch (e) {
            console.log(e)
            dispatch(dispatchAction(AUTH_ERROR, null))
        }
    }
}

//Функция обнуления ошибки, используется при переключении между окнами
export function removeError() {
    return {
        type: AUTH_OK,
    }
}

//Функция выхода из аккаунта
export function logout() {
    localStorage.removeItem('id')
    localStorage.removeItem('path')
    return {
        type: AUTH_LOGOUT,
    }
}