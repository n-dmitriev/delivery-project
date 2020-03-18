import React, {Component} from 'react'
import './App.scss'
import Auth from './containers/AuthModalForm/AuthModalForm'
import Header from './components/Header/Header'
import OrderModalForm from './containers/OrderModalForm/OrderModalForm'
import {connect} from 'react-redux'
import {logout} from './store/actions/auth'

class App extends Component {
    state={
        isOrderModalOpen: false,
        isAuthModalOpen: false
    }

    interactionWithOrderModal() {
        this.setState({ isOrderModalOpen: !this.state.isOrderModalOpen });
    }

    interactionWithAuthModal() {
        this.setState({ isAuthModalOpen: !this.state.isAuthModalOpen });
    }

    render() {
        return (
            <div className={'app'}>
                <Header logout={this.props.logout} isAuth={this.props.isAuth} openOrderForm={this.interactionWithOrderModal.bind(this)} openAuthForm={this.interactionWithAuthModal.bind(this)}/>
                <OrderModalForm isAuth={this.props.isAuth} isOpen={this.state.isOrderModalOpen} onClose={this.interactionWithOrderModal.bind(this)}/>
                <Auth isAuth={this.props.isAuth} isOpen={this.state.isAuthModalOpen} isError={this.props.isError} onClose={this.interactionWithAuthModal.bind(this)}/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        isAuth: state.authReducer.isAuth,
        isError: state.authReducer.isError
    }
}

function mapDispatchToProps(dispatch) {
    return {
        logout: () => dispatch(logout())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
