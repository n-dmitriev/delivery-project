import React, {Component} from 'react'
import './App.scss'
import Auth from './containers/AuthModalForm/AuthModalForm'
import Header from './components/Header/Header'
import OrderModalForm from './containers/OrderModalForm/OrderModalForm'
import {connect} from 'react-redux'
import {logout} from './store/actions/auth'

class App extends Component {
    state = {
        trySendOrderNotAuth: false,
        isOrderModalOpen: false,
        isAuthModalOpen: false,
    }

    // Метод на случай, если пользователь попытается сделать заказ не авторизовавшись
    trySendOrder = (falg) => {
        this.setState({
            trySendOrderNotAuth: falg,
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
                    openOrderForm={this.interactionWithOrderModal} openAuthForm={this.interactionWithAuthModal}/>
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
    }
}

function mapDispatchToProps(dispatch) {
    return {
        logout: () => dispatch(logout()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
