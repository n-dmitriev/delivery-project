import React, {Component} from 'react'

export default class DeliveredOrder extends Component {
    state = {

    }




    render(){
        return(
            <div className={'courier-panel__delivered'}>
                <div
                    onClick={this.interactWithOrder}
                    className={'courier-panel__delivered-title'}>
                    <h5>Текущий заказ {this.props.deliveredOrder.orderInfo.id}</h5>
                    {
                        this.state.orderIsOpen
                            ?
                            <span>
                                    <i className="fa fa-arrow-left" aria-hidden="true"/>
                                    Вернуться к информации
                                </span>
                            :
                            <span>
                                    Перейти к заказу
                                    <i className="fa fa-arrow-right" aria-hidden="true"/>
                                </span>
                    }
                </div>
                <br/>
                <div className={'courier-panel__delivered-content'}>
                    {
                        this.state.orderIsOpen
                            ? <div className={'courier-panel__delivered-content_scroll'}>
                                {
                                    this.props.deliveredOrder.orderInfo.order.length > 0
                                        ?
                                        this.props.deliveredOrder.orderInfo.order.map((product) => {
                                            const item = `${product.name} ${product.brand !== undefined ? product.brand : ''} 
                                                ${product.quantity} ${product.price} ${product.description}`
                                            return (
                                                <div className="courier-panel__item" key={product.id}>
                                                    <div className={'checkbox'}>
                                                        <input
                                                            onClick={this.interactWithCheckBox}
                                                            defaultChecked={product.chosen === true ? 'checked' : ''}
                                                            type="checkbox" id={product.id} name="todo"/>
                                                        <label htmlFor="todo" data-content={item}>
                                                            {item}
                                                        </label>
                                                    </div>
                                                </div>
                                            )
                                        })
                                        :
                                        <span>Оу заказ пуст!:(</span>
                                }
                            </div>
                            :
                            <ul className={'courier-panel__delivered-info'}>
                                <li className={'mb-15'}>Откуда: {this.props.deliveredOrder.orderInfo.name}</li>
                                <li className={'mb-15'}>Адресс доставки: {this.props.deliveredOrder.address}</li>
                                <li className={'mb-15'}>Имя клиента: {this.props.deliveredOrder.name}</li>
                                <li className={'mb-15'}>Контактный телефон: {this.props.deliveredOrder.numberPhone}</li>
                                <li className={'mb-15'}>Время начала
                                    заказа: {this.props.deliveredOrder.orderInfo.startTime.split(' ').slice(1, 5).join(' ')}
                                </li>
                            </ul>
                    }
                    <div className="button-section button-section_bottom">
                        <button className="main-item-style mr-15" onClick={this.finishBuy}>
                            Закончить закупку
                        </button>
                        <button className="main-item-style main-item-style_danger" onClick={() => {
                            this.props.changeOrderData(4, this.props.deliveredOrder)
                        }}>
                            Отказаться от заказа
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}