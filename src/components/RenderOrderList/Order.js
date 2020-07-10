import React, {Component} from 'react'
import toaster from 'toasted-notes'
import Item from './Item'
import {confirm} from '../UI/Confirm/Confirm'
import {Progress} from 'react-sweet-progress'
import Tooltip from "react-tooltip-lite"

export default class Order extends Component {
    state = {
        productListIsOpen: false
    }

    interactionWithProductList = () => {
        this.setState({
            productListIsOpen: !this.state.productListIsOpen
        })
    }

    reOrder = () => {
        confirm(
            'возобновить заказ', async () => {
                await this.props.reOrder(this.props.orderInfo)
                setTimeout(() => {
                    this.props.setEditItem(this.props.orderInfo)
                    toaster.notify('Заказ возобновлён!', {
                        position: 'bottom-right',
                        duration: 3000
                    })
                }, 300)
            }
        )
    }

    takeOrder = () => {
        confirm('взять заказ', () => {
            this.props.changeOrderData(1, {
                uid: this.props.orderInfo.id,
                ...this.props.orderInfo
            })
            toaster.notify('Вы приняли заказ!', {
                position: 'bottom-right',
                duration: 3000
            })
        })
    }

    cancelOrder = () => {
        confirm('отменить заказ',
            () => {
                this.props.cancelOrder(this.props.orderInfo.id)
                toaster.notify('Заказ отменён!', {
                    position: 'bottom-right',
                    duration: 3000
                })
            })
    }

    troll = () => {
        confirm(
            'пометить заказ как "ложный"',
            () => {
                this.props.changeOrderData(-1, {
                    uid: this.props.orderInfo.id,
                    ...this.props.orderInfo
                })
                toaster.notify('Заказ скрыт!', {
                    position: 'bottom-right',
                    duration: 3000
                })
            }
        )
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
                           onClick={this.reOrder}/>
                        : null
                }
            </>
        )
    }

    renderProgressBar = () => {
        let percent, status, theme

        switch (this.props.orderInfo.status) {
            case -1:
                percent = 100
                status = 'error'
                theme = {
                    error: {
                        symbol: '🤔',
                        color: '#fbc630'
                    }
                }
                break
            case 0:
                percent = 10
                status = ''
                theme = {}
                break
            case 1:
                percent = 30
                status = ''
                theme = {}
                break
            case 2:
                percent = 70
                status = ''
                theme = {}
                break
            case 3:
                percent = 100
                status = 'success'
                theme = {}
                break
            case 4:
                percent = 100
                status = 'error'
                theme = {}
                break
            default:
                percent = 0
                status = ''
                theme = {}
                break
        }

        return (
            <Progress percent={percent} status={status} theme={theme}/>
        )
    }

    renderBody = () => {
        return (
            <>
                <ul>
                    {
                        this.props.type === 'active-user' || this.props.type === 'finish-user' || this.props.type === 'admin'
                            ? <>
                                <li className={'mb-15'}>Состояние: {this.props.orderInfo.description}</li>
                                <li className={'mb-15'}>
                                    {this.renderProgressBar()}
                                </li>
                            </>
                            : null
                    }
                    {
                        this.props.type === 'active-courier'
                            ? <>
                                <li className={'mb-15'}>Расстояние: <b>{Math.round(this.props.orderInfo.distance)} км</b>
                                </li>
                            </>
                            : null
                    }
                    <li className={'mb-15'}>Откуда: {this.props.orderInfo.name}</li>
                    <li className={'mb-15'}>Адресс доставки: {this.props.orderInfo.clientAddress}</li>
                    {
                        this.props.type === 'active-courier' || this.props.type === 'finish-courier' || this.props.type === 'admin'
                            ? <>
                                <li className={'mb-15'}>Имя клиента: {this.props.orderInfo.clientName}</li>
                                <li className={'mb-15'}>Контактный телефон: {this.props.orderInfo.clientNumberPhone}</li>
                            </>
                            : null
                    }
                    <li className={'mb-15'}>Время начала заказа: {this.props.orderInfo.startTime}</li>
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
                    <i className={`fa fa-caret-${this.state.productListIsOpen ? 'up' : 'down'}`} aria-hidden="true"/>
                </span>
                <div className={this.state.productListIsOpen ? '' : 'hide'}>
                    {
                        this.props.orderInfo.order && this.props.orderInfo.order.length > 0
                            ?
                            this.props.orderInfo.order.map((product) => (
                                <div key={product.id}>
                                    <Item product={product} status={this.props.orderInfo.status}/>
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
                            {
                                this.props.orderInfo.status >= 2
                                ? <Tooltip
                                        content={'Эот заказ нельзя редактировать!'}
                                        direction="up"
                                        tagName="span"
                                        className="target"
                                        useDefaultStyles
                                    >
                                        <button className={`main-item-style mr-15 non-click`}>
                                            Редактировать
                                        </button>
                                    </Tooltip>
                                    :  <button
                                        className={`main-item-style mr-15`}
                                        onClick={() => this.props.setEditItem(this.props.orderInfo)}>
                                        Редактировать
                                    </button>
                            }
                            <button
                                className={'main-item-style main-item-style_danger'}
                                onClick={this.cancelOrder}>
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
                                onClick={this.takeOrder}>
                                Взять
                            </button>
                            <button
                                className={`main-item-style main-item-style_danger`}
                                onClick={this.troll}>
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