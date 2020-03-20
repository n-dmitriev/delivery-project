import axios from '../../axios/axios'
import {FETCH_PL_ERROR, FETCH_PL_SUCCESS, START_PL_DOWNLOADING} from './actionTypes'

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

export function createUserStore(info) {
    return async (dispatch,getState) => {
        //const r = await axios.post(`/users/${getState().authReducer.id}.json`, info)

    }
}