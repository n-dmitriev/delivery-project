import {AUTH_ERROR, AUTH_LOGOUT, AUTH_OK, AUTH_START, AUTH_SUCCESS} from './actionTypes'

const id = localStorage.getItem('id') ? JSON.parse(localStorage.getItem('id')) : ''
localStorage.setItem('id', JSON.stringify(id))
const email = localStorage.getItem('email') ? JSON.parse(localStorage.getItem('email')) : ''
localStorage.setItem('email', JSON.stringify(email))
const path = localStorage.getItem('path') ? JSON.parse(localStorage.getItem('path')) : '/'
localStorage.setItem('path', JSON.stringify(path))
const isAuth = id !== ''

const initialState = {
    isAuth: isAuth,
    isError: false,
    id: id,
    email: email,
    path: path,
    loading: false,
}

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case AUTH_START: {
            return {
                ...state, loading: true,
            }
        }
        case AUTH_SUCCESS:
            return {
                ...state, isAuth: true, id: action.item.id, isError: false, path: action.item.path, loading: false
            }
        case AUTH_LOGOUT:
            return {
                ...state, isAuth: false, id: '', path: '/', loading: false
            }
        case AUTH_ERROR:
            return {
                ...state, isError: true, loading: false
            }
        case AUTH_OK:
            return {
                ...state, isError: false, loading: false
            }
        default:
            return state
    }
}