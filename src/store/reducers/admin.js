import {AUTH_ADMIN_ERROR, AUTH_ADMIN_LOGOUT, AUTH_ADMIN_SUCCESS} from '../actions/actionTypes'

const adminId = localStorage.getItem('adminId') ? JSON.parse(localStorage.getItem('adminId')) : null
localStorage.setItem('adminId', JSON.stringify(adminId))


const initialState = {
    adminId: adminId,
    error: false
}

export default function authAdmin(state = initialState, action) {
    switch (action.type) {
        case AUTH_ADMIN_SUCCESS:
            return {
                ...state, adminId: action.adminId, error: false
            }
        case AUTH_ADMIN_LOGOUT:return {
            ...state, adminId: null
        }
        case AUTH_ADMIN_ERROR: return  {
            ...state, error: true
        }
        default:
            return state
    }
}