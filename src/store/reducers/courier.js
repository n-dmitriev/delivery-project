import {FETCH_ACTIVE_ORDERS_SUCCESS, FETCH_DELIVERED_ORDER, FETCH_O_START, FETCH_O_STOP} from '../actions/actionTypes'

const initialState = {
    loading: true,
    error: false,
    ordersList: [],
    deliveredOrder: {},
}

export default function userInfReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_O_START:
            return {
                ...state, loading: true,
            }
        case FETCH_O_STOP: return {
            ...state, loading: false
        }
        case FETCH_ACTIVE_ORDERS_SUCCESS:
            return {
                ...state, loading: false, ordersList: action.item, error: false,
            }
        case FETCH_DELIVERED_ORDER:
            return {
                ...state, deliveredOrder: action.item, error: false, loading: false
            }
        default:
            return state
    }
}