import {ADD_UNSUBSCRIBE, REMOVE_UNSUBSCRIBE_LIST} from './actionTypes'

const initialState = {
    unsubscribeList: []
}

export default function userInfReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_UNSUBSCRIBE:
            return {
                ...state, unsubscribeList: [...state.unsubscribeList, action.item]
            }
        case REMOVE_UNSUBSCRIBE_LIST:
            return {
                ...state, unsubscribeList: []
            }
        default:
            return state
    }
}