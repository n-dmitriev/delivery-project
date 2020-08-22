import {
    ADD_UNSUBSCRIBE,
    END_LOADING,
    NOT_EMPTY,
    REMOVE_LAST_S,
    REMOVE_UNSUBSCRIBE_LIST,
    START_LOADING
} from './actionTypes'

const initialState = {
    unsubscribeList: [],
    isEmpty: true,
    loading: false,
}

export default function courierReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_UNSUBSCRIBE:
            return {
                ...state, unsubscribeList: [...state.unsubscribeList, action.item]
            }
        case REMOVE_UNSUBSCRIBE_LIST:
            return {
                ...state, unsubscribeList: []
            }
        case REMOVE_LAST_S:
            return {
                ...state, unsubscribeList: action.item
            }
        case START_LOADING:
            return {
                ...state, isEmpty: true, loading: true
            }
        case NOT_EMPTY:
            return {
                ...state, isEmpty: false, loading: false
            }
        case END_LOADING:
            return {
                ...state, loading: false
            }
        default:
            return state
    }
}