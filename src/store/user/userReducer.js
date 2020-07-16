import {
    FETCH_USER_INFO_ERROR,
    FETCH_USER_INFO_SUCCESS,
    SET_USER_PASSWORD_ERROR,
    SET_USER_PASSWORD_SUCCESS,
    ADD_P_TO_SENT_ORDER,
    REMOVE_P_FROM_SENT_ORDER,
    EDIT_SENT_ORDER_ITEM,
    FETCH_USER_START,
    SET_USER_AL_SUCCESS,
    SET_USER_FL_SUCCESS, ADD_USER_AL_SUCCESS, ADD_USER_FL_SUCCESS, AL_END, FL_END
} from './actionTypes'
import {SORT_ORDER_LIST} from '../courier/actionTypes'

const initialState = {
    loading: false,
    error: false,
    info: {},
    listOfCurrentOrders: [],
    listOfDeliveredOrders: [],
    alEnd: false,
    flEnd: false,
    remove: false // костыль, без него почему-то не обновляется компонент....
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
        case ADD_P_TO_SENT_ORDER: {
            return {
                ...state, listOfCurrentOrders: action.item
            }
        }
        case REMOVE_P_FROM_SENT_ORDER: {
            return {
                ...state, listOfCurrentOrders: action.item, remove: !state.remove
            }
        }
        case EDIT_SENT_ORDER_ITEM: {
            return {
                ...state, listOfCurrentOrders: action.item
            }
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