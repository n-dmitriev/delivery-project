import React, {Component} from 'react'
import './App.scss'
import Auth from './containers/AuthModalForm/AuthModalForm'
import Header from './components/Header/Header'
import OrderModalForm from './containers/OrderModalForm/OrderModalForm'

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
                <Header openOrderForm={this.interactionWithOrderModal.bind(this)} openAuthForm={this.interactionWithAuthModal.bind(this)}/>
                <OrderModalForm  isOpen={this.state.isOrderModalOpen} onClose={this.interactionWithOrderModal.bind(this)}/>
                <Auth isOpen={this.state.isAuthModalOpen} onClose={this.interactionWithAuthModal.bind(this)}/>
            </div>
        )
    }
}

export default App
