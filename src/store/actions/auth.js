import axios from 'axios'
import {AUTH_ERROR, AUTH_LOGOUT, AUTH_SUCCESS} from './actionTypes'

export function auth(email, password, isLogin) {
    return async dispatch => {
        try {
            const authData = {
                email, password,
                returnSecureToken: true,
            }
            let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyAFK-ch0po-GKgl9QRf4162BSw5hzmCgsQ'

            if(isLogin)
                url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyAFK-ch0po-GKgl9QRf4162BSw5hzmCgsQ'
            const response = await axios.post(url, authData)
            const data = response.data
            console.log(data)
            localStorage.setItem('id', JSON.stringify(data.localId))
            localStorage.setItem('email', JSON.stringify(email))

            dispatch(authSuccess(email, data.localId))
        }
        catch (e) {
            dispatch(authError())
        }

    }
}

export function authError() {
    return{
        type: AUTH_ERROR
    }
}

export function logout() {
    localStorage.removeItem('id')
    localStorage.removeItem('email')
    return{
        type: AUTH_LOGOUT
    }
}

export function authSuccess(email, id) {
    return {
        type: AUTH_SUCCESS,
        email, id
    }
}