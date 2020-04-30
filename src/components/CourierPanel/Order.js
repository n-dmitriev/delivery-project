import React, {Component} from 'react'
import toaster from 'toasted-notes'

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
            <div className={'list__item'}>
                <h4 className={'mb-15'}>Заказ {this.props.orderInfo.orderItem.id}</h4>
                <ul>
                    <li className={'mb-15'}>Откуда: {this.props.orderInfo.orderItem.name}</li>
                    <li className={'mb-15'}>Адресс доставки: {this.props.orderInfo.address}</li>
                    <li className={'mb-15'}>Имя клиента: {this.props.orderInfo.name}</li>
                    <li className={'mb-15'}>Контактный телефон: {this.props.orderInfo.numberPhone}</li>
                    <li className={'mb-15'}>Время начала заказа: {this.props.orderInfo.orderItem.startTime}</li>
                    {
                        this.props.type === 'finish'
                            ?
                            <>
                                <li className={'mb-15'}>Время окончания
                                    заказа: {this.props.orderInfo.orderItem.endTime}</li>
                                <li className={'mb-15'}>Стоимость
                                    заказа: {this.props.orderInfo.orderItem.orderValue} ₽
                                </li>
                                <li className={'mb-15'}>Стоимость
                                    доставки: {this.props.orderInfo.orderItem.deliveryValue} ₽
                                </li>
                                <li className={'mb-15'}>
                                    <b>Итого: {parseInt(this.props.orderInfo.orderItem.deliveryValue) + parseInt(this.props.orderInfo.orderItem.orderValue)} ₽</b>
                                </li>
                            </>
                            : null
                    }
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
                        this.props.orderInfo.orderItem.order.length > 0
                            ?
                            this.props.orderInfo.orderItem.order.map((product) => (
                                <div key={product.id} className={'list__unwrapping-item'}>
                                    <ul className={'list__product-list'}>
                                        <li>{product.name}</li>
                                        {
                                            product.brand !== undefined ? <li>{product.brand}</li> : null
                                        }
                                        <li>{product.quantity}</li>
                                        <li>{product.price}</li>
                                        <li>{product.description}</li>
                                    </ul>
                                    <div className={'list__checkbox'}>
                                        {
                                            product.purchased
                                                ? <i className="fa fa-check-square-o" aria-hidden="true"/>
                                                : <i className="fa fa-times" aria-hidden="true"/>
                                        }
                                    </div>
                                </div>
                            ))
                            :
                            <span>Заказ пуст!:(</span>
                    }
                </div>
                {
                    this.props.type === 'active'
                        ? <div className="button-section mt-30">
                            <button
                                className={`main-item-style mr-15`}
                                onClick={() => {
                                    this.props.changeOrderData(1, {
                                        uid: this.props.orderInfo.id,
                                        ...this.props.orderInfo,
                                    })
                                    toaster.notify('Вы приняли заказ!', {
                                        position: 'bottom-right',
                                        duration: null,
                                    })
                                }}>
                                Взять
                            </button>
                            <button
                                className={`main-item-style main-item-style_danger`}
                                onClick={() => {
                                    this.props.changeOrderData(-1, {
                                        uid: this.props.orderInfo.id,
                                        ...this.props.orderInfo,
                                    })
                                    toaster.notify('Заказ скрыт!', {
                                        position: 'bottom-right',
                                        duration: 3000,
                                    })
                                }}>
                                Тролль!
                            </button>
                        </div>
                        : this.props.type === 'all'
                        ?
                        <>
                        </>
                        : null
                }

            </div>
        )
    }
}