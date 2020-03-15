import {ADD_P_TO_ORDER, DELETE_ORDER, EDIT_ORDER_ITEM, REMOVE_P_FROM_ORDER, SEND_ORDER} from '../actions/actionTypes'

let itemsArray = localStorage.getItem('currentOrder') ? JSON.parse(localStorage.getItem('currentOrder')) : []
localStorage.setItem('currentOrder', JSON.stringify(itemsArray))

const initialState = {
    order: itemsArray
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
                ...state, order: action.item
            }
        case REMOVE_P_FROM_ORDER:
            return {
                ...state, order: action.item
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