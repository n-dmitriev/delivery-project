import React, {Component} from 'react'
import toaster from 'toasted-notes'
import DeliveredItem from './DeliveredItem'
import {confirm} from '../../../UI/Confirm/Confirm'

export default class DeliveredOrder extends Component {
    state = {
        positionIsValid: true,
        quantityIsValid: true,
        orderIsOpen: false
    }


    interactWithOrder = (e) => {
        e.preventDefault()
        this.setState({
            orderIsOpen: !this.state.orderIsOpen
        })
    }

    finishBuy = () => {
        const orderList = this.props.orderInfo.order
        let counter = 0
        for (let item of orderList) {
            if (item.purchased)
                counter++
        }
        if (counter / orderList.length < 0.6) {
            this.setState({
                quantityIsValid: false
            })
            toaster.notify('Преобретите как минимум 60% товаров!', {
                position: 'bottom-right',
                duration: 3000
            })
        } else {
            confirm(
                'закончить закупку', async () => {
                    this.setState({
                        quantityIsValid: true
                    })
                    this.props.changeOrderData(2, this.props.orderInfo)
                    toaster.notify('Заказ переведён в состояние "доставка"!', {
                        position: 'bottom-right',
                        duration: 3000
                    })
                }
            )
        }
    }

    cancel = (deliveredOrder) => {
        confirm(
            'отказаться от заказа', async () => {
                toaster.notify('Заказ отменён!', {
                    position: 'bottom-right',
                    duration: 3000
                })
                this.props.changeOrderData(0, deliveredOrder)
            }
        )
    }

    render() {
        const deliveredOrder = this.props.orderInfo
        if (deliveredOrder)
            return (
                <div className={'courier-panel__delivered'}>
                    <div
                        onClick={this.interactWithOrder}
                        className={'courier-panel__delivered-title'}>
                        <h5>Текущий заказ {deliveredOrder.id}</h5>
                        {
                            this.state.orderIsOpen
                                ?
                                <span>
                                        <i className="fa fa-arrow-left fa-animate" aria-hidden="true"/>
                                        Вернуться к информации
                                    </span>
                                :
                                <span>
                                        Перейти к заказу
                                        <i className="fa fa-arrow-right fa-animate" aria-hidden="true"/>
                                    </span>
                        }
                    </div>
                    <br/>
                    <div className={'courier-panel__delivered-content'}>
                        {
                            this.state.orderIsOpen
                                ?
                                <div className={'courier-panel__delivered-content_scroll'}>
                                    {
                                        deliveredOrder.order.length > 0
                                            ?
                                            deliveredOrder.order.map((product) =>
                                                <div key={product.id}>
                                                    <DeliveredItem product={product}
                                                                   interactWithPurchased={this.props.interactWithPurchased}/>
                                                </div>
                                            )
                                            :
                                            <span>Оу заказ пуст!:(</span>
                                    }
                                </div>
                                :
                                <>
                                    {this.props.renderOrderInfo(deliveredOrder)}
                                </>
                        }
                        <small className={this.state.quantityIsValid ? 'hide' : 'error mb-15'}>
                            Преобретите как минимум 60% товаров или откажитесь от заказа!
                        </small>
                    </div>
                    <div className="button-section button-section_bottom">
                        <button className="main-item-style mr-15" onClick={this.finishBuy}>
                            Закончить закупку
                        </button>
                        <button className="main-item-style main-item-style_danger"
                                onClick={() => this.cancel(deliveredOrder)}>
                            Отказаться
                        </button>
                    </div>
                </div>
            )
        else return null
    }
}