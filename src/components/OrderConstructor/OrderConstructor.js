import React, {Component} from 'react'
import './OrderConstructor.scss'
import ProductForm from '../ProductForm/ProductForm'

export default class OrderConstructor extends Component {
    state = {
        activeItem: null,
    }

    editItem(e){
        e.preventDefault()
        this.props.activeTab === 'shop-tab'
            ? this.setState({
                activeItem: this.props.shopOrder[e.target.id]
            })
            :this.setState({
                activeItem: this.props.restaurantOrder[e.target.id]
            })

        this.props.interactionWithDagger()
    }

    deleteItem(e){
        e.stopPropagation()
        this.props.removeProductFromOrder(e.target.id, this.props.activeTab)
    }

    resetActiveItem(){
        this.setState({
            activeItem: null
        })
    }

    renderShopOrder() {
        return (
            this.props.shopOrder.map((item, count) => (
                <div key={item.id} id={count} className={'order-constructor__tab'} onClick={this.editItem.bind(this)}>
                    {item.name}, {item.quantity}, {item.price}, {item.brand}, {item.description}
                    <span id={item.id} className={'dagger dagger_delete'} onClick={this.deleteItem.bind(this)}></span>
                </div>
            ))
        )
    }

    renderRestaurantOrder() {
        return (
            this.props.restaurantOrder.map((item, count) => (
                <div key={item.id} id={count} className={'order-constructor__tab'} onClick={this.editItem.bind(this)}>
                    {item.name}, {item.quantity}, {item.price}, {item.description}
                    <span id={item.id} className={'dagger dagger_delete'} onClick={this.deleteItem.bind(this)}></span>
                </div>
            ))
        )
    }

    renderOrder() {
        return (
            <div className={'order-constructor__content'}>
                {
                    this.props.activeTab === 'shop-tab' ? this.renderShopOrder(): this.renderRestaurantOrder()
                }
                {
                    this.props.activeTab ==='shop-tab' && Object.keys(this.props.shopOrder).length !== 0
                    || this.props.activeTab ==='restaurant-tab' && Object.keys(this.props.restaurantOrder).length !== 0
                        ? <div className="button-section button-section_bottom">
                            <button className="main-item-style" onClick={this.props.sendOrder}>Заказать</button>
                            <button className="main-item-style" onClick={this.props.deleteOrder}>Отменить</button>
                            <span
                                className={'dagger dagger_add'}
                                onClick={this.props.interactionWithDagger}>
                            </span>
                        </div>
                        : <>
                            <p className={'placeholder'}>Вы ещё ничего не добавили в заказ</p>
                            <span
                                className={'dagger dagger_add'}
                                onClick={this.props.interactionWithDagger}>
                            </span>
                        </>
                }
            </div>
        )
    }

    renderContent() {
        return (
            <>
                {this.props.formIsOpen === true
                    ? <ProductForm
                        activeTab={this.props.activeTab}
                        interactionWithDagger={this.props.interactionWithDagger}
                        addProductToOrder={this.props.addProductToOrder}
                        editOrderItem={this.props.editOrderItem}
                        item={this.state.activeItem}
                        nameOfRestaurant={this.props.nameOfRestaurant}
                        nameOfShop={this.props.nameOfShop}
                        resetActiveItem={this.resetActiveItem.bind(this)}
                        changeShopName={this.props.changeShopName}
                        changeRestaurantName={this.props.changeRestaurantName}
                    />
                    : this.renderOrder()
                }
            </>
        )
    }

    render() {
        return (
            <div className={'order-constructor'}>
                {this.renderContent()}
            </div>
        )
    }
}