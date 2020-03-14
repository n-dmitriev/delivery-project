import React, {Component} from 'react'
import './App.scss'
import Auth from './containers/Auth/Auth'
import Header from './components/Header/Header'
import Modal from './containers/OrderModalForm/OrderModalForm'

class App extends Component {
    state={
        isModalOpen: false,
    }

    interactionWithModal() {
        this.setState({ isModalOpen: !this.state.isModalOpen });
    }

    render() {
        return (
            <div className={'app'}>
                <Header openForm={() => this.interactionWithModal()}/>
                <Modal  isOpen={this.state.isModalOpen}
                        onClose={() => this.interactionWithModal()}/>
                <Auth/>
            </div>
        )
    }
}

export default App
