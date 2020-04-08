import {FETCH_ACTIVE_ORDERS_SUCCESS} from '../actions/actionTypes'

const initialState = {
    loading: false,
    error: false,
    ordersList: []
}

export default function userInfReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_ACTIVE_ORDERS_SUCCESS:
            return {
                ...state, loading: false, ordersList: action.item, error: false,
            }
        default:
            return state
    }
}