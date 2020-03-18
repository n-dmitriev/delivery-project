import {combineReducers} from 'redux'
import currentOrder from './currentOrder'
import authReducer from './auth'

export default combineReducers({
    currentOrder,authReducer
})