import {combineReducers} from 'redux'
import currentOrder from './currentOrder'
import authReducer from './auth'
import userInfReducer from './userInformation'
import authAdmin from './admin'
import courier from './courier'

export default combineReducers({
    currentOrder,authReducer,userInfReducer, authAdmin, courier
})