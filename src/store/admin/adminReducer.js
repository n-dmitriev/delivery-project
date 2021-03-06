import {
    ADD_SAMPLE, ADMIN_START,
    AUTH_ADMIN_ERROR,
    AUTH_ADMIN_LOGOUT,
    AUTH_ADMIN_SUCCESS,
    CREATE_NEW_COURIER_E, CREATE_NEW_COURIER_S,
    FETCH_COURIERS_SUCCESS,
    FETCH_USERS_SUCCESS, REMOVE_ERROR, SAMPLE_END, SET_SAMPLE
} from './actionTypes'

const adminId = localStorage.getItem('adminId') ? JSON.parse(localStorage.getItem('adminId')) : null
localStorage.setItem('adminId', JSON.stringify(adminId))

const initialState = {
    adminId: adminId,
    courierId: '',
    error: false,
    users: [],
    couriers: [],
    orderList: [],
    sampleListIsEnd: false,
    loading: false
}


export default function authAdmin(state = initialState, action) {
    switch (action.type) {
        case AUTH_ADMIN_SUCCESS:
            return {
                ...state, adminId: action.item, error: false
            }
        case AUTH_ADMIN_LOGOUT:
            return {
                ...state, adminId: null
            }
        case AUTH_ADMIN_ERROR:
            return {
                ...state, error: true
            }
        case ADMIN_START:
            return {
                ...state, loading: true
            }
        case FETCH_COURIERS_SUCCESS: {
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
            return {
                ...state, error: false, courierId: action.item
            }
        }
        case CREATE_NEW_COURIER_E: {
            return {
                ...state, error: true
            }
        }
        case SET_SAMPLE: {
            return {
                ...state, loading: false, orderList: action.item, sampleListIsEnd: false
            }
        }
        case ADD_SAMPLE: {
            return {
                ...state, loading: false, orderList: state.orderList.concat(action.item)
            }
        }
        case SAMPLE_END: {
            return {
                ...state, sampleListIsEnd: true
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