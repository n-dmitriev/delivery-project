import React, {Component} from 'react'
import './CourierPanel.scss'
import Order from './Order'

export default class CourierPanel extends Component {
    constructor(props) {
        super(props)
        this.courierPosition = React.createRef()
        this.state = {
            listIsOpen: false,
            positionIsValid: true,
            position: '',
            orderIsOpen: false,
        }
    }

    interactWithOrder = () => {
        this.setState({
            orderIsOpen: !this.state.orderIsOpen,
        })
    }

    interactionWithList = async () => {
        if (this.courierPosition.current.value.replace(/\s+/g, '') === '')
            this.setState({
                positionIsValid: false,
            })
        else {
            this.setState({
                position: this.courierPosition.current.value,
                listIsOpen: !this.state.listIsOpen,
                positionIsValid: true,
            })
            await this.props.fetchActiveOrders()
            !this.state.listIsOpen ? this.props.subscribeUsers(false) : this.props.subscribeUsers(true)
        }
    }


    renderOrdersList = () => {
        return (
            <>
                <div className="courier-panel__title">
                    <div className={!this.state.listIsOpen ? 'courier-panel__title_input' : 'hide'}>
                        <input placeholder={'Укажите ваше местоположение'}
                               defaultValue={this.state.position}
                               className={!this.state.positionIsValid ? 'input-error mb-15' : 'mb-15'} type="text"
                               ref={this.courierPosition}/>
                        <small
                            className={this.state.newPasswordIsValid && this.state.oldPasswordIsValid ? 'hide' : 'error mb-15'}>
                            {!this.state.positionIsValid ? <>Ваше местоположение не может быть пустым!</> : null}
                        </small>
                        <div className="button-section">
                            <button className="main-item-style" onClick={this.interactionWithList}>
                                Загрузить список заказов по близости
                            </button>
                        </div>
                    </div>

                    <div className={!this.state.listIsOpen ? 'hide' : 'courier-panel__title_edit'}
                         onClick={this.interactionWithList}
                    >
                        <span>{this.state.position}</span>
                        <i className="fa fa-pencil-square-o" aria-hidden="true"/>
                    </div>
                </div>

                <div className={this.state.listIsOpen ? 'courier-panel__content' : 'hide'}>
                    {
                        this.props.ordersList.length > 0
                            ? this.props.ordersList.map((orderInfo) => (
                                <div key={orderInfo.id}>
                                    <Order orderInfo={orderInfo}
                                           changeOrderData={this.props.changeOrderData}
                                    />
                                </div>
                            ))
                            : <>
                                <span>Оу, здесь пусто :(</span>
                            </>
                    }
                </div>
            </>
        )
    }

    interactWithCheckBox = (e) => {

    }

    renderDeliveredOrder = () => {
        return (
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
                                                            type="checkbox" id="checkbox" name="todo"/>
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
                        <button className="main-item-style mr-15" onClick={() => {
                            this.props.changeOrderData(2, this.props.deliveredOrder)
                        }}>
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


    render() {
        return (
            <>
                {
                    !this.props.loading
                        ?
                        <div className={'courier-panel'}>
                            {
                                Object.keys(this.props.deliveredOrder).length > 0
                                    ? this.renderDeliveredOrder()
                                    : this.renderOrdersList()
                            }
                        </div>
                        :
                        <div className="lds-ellipsis">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                }
            </>
        )
    }
}

// <div className={'dropdown'}>
//
//     <div className="dropdown__content">
//         <span className={'dropdown__item'}>Купил</span>
//         <span className={'dropdown__item'}>Нет в наличии</span>
//     </div>
// </div>

/*<div class="holder">
  <div class="preloader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
</div>*/