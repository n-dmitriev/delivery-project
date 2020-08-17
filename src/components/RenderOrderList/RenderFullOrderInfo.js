import React from 'react'
import ProgressBar from '../UI/ProgressBar/ProgressBar'
import {getDate} from '../../store/universalFunctions'
import Item from './Item'

const RenderFullOrderInfo = props => {
    const orderInfo = props.orderInfo
    return (
        <div>
            <ul>
                {
                    props.type === 'user'
                        ? <>
                            <li className={'mb-2'}>{orderInfo.description}</li>
                            <li className={'mb-15'}>
                                <ProgressBar status={orderInfo.status}/>
                            </li>
                        </>
                        : null
                }
                <li className={'mb-15'}>Откуда: {orderInfo.name}</li>
                <li className={'mb-15'}>Тип заведения: {orderInfo.type}</li>
                <li className={'mb-15'}>Адресс доставки: {orderInfo.clientAddress}</li>
                <li className={'mb-15'}>Имя: {orderInfo.clientName}</li>
                <li className={'mb-15'}>Контактный телефон: {orderInfo.clientNumberPhone}</li>
                {
                    orderInfo.startTime && orderInfo.startTime !== ''
                        ?
                        <li className={'mb-15'}>Время начала заказа: {getDate(orderInfo.startTime)}</li>
                        : null
                }
                {
                    orderInfo.endTime && orderInfo.endTime !== ''
                        ?
                        <li className={'mb-15'}>Время окончания заказа: {getDate(orderInfo.endTime)}</li>
                        : null
                }
                <li className={'mb-15'}>Стоимость доставки: {orderInfo.deliveryValue} ₽</li>
                {
                    orderInfo.orderValue
                        ?
                        <>
                            <li className={'mb-15'}>Стоимость заказа: {orderInfo.orderValue} ₽</li>
                            <li className={'mb-15'}>
                                <b>Итого: {parseInt(orderInfo.deliveryValue) + parseInt(orderInfo.orderValue)} ₽</b>
                            </li>
                        </>
                        : null
                }
            </ul>

            {
                props.type === 'user' || props.type === 'order'
                    ?
                    <>
                        <h4 className={'mb-3'}>Заказ</h4>
                        <div className={'mb-4'}>
                            {
                                orderInfo.order && orderInfo.order.length > 0
                                    ?
                                    orderInfo.order.map((product) => (
                                        <div key={product.id}>
                                            <Item product={product} status={orderInfo.status}/>
                                        </div>
                                    ))
                                    :
                                    <span>Ваш заказ пуст! :(</span>
                            }
                        </div>
                    </>
                    : null
            }
        </div>
    )
}

export default RenderFullOrderInfo