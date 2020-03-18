import {AUTH_ERROR, AUTH_LOGOUT, AUTH_SUCCESS} from '../actions/actionTypes'

const id = localStorage.getItem('id') ? JSON.parse(localStorage.getItem('id')) : ''
localStorage.setItem('id', JSON.stringify(id))
const email = localStorage.getItem('email') ? JSON.parse(localStorage.getItem('email')) : ''
localStorage.setItem('email', JSON.stringify(email))
let isAuth = false
if (id !== '' && email !== '')
    isAuth = true

const initialState = {
    isAuth: isAuth,
    isError: false,
    email: email,
    id: id,
}

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case AUTH_SUCCESS:
            return {
                ...state, isAuth: true, email: action.email, id: action.id,
            }
        case AUTH_LOGOUT:
            return {
                ...state, isAuth: false, email: '', id: '',
            }
        case AUTH_ERROR:
            return {
                ...state, isError: true,
            }
        default:
            return state
    }
}