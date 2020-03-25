import axios from 'axios'
import {config} from '../../firebase/config'
import {AUTH_ERROR, AUTH_LOGOUT, AUTH_OK, AUTH_SUCCESS} from './actionTypes'
import {fetchUserInfo} from './userInformation'

export function auth(email, password, isLogin) {
    return async dispatch => {
        try {
            const authData = {
                email, password,
                returnSecureToken: true,
            }
            let url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${config.apiKey}`

            if (isLogin)
                url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${config.apiKey}`
            const response = await axios.post(url, authData)
            const data = response.data
            localStorage.setItem('id', JSON.stringify(data.localId))
            localStorage.setItem('email', JSON.stringify(email))

            dispatch(dispatchAction(AUTH_SUCCESS, {email, id: data.localId}))
            if(isLogin)
                dispatch(fetchUserInfo())
        } catch (e) {
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