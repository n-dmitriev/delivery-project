import {FETCH_O_START, FETCH_O_STOP} from './actionTypes'

const initialState = {
    loading: true,
    error: false,
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
        default:
            return state
    }
}