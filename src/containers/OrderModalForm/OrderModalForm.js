import React, {Component} from 'react'
import './OrderModalForm.scss'
import {connect} from 'react-redux'
import OrderConstructor from '../../components/OrderConstructor/OrderConstructor'
import {
    addProductToOrder, changeRestaurantName, changeShopName,
    deleteOrder,
    editOrderItem,
    removeProductFromOrder,
    sendOrder,
} from '../../store/actions/currentOrder'

class OrderModalForm extends Component {
    state = {
        activeTab: 'shop-tab',
        formIsOpen: false,
    }

    interactionWithDagger = () => {
        this.setState({
            formIsOpen: !this.state.formIsOpen,
        })
    }

    clickItemHandler = (event) => {
        this.setState({
            activeTab: event.target.id,
            formIsOpen: this.state.formIsOpen ? !this.state.formIsOpen : this.state.formIsOpen
        })
    }

    render() {
        if (this.props.isOpen === false) return null
        return (
            <>
                <div className={'order-form'} key={'order-form'}>
                    <span className="dagger dagger_delete" onClick={this.props.onClose}></span>
                    <div className={'order-form__selector'}>
                        <div
                            id={'shop-tab'}
                            className={this.state.activeTab === 'shop-tab'
                                ? 'order-form__select order-form__select_active'
                                : 'order-form__select'}
                            onClick={this.clickItemHandler}>
                            <span className={'non-click'}>Заказать из магазина</span>
                        </div>
                        <div
                            id={'restaurant-tab'}
                            className={this.state.activeTab === 'restaurant-tab'
                                ? 'order-form__select order-form__select_active'
                                : 'order-form__select'}
                            onClick={this.clickItemHandler}>
                            <span className={'non-click'}>Заказать из заведения</span>
                        </div>

                    </div>

                    <OrderConstructor
                        activeTab={this.state.activeTab}
                        shopOrder={this.props.shopOrder}
                        restaurantOrder={this.props.restaurantOrder}
                        addProductToOrder={this.props.addProductToOrder}
                        removeProductFromOrder={this.props.removeProductFromOrder}
                        editOrderItem={this.props.editOrderItem}
                        sendOrder={this.props.sendOrder}
                        deleteOrder={this.props.deleteOrder}
                        interactionWithDagger={this.interactionWithDagger}
                        formIsOpen={this.state.formIsOpen}
                        nameOfRestaurant={this.props.nameOfRestaurant}
                        nameOfShop={this.props.nameOfShop}
                        changeShopName={this.props.changeShopName}
                        changeRestaurantName={this.props.changeRestaurantName}
                        close={this.props.onClose}
                    />
                </div>
                <div className={'bg'} onClick={this.props.onClose}/>
            </>
        )
    }
}

function mapStateToProps(state) {
    return {
        shopOrder: state.currentOrder.shopOrder,
        restaurantOrder: state.currentOrder.restaurantOrder,
        nameOfRestaurant: state.currentOrder.nameOfRestaurant,
        nameOfShop: state.currentOrder.nameOfShop,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addProductToOrder: (item, list) =>
            dispatch(addProductToOrder(item, list)),
        editOrderItem: (item, list) =>
            dispatch(editOrderItem(item, list)),
        removeProductFromOrder: (id, list) => dispatch(removeProductFromOrder(id,list)),
        sendOrder: () => dispatch(sendOrder()),
        deleteOrder: () => dispatch(deleteOrder()),
        changeShopName: (name) => dispatch(changeShopName(name)),
        changeRestaurantName: (name) => dispatch(changeRestaurantName(name))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderModalForm)