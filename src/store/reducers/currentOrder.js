import {
    ADD_P_TO_RESTAURANT_ORDER,
    ADD_P_TO_SHOP_ORDER, CHANGE_RESTAURANT_NAME, CHANGE_SHOP_NAME,
    DELETE_ORDER, EDIT_ORDER_RESTAURANT_ITEM,
    EDIT_ORDER_SHOP_ITEM, REMOVE_NAMES, REMOVE_P_FROM_RESTAURANT_ORDER,
    REMOVE_P_FROM_SHOP_ORDER,
    SEND_ORDER,
} from '../actions/actionTypes'

const shopOrder = localStorage.getItem('shopOrder') ? JSON.parse(localStorage.getItem('shopOrder')) : []
localStorage.setItem('shopOrder', JSON.stringify(shopOrder))
const restaurantOrder = localStorage.getItem('restaurantOrder') ? JSON.parse(localStorage.getItem('restaurantOrder')) : []
localStorage.setItem('restaurantOrder', JSON.stringify(restaurantOrder))
const nameOfRestaurant = localStorage.getItem('nameOfRestaurant') ? JSON.parse(localStorage.getItem('nameOfRestaurant')) : ''
localStorage.setItem('nameOfRestaurant', JSON.stringify(nameOfRestaurant))
const nameOfShop = localStorage.getItem('nameOfShop') ? JSON.parse(localStorage.getItem('nameOfShop')) : ''
localStorage.setItem('nameOfShop', JSON.stringify(nameOfShop))

const initialState = {
    shopOrder: shopOrder,
    restaurantOrder: restaurantOrder,
    nameOfRestaurant: nameOfRestaurant,
    nameOfShop: nameOfShop
}

export default function eateriesReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_P_TO_SHOP_ORDER:
            return {
                ...state, shopOrder: [...state.shopOrder, action.item]
            }
        case EDIT_ORDER_SHOP_ITEM:
            return {
                ...state, shopOrder: action.item
            }
        case REMOVE_P_FROM_SHOP_ORDER:
            return {
                ...state, shopOrder: action.item
            }
        case ADD_P_TO_RESTAURANT_ORDER:
            return {
                ...state, restaurantOrder: [...state.restaurantOrder, action.item]
            }
        case EDIT_ORDER_RESTAURANT_ITEM:
            return {
                ...state, restaurantOrder: action.item
            }
        case REMOVE_P_FROM_RESTAURANT_ORDER:
            return {
                ...state, restaurantOrder: action.item
            }
        case CHANGE_RESTAURANT_NAME:
            return {
                ...state, nameOfRestaurant: action.item
            }
        case CHANGE_SHOP_NAME:
            return {
                ...state, nameOfShop: action.item
            }
        case REMOVE_NAMES:
            return {
                ...state,
                nameOfRestaurant: '',
                nameOfShop: ''
            }
        case SEND_ORDER:
            return {
                ...state, shopOrder: []
            }
        case DELETE_ORDER:
            return {
                ...state, shopOrder: []
            }
        default:
            return state
    }
}