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
                <h4>Заказ {this.props.orderInfo.id}</h4>
                <ul>
                    <li className={'mb-15'}>Откуда: {this.props.orderInfo.name}</li>
                    <li className={'mb-15'}>Состояние: {this.props.orderInfo.description}</li>
                    <li className={'mb-15'}>Время начала заказа:
                        {this.props.orderInfo.startTime.split(' ').slice(1, 5).join(' ')}
                    </li>
                    {
                        this.props.orderInfo.status > 4
                            ?
                            <li>
                                Время завершения: {this.props.orderInfo.endTime.split(' ').slice(1, 5).join(' ')}
                            </li>
                            : null
                    }
                </ul>
                <span className={'list__unwrapping-list mb-15'}
                      onClick={this.interactionWithProductList}>
                                                {this.state.productListIsOpen
                                                    ? 'Скрыть подробности заказа'
                                                    : 'Показать подробности заказа'}
                    <i className="fa fa-caret-down" aria-hidden="true"></i>
                                            </span>
                <div className={this.state.productListIsOpen ? '' : 'hide'}>
                    {
                        this.props.orderInfo.order.length > 0
                            ?
                            this.props.orderInfo.order.map((product) => (
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
                {
                    this.props.type === 'active'
                        ?
                        <div className="button-section mt-30">
                            <button
                                className={`main-item-style mr-15 ${
                                    this.props.orderInfo.status > 1 ? 'non-click' : ''
                                }`}
                                onClick={() => this.props.setEditItem(this.props.orderInfo)}>
                                Редактировать заказ
                            </button>
                            <button
                                className={'main-item-style main-item-style_danger'}
                                onClick={() => this.props.cancelOrder(this.props.orderInfo)}>
                                Отменить заказ
                            </button>
                        </div>
                        : null
                }
            </>
        )
    }
}