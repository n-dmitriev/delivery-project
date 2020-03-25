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
                <span className={'order-list__unwrapping-list'}
                      onClick={this.interactionWithOrderList}>
                    Список {this.props.description}
                    <i className="fa fa-caret-down" aria-hidden="true"></i>
                </span>

                    <div className={this.state.orderListIsOpen ? '' : 'hide'}>
                        {
                            this.props.orderList.length !== 0
                                ? this.props.orderList.map((orderInfo) => (
                                    <div className={'order-list__item'} key={orderInfo.id}>
                                        <h4>Заказ {orderInfo.id}</h4>
                                        <ul>
                                            <li>Откуда: {orderInfo.name}</li>
                                            <li>Состояние: {orderInfo.description}</li>
                                            <li>Время заказа:
                                                {orderInfo.startTime.split(' ').slice(1, 5).join(' ')}
                                            </li>
                                            {
                                                orderInfo.delivered
                                                    ?
                                                    <li>
                                                        Время
                                                        достававки: {orderInfo.endTime.split(' ').slice(1, 5).join(' ')}
                                                    </li>
                                                    : null
                                            }
                                        </ul>
                                        <span className={'order-list__unwrapping-list'}
                                              onClick={this.interactionWithProductList}>
                                                Показать подробности заказа
                                                <i className="fa fa-caret-down" aria-hidden="true"></i>
                                            </span>
                                        <div className={this.state.productListIsOpen ? '' : 'hide'}>
                                            {
                                                orderInfo.order.map((product) => (
                                                    <div key={product.id} className={'order-list__unwrapping-item'}>
                                                        <ul>
                                                            <li>{product.name}</li>
                                                            <li>{product.quantity}</li>
                                                            <li>{product.price}</li>
                                                            <li>{product.description}</li>
                                                        </ul>
                                                    </div>
                                                ))
                                            }
                                        </div>
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