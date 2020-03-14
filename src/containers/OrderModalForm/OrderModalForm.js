import React, {Component} from 'react'
import './OrderModalForm.scss'
import {connect} from 'react-redux'
import OrderConstructor from '../../components/OrderConstructor/OrderConstructor'
import {
    addProductToOrder,
    deleteOrder,
    editOrderItem,
    removeProductFromOrder,
    sendOrder,
} from '../../store/actions/currentOrder'

class OrderModalForm extends Component {
    state = {
        activeTab: 'shop-tab',
    }

    close(e) {
        e.preventDefault()
        this.props.onClose()
    }

    clickItemHandler(event) {
        this.setState({
            activeTab: event.target.id,
        })
    }

    render() {
        if (this.props.isOpen === false) return null
        return (
            <>
                <form className={'order-form'} key={'order-form'}>
                    <div className={'order-form__selector'}>
                        <div
                            id={'shop-tab'}
                            className={this.state.activeTab === 'shop-tab'
                                ? 'order-form__select order-form__select_active'
                                : 'order-form__select'}
                            onClick={this.clickItemHandler.bind(this)}>
                            <span className={'non-click'}>Заказать из магазина</span>
                        </div>
                        <div
                            id={'restaurant-tab'}
                            className={this.state.activeTab === 'restaurant-tab'
                                ? 'order-form__select order-form__select_active'
                                : 'order-form__select'}
                            onClick={this.clickItemHandler.bind(this)}>
                            <span className={'non-click'}>Заказать из заведения</span>
                        </div>
                    </div>

                    <OrderConstructor
                        activeTab={this.state.activeTab}
                        order={this.props.order}
                        addProductToOrder={this.props.addProductToOrder}
                        removeProductFromOrder={this.props.removeProductFromOrder}
                        editOrderItem={this.props.editOrderItem}
                        sendOrder={this.props.sendOrder}
                        deleteOrder={this.props.deleteOrder}
                    />
                </form>
                <div className={'bg'} onClick={e => this.close(e)}/>
            </>
        )
    }
}

function mapStateToProps(state) {
    return {
        order: state.currentOrder.order
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addProductToOrder: (item) =>
            dispatch(addProductToOrder(item)),
        editOrderItem: (item) =>
            dispatch(editOrderItem(item)),
        removeProductFromOrder: (id) => dispatch(removeProductFromOrder(id)),
        sendOrder: () => dispatch(sendOrder()),
        deleteOrder: () => dispatch(deleteOrder())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderModalForm)