import {
    FETCH_USER_INFO_ERROR,
    FETCH_USER_INFO_START,
    FETCH_USER_INFO_SUCCESS,
    SET_USER_PASSWORD_ERROR, SET_USER_PASSWORD_SUCCESS,
    ADD_P_TO_SENT_ORDER, REMOVE_P_FROM_SENT_ORDER, EDIT_SENT_ORDER_ITEM,
} from '../actions/actionTypes'

const initialState = {
    loading: false,
    error: false,
    info: {}
}


export default function userInfReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_USER_INFO_START:
            return {
                ...state, loading: true
            }
        case FETCH_USER_INFO_SUCCESS:
            return {
                ...state, loading: false, info: action.item
            }
        case FETCH_USER_INFO_ERROR:
            return {
                ...state, loading: false, error: action.error,
            }
        case SET_USER_PASSWORD_SUCCESS: return {
            ...state, error: false,
        }
        case SET_USER_PASSWORD_ERROR:
            return {
                ...state, error: action.error
            }
        case ADD_P_TO_SENT_ORDER: {
            return {
                ...state, info: action.item
            }
        }
        case REMOVE_P_FROM_SENT_ORDER: {
           return {
               ...state, info: action.item
           }
        }
        case EDIT_SENT_ORDER_ITEM: {
            return {
                ...state, info: action.item
            }
        }
        default:
            return state
    }
}