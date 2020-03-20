import {AUTH_ERROR, AUTH_LOGOUT, AUTH_OK, AUTH_SUCCESS} from '../actions/actionTypes'

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
                ...state, isAuth: true, email: action.item.email, id: action.item.id, isError: false,
            }
        case AUTH_LOGOUT:
            return {
                ...state, isAuth: false, email: '', id: '',
            }
        case AUTH_ERROR:
            return {
                ...state, isError: true,
            }
        case AUTH_OK:
            return {
                ...state, isError: false,
            }
        default:
            return state
    }
}