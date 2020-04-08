import {AUTH_ERROR, AUTH_LOGOUT, AUTH_OK, AUTH_SUCCESS} from '../actions/actionTypes'

const id = localStorage.getItem('id') ? JSON.parse(localStorage.getItem('id')) : ''
localStorage.setItem('id', JSON.stringify(id))
const path = localStorage.getItem('path') ? JSON.parse(localStorage.getItem('path')) : '/'
localStorage.setItem('path', JSON.stringify(path))
let isAuth = false
if (id !== '')
    isAuth = true

const initialState = {
    isAuth: isAuth,
    isError: false,
    id: id,
    path: path
}

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case AUTH_SUCCESS:
            return {
                ...state, isAuth: true, id: action.item.id, isError: false, path: action.item.path
            }
        case AUTH_LOGOUT:
            return {
                ...state, isAuth: false, id: '', path: '/'
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