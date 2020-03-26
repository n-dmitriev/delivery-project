import React, {Component} from 'react'
import './RenderOrderList.scss'

export default class RenderOrderList extends Component {
    state = {
        orderListIsOpen: false,
        productListIsOpen: false,
    }

    interactionWithProductList = () => {
        this.setState({
            productListIsOpen: !this.state.productListIsOpen,
        })
    }

    interactionWithOrderList = () => {
        this.setState({
            orderListIsOpen: !this.state.orderListIsOpen,
        })
    }

    render() {
        return (
            <>
                <div className={'order-list'}>
                <span className={'order-list__unwrapping-list mb-15'}
                      onClick={this.interactionWithOrderList}>
                    {this.state.orderListIsOpen
                        ? 'Скрыть '
                        : 'Показать '}
                    список {this.props.description}
                    <i className="fa fa-caret-down" aria-hidden="true"></i>
                </span>

                    <div className={this.state.orderListIsOpen ? '' : 'hide'}>
                        {
                            this.props.orderList.length !== 0
                                ? this.props.orderList.map((orderInfo) => (
                                    <div className={'order-list__item'} key={orderInfo.id}>
                                        <h4>Заказ {orderInfo.id}</h4>
                                        <ul>
                                            <li className={'mb-15'}>Откуда: {orderInfo.name}</li>
                                            <li className={'mb-15'}>Состояние: {orderInfo.description}</li>
                                            <li className={'mb-15'}>Время начала заказа:
                                                {orderInfo.startTime.split(' ').slice(1, 5).join(' ')}
                                            </li>
                                            {
                                                orderInfo.status > 4
                                                    ?
                                                    <li>
                                                        Время завершения: {orderInfo.endTime.split(' ').slice(1, 5).join(' ')}
                                                    </li>
                                                    : null
                                            }
                                        </ul>
                                        <span className={'order-list__unwrapping-list mb-15'}
                                              onClick={this.interactionWithProductList}>
                                                {this.state.productListIsOpen
                                                    ? 'Скрыть подробности заказа'
                                                    : 'Показать подробности заказа'}
                                                <i className="fa fa-caret-down" aria-hidden="true"></i>
                                            </span>
                                        <div className={this.state.productListIsOpen ? '' : 'hide'}>
                                            {
                                                orderInfo.order.map((product) => (
                                                    <div key={product.id} className={'order-list__unwrapping-item'}>
                                                        <ul className={'order-list__product-list'}>
                                                            <li>{product.name}</li>
                                                            <li>{product.quantity}</li>
                                                            <li>{product.price}</li>
                                                            <li>{product.description}</li>
                                                        </ul>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        {
                                            this.props.type === 'active'
                                            ?
                                                <div className="button-section mt-30">
                                                    <button
                                                        className={`main-item-style mr-15 ${
                                                            orderInfo.status > 1 ?  'non-click' : ''
                                                        }`}
                                                        onClick={this.props.openForm}>
                                                        Редактировать заказ
                                                    </button>
                                                    <button
                                                        className={'main-item-style main-item-style_danger'}
                                                        onClick={()=>this.props.cancelOrder(orderInfo)}>
                                                        Отменить заказ
                                                    </button>
                                                </div>
                                                : null
                                        }

                                    </div>
                                ))
                                : <>
                                    <span>У вас ещё нет {this.props.description}:(</span>
                                </>
                        }
                    </div>
                </div>
            </>
        )
    }
}