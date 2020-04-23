import React, {Component} from 'react'
import './App.scss'
import Auth from './containers/AuthModalForm/AuthModalForm'
import Header from './components/Header/Header'
import OrderModalForm from './containers/OrderModalForm/OrderModalForm'
import {connect} from 'react-redux'
import {Route, Switch} from 'react-router-dom'
import UserAccount from './containers/UserAccount/UserAccount'
import CourierAccount from './containers/CourierAccount/CourierAccount'
import MainPage from './components/MainPage/MainPage'
import {fetchUserInfo} from './store/userInformation/userActions'
import Admin from './containers/Admin/Admin'
import {autoLogin} from './store/admin/adminActions'
import 'bootstrap/dist/css/bootstrap.min.css'


class App extends Component {
    state = {
        trySendOrderNotAuth: false,
        isOrderModalOpen: false,
        isAuthModalOpen: false,
    }

    async componentDidMount() {
        if (this.props.isAuth)
            await this.props.fetchUserInfo()
        this.props.autoLogin()
    }

    // Метод на случай, если пользователь попытается сделать заказ не авторизовавшись
    trySendOrder = (flag) => {
        this.setState({
            trySendOrderNotAuth: flag,
        })
    }


    interactionWithOrderModal = () => {
        this.setState({isOrderModalOpen: !this.state.isOrderModalOpen})
    }

    interactionWithAuthModal = () => {
        this.setState({isAuthModalOpen: !this.state.isAuthModalOpen})
    }

    render() {
        return (
            <div className={'app'}>
                <Header
                    logout={this.props.logout} isAuth={this.props.isAuth}
                    openOrderForm={this.interactionWithOrderModal} openAuthForm={this.interactionWithAuthModal}
                    id={this.props.id}
                    name={this.props.userInfo ? this.props.userInfo.name : 'Безымянный пользователь'}
                    path={this.props.path}
                />
                    <div className={'row'}>
                        <div className="col-lg-3 col-sm-1 col-xs-0 add-column"></div>
                        <div className={'col-lg-18 col-sm-22 col-xs-24'}>
                            <div className="app__main-content">
                                <Switch>
                                    <Route path='/' component={MainPage} exact/>
                                    <Route path='/user-account/:number' component={UserAccount}/>
                                    <Route path='/courier-account/:number' component={CourierAccount}/>
                                    <Route path='/admin' component={Admin}/>
                                </Switch>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-1 col-xs-0  add-column"></div>
                    </div>
                <OrderModalForm
                    trySendOrder={this.trySendOrder} isAuth={this.props.isAuth}
                    isOpen={this.state.isOrderModalOpen} onOpenAuth={this.interactionWithAuthModal}
                    onClose={this.interactionWithOrderModal}/>
                <Auth
                    trySendOrderNotAuth={this.state.trySendOrderNotAuth}
                    trySendOrder={this.trySendOrder}
                    isAuth={this.props.isAuth} isOpen={this.state.isAuthModalOpen}
                    isError={this.props.isError}
                    onClose={this.interactionWithAuthModal}/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        isAuth: state.authReducer.isAuth,
        isError: state.authReducer.isError,
        id: state.authReducer.id,
        userInfo: state.userInfReducer.info,
        path: state.authReducer.path,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchUserInfo: () => dispatch(fetchUserInfo()),
        autoLogin: () => dispatch(autoLogin()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
