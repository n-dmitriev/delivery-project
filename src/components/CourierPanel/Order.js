import React, {Component} from 'react'

export default class Order extends Component {
    state = {
        productListIsOpen: false,
    }

    interactionWithProductList = () => {
        this.setState({
            productListIsOpen: !this.state.productListIsOpen,
        })
    }

    render() {
        return (
            <>
                {
                    this.props.orderInfo.orders.map((orderItem) => (
                        <div key={orderItem.id}>
                            <h4 className={'mb-15'}>Заказ {orderItem.id}</h4>
                            <ul>
                                <li className={'mb-15'}>Имя клиента: {this.props.orderInfo.name}</li>
                                <li className={'mb-15'}>Адресс доставки: {this.props.orderInfo.address}</li>
                                <li className={'mb-15'}>Контактный телефон: {this.props.orderInfo.numberPhone}</li>
                                <li className={'mb-15'}>Откуда: {orderItem.name}</li>
                                <li className={'mb-15'}>Время начала заказа:
                                    {orderItem.startTime.split(' ').slice(1, 5).join(' ')}
                                </li>
                            </ul>
                            <span className={'list__unwrapping-list mb-15'}
                                  onClick={this.interactionWithProductList}>
                                                {this.state.productListIsOpen
                                                    ? 'Скрыть подробности заказа'
                                                    : 'Показать подробности заказа'}
                                <i className="fa fa-caret-down" aria-hidden="true"/>
                                            </span>
                            <div className={this.state.productListIsOpen ? '' : 'hide'}>
                                {
                                    orderItem.order.length > 0
                                        ?
                                        orderItem.order.map((product) => (
                                            <div key={product.id} className={'list__unwrapping-item'}>
                                                <ul className={'list__product-list'}>
                                                    <li>{product.name}</li>
                                                    <li>{product.quantity}</li>
                                                    <li>{product.price}</li>
                                                    <li>{product.description}</li>
                                                </ul>
                                            </div>
                                        ))
                                        :
                                        <span>Ваш заказ пуст!:(</span>
                                }
                            </div>
                            <div className="button-section mt-30">
                                <button
                                    className={`main-item-style mr-15`}
                                    onClick={() => this.props.takeOrder({
                                        uid: this.props.orderInfo.id,
                                        selectedOrder: orderItem
                                    })}>
                                    Взять заказ
                                </button>
                                <button
                                    className={`main-item-style main-item-style_danger`}
                                    onClick={() => this.props.itsTroll({
                                        uid: this.props.orderInfo.id,
                                        selectedOrder: orderItem
                                    })}>
                                        Это тролль!
                                </button>
                            </div>
                        </div>
                    ))
                }
            </>
        )
    }
}