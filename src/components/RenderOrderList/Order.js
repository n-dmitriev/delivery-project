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
            <>
                <div className="list__title">
                    <h4 className={'mb-15'}>Заказ {this.props.orderInfo.id}</h4>
                    {
                        this.props.type === 'finish'
                            ?
                            <i className="fa fa-refresh fa-animate" aria-hidden="true"
                               onClick={() => {
                                   this.props.orderАgain(this.props.orderInfo)
                                   toaster.notify('Заказ возобновлён!', {
                                       position: 'bottom-right',
                                       duration: 3000,
                                   })
                               }}
                            />
                            : null
                    }
                </div>
                <ul>
                    <li className={'mb-15'}>Откуда: {this.props.orderInfo.name}</li>
                    <li className={'mb-15'}>Состояние: {this.props.orderInfo.description}</li>
                    <li className={'mb-15'}>Время начала заказа:{this.props.orderInfo.startTime}</li>
                    {
                        this.props.type === 'finish'
                            ?
                            <li className={'mb-15'}>Время завершения: {this.props.orderInfo.endTime}</li>
                            : null
                    }
                    {
                        this.props.orderInfo.orderValue
                            ?
                            <>
                                <li className={'mb-15'}>Стоимость заказа: {this.props.orderInfo.orderValue} ₽</li>
                                <li className={'mb-15'}>Стоимость доставки: {this.props.orderInfo.deliveryValue} ₽</li>
                                <li className={'mb-15'}>
                                    <b>Итого: {parseInt(this.props.orderInfo.deliveryValue) + parseInt(this.props.orderInfo.orderValue)} ₽</b>
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
                        this.props.orderInfo.order && this.props.orderInfo.order.length > 0
                            ?
                            this.props.orderInfo.order.map((product) => (
                                <div key={product.id} className={'list__unwrapping-item'}>
                                    <ul className={'list__product-list'}>
                                        <li>{product.name}</li>
                                        {
                                            product.brand !== undefined ? <li>{product.brand}</li> : ''
                                        }
                                        <li>{product.quantity}</li>
                                        <li>{product.price}</li>
                                        <li>{product.description}</li>
                                    </ul>
                                    <div className={'list__checkbox'}>
                                        {
                                            this.props.orderInfo.orderValue
                                                ?
                                                product.purchased
                                                    ? <i className="fa fa-check-square-o" aria-hidden="true"/>
                                                    : <i className="fa fa-times" aria-hidden="true"/>
                                                :
                                                <i className="fa fa-square-o" aria-hidden="true"/>
                                        }
                                    </div>
                                </div>
                            ))
                            :
                            <span>Ваш заказ пуст! :(</span>
                    }
                </div>
                {
                    this.props.type === 'active'
                        ?
                        <div className="button-section mt-30">
                            <button
                                className={`main-item-style mr-15 ${
                                    this.props.type === 'finish' ? 'non-click' : ''
                                }`}
                                onClick={() => this.props.setEditItem(this.props.orderInfo)}>
                                Редактировать
                            </button>
                            <button
                                className={'main-item-style main-item-style_danger'}
                                onClick={() => {
                                    this.props.cancelOrder(this.props.orderInfo.id)
                                    toaster.notify('Заказ отменён!', {
                                        position: 'bottom-right',
                                        duration: 3000,
                                    })
                                }}>
                                Отменить
                            </button>
                        </div>
                        : null
                }
            </>
        )
    }
}