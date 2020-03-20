import {combineReducers} from 'redux'
import currentOrder from './currentOrder'
import authReducer from './auth'
import orderList from './orders'

export default combineReducers({
    currentOrder,authReducer, orderList
})