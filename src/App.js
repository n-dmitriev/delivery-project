import React, {Component} from 'react'
import './App.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'toasted-notes/src/styles.css'
import 'react-confirm-alert/src/react-confirm-alert.css'
import "react-sweet-progress/lib/style.css";
import Auth from './containers/AuthModalForm/AuthModalForm'
import Header from './components/Header/Header'
import OrderModalForm from './containers/OrderModalForm/OrderModalForm'
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


class App extends Component {
    state = {
        trySendOrderNotAuth: false,
        isOrderModalOpen: false,
        isAuthModalOpen: false,
        scrollV: false
    }

    async componentDidMount() {
        if (this.props.isAuth)
            await this.props.fetchUserInfo()
        this.props.autoLogin()
        window.addEventListener('scroll', this.handleScroll)
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
    }

    handleScroll = (e) => {
        if(e.srcElement.scrollingElement.scrollTop > 100 && !this.state.scrollV)
            this.setState({
                scrollV: true
            })
        else if (e.srcElement.scrollingElement.scrollTop <= 100 && this.state.scrollV)
            this.setState({
                scrollV: false
            })
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
            <div className={`app`}>
                <Header
                    logout={this.props.logout} isAuth={this.props.isAuth}
                    openOrderForm={this.interactionWithOrderModal} openAuthForm={this.interactionWithAuthModal}
                    id={this.props.id}
                    name={this.props.userInfo ? this.props.userInfo.name : 'Безымянный пользователь'}
                    path={this.props.path}
                />
                <div className="app__container" >
                    <Switch>
                        <Route path='/' component={MainPage} exact/>
                        <Route path='/user-account/:number' component={UserAccount}/>
                        <Route path='/courier-account/:number' component={CourierAccount}/>
                        <Route path='/admin' component={Admin}/>
                        <Route component={Page404}/>
                    </Switch>
                </div>

                <ScrollTop scrollV={this.state.scrollV}/>

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
        userInfo: state.userReducer.info,
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
