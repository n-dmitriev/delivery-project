import {
    FETCH_USER_INFO_ERROR,
    FETCH_USER_INFO_SUCCESS,
    SET_USER_PASSWORD_ERROR,
    SET_USER_PASSWORD_SUCCESS,
    FETCH_USER_START,
    SET_USER_AL_SUCCESS,
    SET_USER_FL_SUCCESS, ADD_USER_AL_SUCCESS, ADD_USER_FL_SUCCESS, AL_END, FL_END, AL_CHANGE, RESET_USER_INFO
} from './actionTypes'
import {SORT_ORDER_LIST} from '../courier/actionTypes'

const initialState = {
    loading: false,
    error: false,
    info: {},
    listOfCurrentOrders: [],
    listOfDeliveredOrders: [],
    alEnd: false,
    flEnd: false
}


export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_USER_START:
            return {
                ...state, loading: true
            }
        case FETCH_USER_INFO_SUCCESS:
            return {
                ...state, loading: false, info: action.item
            }
        case RESET_USER_INFO:
            return {
                ...state, info: {}
            }
        case SET_USER_AL_SUCCESS:
            return {
                ...state, loading: false, listOfCurrentOrders: action.item, alEnd: false
            }
        case AL_END:
            return {
                ...state, alEnd: true
            }
        case ADD_USER_AL_SUCCESS:
            return {
                ...state, loading: false, listOfCurrentOrders: state.listOfCurrentOrders.concat(action.item)
            }
        case AL_CHANGE:
            return {
                ...state,  listOfCurrentOrders: action.item
            }
        case SET_USER_FL_SUCCESS:
            return {
                ...state, loading: false, listOfDeliveredOrders: action.item, flEnd: false
            }
        case ADD_USER_FL_SUCCESS:
            return {
                ...state, loading: false, listOfDeliveredOrders: state.listOfDeliveredOrders.concat(action.item)
            }
        case FL_END:
            return {
                ...state, flEnd: true
            }
        case FETCH_USER_INFO_ERROR:
            return {
                ...state, loading: false, error: action.error
            }
        case SET_USER_PASSWORD_SUCCESS:
            return {
                ...state, error: false
            }
        case SET_USER_PASSWORD_ERROR:
            return {
                ...state, error: action.error
            }
        case SORT_ORDER_LIST : {
            return {
                ...state, listOfCurrentOrders: action.item
            }
        }
        default:
            return state
    }
}