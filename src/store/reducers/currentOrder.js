import {ADD_P_TO_ORDER, DELETE_ORDER, EDIT_ORDER_ITEM, REMOVE_P_FROM_ORDER, SEND_ORDER} from '../actions/actionTypes'

const initialState = {
    order: []
}

export default function eateriesReducer(state = initialState, action) {
    let arr = state.order, el
    switch (action.type) {
        case ADD_P_TO_ORDER:
            return {
                ...state, order: [...state.order, action.item]
            }
        case EDIT_ORDER_ITEM:
            return {
                ...state, order: getElementById(state.order, action.item.id).assign({}, action.item)
            }
        case REMOVE_P_FROM_ORDER:
            const index = state.order.findIndex(x => x.id === action.id)
            if (index < -1) {return null}
            arr.length === 1? arr = [] :  arr.splice(index, 1)
            return {
                ...state, order: arr
            }
        case SEND_ORDER:
            return {
                ...state, order: []
            }
        case DELETE_ORDER:
            return {
                ...state, order: []
            }
        default:
            return state
    }
}

function getElementById(arr, id) {
    const index = this.listOfNotes.findIndex(x => x.id === id)
    return arr[index]
}