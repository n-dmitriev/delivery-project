import {combineReducers} from 'redux'
import currentOrder from './currentOrder'
import authReducer from './auth'
import userInfReducer from './userInformation'

export default combineReducers({
    currentOrder,authReducer,userInfReducer
})