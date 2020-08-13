import {
    ADD_PRODUCT, CHANGE_NAME,
    DELETE_ORDER_INFO,
    EDIT_ORDER,
    REMOVE_PRODUCT
} from './actionTypes'

const order = localStorage.getItem('order') ? JSON.parse(localStorage.getItem('order')) : []
localStorage.setItem('order', JSON.stringify(order))
const name = localStorage.getItem('name') ? JSON.parse(localStorage.getItem('name')) : ''
localStorage.setItem('name', JSON.stringify(name))

const initialState = {
    order: order,
    name: name
}

export default function eateriesReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_PRODUCT:
            return {
                ...state, order: [...state.order, action.item]
            }
        case EDIT_ORDER:
            return {
                ...state, order: action.item
            }
        case REMOVE_PRODUCT:
            return {
                ...state, order: action.item
            }
        case CHANGE_NAME:
            return {
                ...state, name: action.item
            }
        case DELETE_ORDER_INFO:
            return {
                order: [],
                name: ''
            }
        default:
            return state
    }
}