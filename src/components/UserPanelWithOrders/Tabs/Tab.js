import React, {Component} from 'react'
import toaster from 'toasted-notes'
import {confirm} from '../../UI/Confirm/Confirm'
import Tooltip from 'react-tooltip-lite'
import {NavLink} from 'react-router-dom'
import ProgressBar from '../../UI/ProgressBar/ProgressBar'
import {getDate} from '../../../store/universalFunctions'

export default class Tab extends Component {
    reOrder = (e) => {
        e.preventDefault()
        confirm(
            'возобновить заказ', async () => {
                await this.props.reOrder(this.props.orderInfo)
                toaster.notify('Заказ возобновлён!', {
                    position: 'bottom-right',
                    duration: 3000
                })
            }
        )
    }

    // type - тип списка
    // active-user/finish-user - для пользователя
    renderTitle = () => {
        return (
            <>
                <h4 className={'mb-15'}>Заказ {this.props.orderInfo.id}</h4>
                {
                    this.props.type === 'finish-user'
                        ?
                        <Tooltip
                            content={'Возобновить заказ'}
                            direction="up"
                            tagName="span"
                            className="target"
                            useDefaultStyles
                        >
                            <i className="fa fa-refresh fa-animate" aria-hidden="true"
                               onClick={this.reOrder}/>
                        </Tooltip>
                        : null
                }
            </>
        )
    }


    renderBody = () => {
        return (
            <ul>
                <li><b>{this.props.orderInfo.description}</b></li>
                <li className={'mb-15'}>
                    <ProgressBar status={this.props.orderInfo.status}/>
                </li>
                <li className={'mb-15'}>Откуда: {this.props.orderInfo.name}</li>
                <li className={'mb-15'}>Адресс доставки: {this.props.orderInfo.clientAddress}</li>
                <li className={'mb-15'}>Время начала заказа: {getDate(this.props.orderInfo.startTime)}</li>
                {
                    this.props.orderInfo.endTime !== ''
                        ?
                        <li className={'mb-15'}>Время окончания заказа: {getDate(this.props.orderInfo.endTime)}</li>
                        : null
                }
                <li className={'mb-15'}>Стоимость доставки: {this.props.orderInfo.deliveryValue} ₽</li>
                {
                    this.props.orderInfo.orderValue !== ''
                        ?
                        <>
                            <li className={'mb-15'}>Стоимость заказа: {this.props.orderInfo.orderValue} ₽</li>
                            <li className={'mb-15'}>
                                <b>Итого: {parseInt(this.props.orderInfo.deliveryValue) + parseInt(this.props.orderInfo.orderValue)} ₽</b>
                            </li>
                        </>
                        : null
                }
            </ul>
        )
    }

    render() {
        let color = ''
        switch (this.props.orderInfo.status) {
            case -1:
                color = 'yellow'
                break
            case 0 || 1 || 2:
                color = 'blue'
                break
            case 3:
                color = 'green'
                break
            case 4:
                color = 'red'
                break
            case 5:
                color = 'red'
                break
            default:
                color = 'blue'
                break
        }
        return (
            <NavLink to={`/order/${this.props.orderInfo.id}?${this.props.type}`}>
                <div className={`tab__item tab__item_${color}`}>
                    <div className="tab__title">
                        {
                            this.renderTitle()
                        }
                    </div>
                    <div className="tab__body">
                        {
                            this.renderBody()
                        }
                    </div>
                </div>
            </NavLink>
        )
    }
}