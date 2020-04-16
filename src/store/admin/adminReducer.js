import {
    AUTH_ADMIN_ERROR,
    AUTH_ADMIN_LOGOUT,
    AUTH_ADMIN_SUCCESS,
    CREATE_NEW_COURIER_E, CREATE_NEW_COURIER_S,
    FETCH_PERS_SUCCESS,
    FETCH_USERS_SUCCESS, REMOVE_ERROR,
} from './actionTypes'

const adminId = localStorage.getItem('adminId') ? JSON.parse(localStorage.getItem('adminId')) : null
localStorage.setItem('adminId', JSON.stringify(adminId))

const initialState = {
    adminId: adminId,
    error: false,
    users: {},
    couriers: {}
}


export default function authAdmin(state = initialState, action) {
    switch (action.type) {
        case AUTH_ADMIN_SUCCESS:
            return {
                ...state, adminId: action.item, error: false
            }
        case AUTH_ADMIN_LOGOUT:return {
            ...state, adminId: null
        }
        case AUTH_ADMIN_ERROR: return  {
            ...state, error: true
        }
        case FETCH_PERS_SUCCESS: {
            return {
                ...state, error: false, couriers: action.item
            }
        }
        case FETCH_USERS_SUCCESS: {
            return {
                ...state, error: false, users: action.item
            }
        }
        case CREATE_NEW_COURIER_S: {
            return  {
                ...state, error: false,
            }
        }
        case CREATE_NEW_COURIER_E: {
            return {
                ...state, error: true
            }
        }
        case REMOVE_ERROR: {
            return {
                ...state, error: false
            }
        }
        default:
            return state
    }
}