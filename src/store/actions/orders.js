import axios from '../../axios/axios'
import {FETCH_PL_ERROR, FETCH_PL_SUCCESS, START_PL_DOWNLOADING} from './actionTypes'
import {dataBase} from '../../firebase/firebase'
import * as firebase from 'firebase/app'

export function dispatchAction(type, item) {
    return {
        type, item
    }
}

export function fetchList() {
    return async dispatch => {
        try {
            dispatch(dispatchAction(START_PL_DOWNLOADING, null))
            const response = await axios.get('/products.json')

            const productList = []

            Object.keys(response.data).forEach((key) => {
                productList.push({
                    id: key
                })
            })
            dispatch(dispatchAction(FETCH_PL_SUCCESS, productList))
        } catch (e) {
            dispatch(dispatchAction(FETCH_PL_ERROR, e))
        }
    }
}

export function addOrderToOrderList() {
    return async (dispatch, getState) => {
        const state = getState().currentOrder
        let order
        if(state.shopOrder.length !== 0){
            order = {
                orderId: Math.random().toString(36).substr(2, 9),courierId: '',
                delivered: false,
                startTime: new Date(),
                endTime: '',
                nameOfShop: state.nameOfShop,
                shopOrder: state.shopOrder
            }
            dataBase.collection("users").doc(getState().authReducer.id).update({
                orderList: firebase.firestore.FieldValue.arrayUnion(order)
            })
        }
        if(state.restaurantOrder.length !== 0 && state.nameOfRestaurant !== ''){
            order = {
                orderId: Math.random().toString(36).substr(2, 9),courierId: '',
                delivered: false,
                startTime: new Date(),
                endTime: '',
                nameOfRestaurant: state.nameOfRestaurant,
                restaurantOrder: state.restaurantOrder
            }
            dataBase.collection("users").doc(getState().authReducer.id).update({
                orderList: firebase.firestore.FieldValue.arrayUnion(order)
            })
        }
    }
}

export function createUserStore(info) {
    return async (dispatch,getState) => {
        dataBase.collection("users").doc(getState().authReducer.id).set(info)
    }
}