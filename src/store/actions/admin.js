import {authWithFirebase, dataBase} from '../../firebase/firebase'
import {AUTH_ADMIN_ERROR, AUTH_ERROR, AUTH_ADMIN_SUCCESS, AUTH_ADMIN_LOGOUT} from './actionTypes'
import {dispatchAction} from './universalFunctions'

function checkCorrect(id) {

}

export function authAdmin(email, password) {
    return async dispatch => {
        try {
            await authWithFirebase.signInWithEmailAndPassword(email, password)
            authWithFirebase.onAuthStateChanged(async (user) => {
                if (user) {
                    const docRef = dataBase.collection('personnel').doc(user.uid)
                    const answer = await docRef.get()
                    const data = answer.data()

                    if(data === undefined){
                        dispatch(dispatchAction(AUTH_ADMIN_ERROR, null))
                        return
                    }

                    if (data.role === 'admin') {
                        const expirationDate = new Date(new Date().getTime() + 3600 * 1000)
                        localStorage.setItem('expirationDate', expirationDate)
                        localStorage.setItem('adminId',  JSON.stringify(user.uid))
                        dispatch(dispatchAction(AUTH_ADMIN_SUCCESS, null))
                    } else
                        dispatch(dispatchAction(AUTH_ADMIN_ERROR, null))
                } else {
                    dispatch(dispatchAction(AUTH_ADMIN_ERROR, null))
                    new Error('Карамба, что-то пошло не так!')
                }
            })
        } catch (e) {
            console.log(e)
            dispatch(dispatchAction(AUTH_ERROR, null))
        }

    }
}

export function autoLogOut(time) {
    return dispatch => {
        setTimeout(()=>{
            dispatch(logout())
        }, time * 1000)
    }
}

export function authSuccess(adminId) {
    return {
        type: AUTH_ADMIN_SUCCESS,
        adminId
    }
}

export function logout() {
    localStorage.removeItem('adminId')
    localStorage.removeItem('expirationDate')
    return{
        type: AUTH_ADMIN_LOGOUT
    }
}

export function autoLogin() {
    return dispatch => {
        const adminId = localStorage.getItem('adminId')
        if(!adminId){
            dispatch(logout())
        }
        else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'))
            if(expirationDate <= new  Date()){
                dispatch(logout())
            }
            else {
                dispatch(authSuccess(adminId))
                dispatch(autoLogOut((expirationDate.getTime()-new Date().getTime())/1000))
            }
        }
    }
}

export function fetchDataBase() {
    return async (dispatch, getState) => {
        try {
            const docRef = dataBase.collection('personnel').doc(getState().authAdmin.adminId)
            const answer = await docRef.get()
            const data = answer.data()

            console.log(data)

            if(data !== undefined && data.role === 'admin'){
                const db = dataBase.collection('users')
                console.log(db)
            }
             else {
                dispatch(dispatchAction(AUTH_ADMIN_ERROR, null))
                return
            }
        } catch (e) {
            console.log(e)
            dispatch(dispatchAction(AUTH_ERROR, null))
        }

    }
}