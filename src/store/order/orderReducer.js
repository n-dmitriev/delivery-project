import {
    UPDATE_ORDER_INFO
} from './actionTypes'

const orderInfo = localStorage.getItem('orderInfo') ? JSON.parse(localStorage.getItem('orderInfo')) : {}
localStorage.setItem('orderInfo', JSON.stringify(orderInfo))

const initialState = {
   orderInfo: orderInfo
}

export default function eateriesReducer(state = initialState, action) {
    switch (action.type) {
        case UPDATE_ORDER_INFO:
            return {
                ...state, orderInfo: action.item
            }
        default:
            return state
    }
}