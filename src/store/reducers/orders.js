import {FETCH_PL_ERROR, FETCH_PL_SUCCESS, START_PL_DOWNLOADING} from '../actions/actionTypes'

const initialState = {
    loading: false,
    orderList: []
}

export default function orderListReducer(state = initialState, action) {
    switch (action.type) {
        case START_PL_DOWNLOADING:
            return {
                ...state, loading: true
            }
        case FETCH_PL_SUCCESS:
            return {
                ...state, loading: false, productList: action.productList,
            }
        case FETCH_PL_ERROR:
            return {
                ...state, loading: false, error: action.error,
            }
        default:
            return state
    }
}