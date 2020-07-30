import React, {Component} from 'react'
import './App.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'toasted-notes/src/styles.css'
import 'react-confirm-alert/src/react-confirm-alert.css'
import 'react-sweet-progress/lib/style.css'
import Header from './components/Header/Header'
import {connect} from 'react-redux'
import {Route, Switch} from 'react-router-dom'
import UserAccount from './containers/UserAccount/UserAccount'
import CourierAccount from './containers/CourierAccount/CourierAccount'
import MainPage from './components/MainPage/MainPage'
import {fetchUserInfo} from './store/user/userActions'
import Admin from './containers/AdminAccount/Admin'
import {autoLogin} from './store/admin/adminActions'
import Page404 from './components/UI/Page404/Page404'
import ScrollTop from './components/UI/ScrollTop/ScrollTop'
import OrderPage from './containers/OrderPage/OrderPage'


class App extends Component {
    componentDidMount = async () => {
        if (this.props.isAuth)
            await this.props.fetchUserInfo()
        this.props.autoLogin()
    }

    render() {
        return (
            <div className={`app`}>
                <Header
                    logout={this.props.logout} isAuth={this.props.isAuth}
                    id={this.props.id}
                    name={this.props.userInfo ? this.props.userInfo.name : 'Безымянный пользователь'}
                    path={this.props.path}
                    isError={this.props.isError}
                />
                <div className="app__container">
                    <Switch>
                        <Route path='/' component={MainPage} exact/>
                        <Route path='/user-account/:number' component={UserAccount}/>
                        <Route path='/courier-account/:number' component={CourierAccount}/>
                        <Route path='/admin' component={Admin}/>
                        <Route path='/order/:number' component={OrderPage}/>
                        <Route component={Page404}/>
                    </Switch>
                </div>
                <ScrollTop/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        isAuth: state.authReducer.isAuth,
        isError: state.authReducer.isError,
        id: state.authReducer.id,
        userInfo: state.userReducer.info,
        path: state.authReducer.path
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchUserInfo: () => dispatch(fetchUserInfo()),
        autoLogin: () => dispatch(autoLogin())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
