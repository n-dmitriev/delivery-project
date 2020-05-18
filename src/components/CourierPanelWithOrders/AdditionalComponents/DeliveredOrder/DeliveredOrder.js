import React, {Component} from 'react'
import toaster from 'toasted-notes'
import DeliveredItem from './DeliveredItem'

export default class DeliveredOrder extends Component {
    state = {
        positionIsValid: true,
        quantityIsValid: true,
        orderIsOpen: false,
    }

    interactWithOrder = (e) => {
        e.preventDefault()
        this.setState({
            orderIsOpen: !this.state.orderIsOpen,
        })
        this.props.subscribeOrderInfo(!this.state.orderIsOpen, this.props.ordersList[0].id)
    }

    finishBuy = () => {
        const orderList = this.props.ordersList[0].order
        let counter = 0
        for (let item of orderList) {
            if (item.purchased)
                counter++
        }
        if (counter / orderList.length < 0.6) {
            this.setState({
                quantityIsValid: false,
            })
            toaster.notify('Преобретите как минимум 60% товаров!', {
                position: 'bottom-right',
                duration: 3000,
            })
        } else {
            this.setState({
                quantityIsValid: true,
            })
            this.props.changeOrderData(2, this.props.ordersList[0])
            toaster.notify('Заказ переведён в состояние "доставка"!', {
                position: 'bottom-right',
                duration: 3000,
            })
        }
    }

    render() {
        const deliveredOrder = this.props.ordersList[0]
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
                                                   <DeliveredItem product={product} interactWithPurchased={this.props.interactWithPurchased}/>
                                               </div>
                                            )
                                            :
                                            <span>Оу заказ пуст!:(</span>
                                    }
                                    <small className={this.state.quantityIsValid ? 'hide' : 'error mb-15'}>
                                        Преобретите как минимум 60% товаров, иначе откажитесь от заказа!
                                    </small>
                                </div>
                                :
                                <>
                                    {this.props.renderOrderInfo(deliveredOrder)}
                                </>
                        }
                        <div className="button-section button-section_bottom">
                            <button className="main-item-style mr-15" onClick={this.finishBuy}>
                                Закончить закупку
                            </button>
                            <button className="main-item-style main-item-style_danger" onClick={() => {
                                toaster.notify('Заказ отменён!', {
                                    position: 'bottom-right',
                                    duration: 3000,
                                })
                                this.props.changeOrderData(0, deliveredOrder)
                            }}>
                                Отказаться
                            </button>
                        </div>
                    </div>
                </div>
            )
        else return null
    }
}