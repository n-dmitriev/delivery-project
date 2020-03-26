import {AUTH_ERROR, AUTH_LOGOUT, AUTH_OK, AUTH_SUCCESS} from './actionTypes'
import {fetchUserInfo} from './userInformation'
import {authWithFirebase} from '../../firebase/firebase'

export function auth(email, password, isLogin) {
    return async dispatch => {
        try {
            if(isLogin)
                await authWithFirebase.signInWithEmailAndPassword(email, password)
            else
                await authWithFirebase.createUserWithEmailAndPassword(email, password)

            authWithFirebase.onAuthStateChanged(function(user) {
                if (user) {
                    dispatch(dispatchAction(AUTH_SUCCESS, {email: user.email, id: user.uid}))
                    localStorage.setItem('id', JSON.stringify(user.uid))
                    localStorage.setItem('email', JSON.stringify(user.email))
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

export function dispatchAction(type, item) {
    return {
        type, item,
    }
}

export function removeError() {
    return {
        type: AUTH_OK,
    }
}

export function logout() {
    localStorage.removeItem('id')
    localStorage.removeItem('email')
    return {
        type: AUTH_LOGOUT,
    }
}

/*const authData = {
                email, password,
                returnSecureToken: true,
            }
            let url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${config.apiKey}`

            if (isLogin)
                url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${config.apiKey}`
            const response = await axios.post(url, authData)*/