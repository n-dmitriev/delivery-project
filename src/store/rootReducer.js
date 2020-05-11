import {combineReducers} from 'redux'
import orderReducer from './order/orderReducer'
import authReducer from './authentication/authReducer'
import userReducer from './user/userReducer'
import adminReducer from './admin/adminReducer'
import courierReducer from './courier/courierReducer'

export default combineReducers({orderReducer,authReducer,userReducer, adminReducer, courierReducer})