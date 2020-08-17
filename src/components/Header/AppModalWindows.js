import React, {Component} from 'react'
import OrderModalForm from '../../containers/OrderModalForm/OrderModalForm'
import Auth from '../../containers/AuthModalForm/AuthModalForm'

export default class AppModalWindows extends Component {
    state = {
        trySendOrderNotAuth: false,
    }

    // Метод на случай, если пользователь попытается сделать заказ не авторизовавшись
    trySendOrder = (flag) => {
        this.setState({
            trySendOrderNotAuth: flag
        })
    }

    render() {
        return (
            <>
                <OrderModalForm
                    trySendOrder={this.trySendOrder}
                    isAuth={this.props.isAuth}
                    isOpen={this.props.isOrderModalOpen}
                    isEdit={false}
                    onOpenAuth={this.props.interactionWithAuthModal}
                    onClose={this.props.interactionWithOrderModal}/>
                <Auth
                    trySendOrderNotAuth={this.state.trySendOrderNotAuth}
                    trySendOrder={this.trySendOrder}
                    isAuth={this.props.isAuth}
                    isOpen={this.props.isAuthModalOpen}
                    isError={this.props.isError}
                    onClose={this.props.interactionWithAuthModal}/>
            </>
        )
    }
}