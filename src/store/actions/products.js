import axios from '../../axios/axios'
import {FETCH_PL_ERROR, FETCH_PL_SUCCESS, START_PL_DOWNLOADING} from './actionTypes'

export function fetchList() {
    return async dispatch => {
        try {
            dispatch(fetchListStart())
            const response = await axios.get('/products.json')

            const productList = []

            Object.keys(response.data).forEach((key) => {
                productList.push({
                    id: key
                })
            })
            dispatch(fetchListSuccess(productList))
        } catch (e) {
            dispatch(fetchListError(e))
        }
    }
}

export function fetchListStart() {
    return {
        type: START_PL_DOWNLOADING,
    }
}
export function fetchListSuccess(productList) {
    return {
        type: FETCH_PL_SUCCESS,
        productList,
    }
}

export function fetchListError(e) {
    return {
        type: FETCH_PL_ERROR,
        error: e,
    }
}