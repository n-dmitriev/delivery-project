import {combineReducers} from 'redux'
import currentOrder from './currentOrder/orderReducer'
import authReducer from './authentication/authReducer'
import userInfReducer from './userInformation/userReducer'
import authAdmin from './admin/adminReducer'
import courier from './courier/courierReducer'

export default combineReducers({
    currentOrder,authReducer,userInfReducer, authAdmin, courier
})