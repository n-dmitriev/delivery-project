import React, {Component} from 'react'
import OrderModalForm from '../../containers/OrderModalForm/OrderModalForm'
import Auth from '../../containers/AuthModalForm/AuthModalForm'

export default class AppModalWindows extends Component {
    render() {
        return (
            <>
                <OrderModalForm
                    isAuth={this.props.isAuth}
                    isOpen={this.props.isOrderModalOpen}
                    isEdit={false}
                    onOpenAuth={this.props.interactionWithAuthModal}
                    onClose={this.props.interactionWithOrderModal}/>
                <Auth
                    isAuth={this.props.isAuth}
                    isOpen={this.props.isAuthModalOpen}
                    isError={this.props.isError}
                    onClose={this.props.interactionWithAuthModal}/>
            </>
        )
    }
}