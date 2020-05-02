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

    // type - тип списка
    // active-user/finish-user - для пользователя
    // active-courier/finish-courier - для курьера
    // admin - универсальный для админа
    renderTitle = () => {
        return (
            <>
                <h4 className={'mb-15'}>Заказ {this.props.orderInfo.id}</h4>
                {
                    this.props.type === 'finish-user'
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
            </>
        )
    }

    renderBody = () => {
        return (
            <>
                <ul>
                    <li className={'mb-15'}>Откуда: {this.props.orderInfo.name}</li>
                    <li className={'mb-15'}>Адресс доставки: {this.props.orderInfo.clientAddress}</li>
                    {
                        this.props.type === 'active-courier' || this.props.type === 'finish-courier' || this.props.type === 'admin'
                            ? <>
                                <li className={'mb-15'}>Имя клиента: {this.props.orderInfo.name}</li>
                                <li className={'mb-15'}>Контактный телефон: {this.props.orderInfo.clientNumberPhone}</li>
                            </>
                            : null
                    }
                    {
                        this.props.type === 'active-user' || this.props.type === 'finish-user' || this.props.type === 'admin'
                            ? <>
                                <li className={'mb-15'}>Состояние: {this.props.orderInfo.description}</li>
                            </>
                            : null
                    }
                    <li className={'mb-15'}>Время начала заказа:{this.props.orderInfo.startTime}</li>
                    {
                        this.props.orderInfo.endTime !== ''
                            ?
                            <li className={'mb-15'}>Время окончания заказа: {this.props.orderInfo.endTime}</li>
                            : null
                    }
                    {
                        this.props.orderInfo.orderValue !== ''
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
                <span className={'list__unwrapping-list mb-15'} onClick={this.interactionWithProductList}>
                    {
                        this.state.productListIsOpen
                            ? 'Скрыть заказ'
                            : 'Показать заказ'
                    }
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
                                            this.props.orderInfo.orderValue !== ''
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
            </>
        )
    }

    renderButtonSection = () => {
        return (
            <>
                {
                    this.props.type === 'active-user'
                        ?
                        <div className="button-section mt-30">
                            <button
                                className={`main-item-style mr-15 ${this.props.orderInfo.orderValue !== ''
                                    ? 'non-click'
                                    : ''}`}
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
                {
                    this.props.type === 'active-courier'
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
                        : null
                }
                {
                    this.props.type === 'admin'
                        ?
                        <>
                        </>
                        : null
                }
            </>
        )
    }

    render() {
        return (
            <div className={'list__item'}>
                <div className="list__title">
                    {
                        this.renderTitle()
                    }
                </div>
                <div className="list__body">
                    {
                        this.renderBody()
                    }
                    {
                        this.renderButtonSection()
                    }
                </div>
            </div>
        )
    }
}