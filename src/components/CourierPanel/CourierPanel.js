import React, {Component} from 'react'import './CourierPanel.scss'import Order from './Order'export default class CourierPanel extends Component {    constructor(props) {        super(props)        this.courierPosition = React.createRef()        this.orderValue = React.createRef()        this.check = React.createRef()        this.state = {            position: '',            value: '',            valueIsValid: true,            positionIsValid: true,            quantityIsValid: true,            checkIsValid: true,            listIsOpen: false,            orderIsOpen: false,        }    }    interactWithOrder = (e) => {        e.preventDefault()        this.setState({            orderIsOpen: !this.state.orderIsOpen,        })        this.props.subscribeOrderInfo(!this.state.orderIsOpen, this.props.ordersList[0].orderItem.id)    }    interactWithCheckBox = (e) => {        this.props.interactWithPurchased(e.target.id, e.target.checked)    }    finishBuy = () => {        const orderList = this.props.ordersList[0].orderItem.order        let counter = 0        for (let item of orderList) {            if (item.purchased)                counter++        }        if (counter / orderList.length < 0.6) {            this.setState({                quantityIsValid: false,            })        } else {            this.setState({                quantityIsValid: true,            })            this.props.changeOrderData(2, this.props.ordersList[0])        }    }    finishOrder = () => {        this.props.changeOrderData(3, this.props.ordersList[0])    }    interactionWithList = async () => {        if (this.courierPosition.current.value.replace(/\s+/g, '') === '')            this.setState({                positionIsValid: false,            })        else {            this.setState({                position: this.courierPosition.current.value,                listIsOpen: !this.state.listIsOpen,                positionIsValid: true,            })            await this.props.fetchOrderList('active', 'courierId', '', [0])            this.props.subscribeUsers(!this.state.listIsOpen, 'active', 'courierId', '', [0])        }    }    calculateThePrice = async () => {        await this.setState({            positionIsValid: this.courierPosition.current.value.replace(/\s+/g, '') !== '',            valueIsValid: parseInt(this.orderValue.current.value),            checkIsValid: this.check.current.checked,        })        if (this.state.positionIsValid && this.state.valueIsValid && this.state.checkIsValid) {            this.props.calculateThePrice(this.props.ordersList[0].orderItem.id, this.orderValue.current.value, this.courierPosition.current.value)        }    }    renderOrdersList = () => {        return (            <>                <div className="courier-panel__title">                    <div className={!this.state.listIsOpen ? 'courier-panel__title_input' : 'hide'}>                        <div className="form-group">                            <input                                placeholder={'Укажите ваше местоположение'}                                defaultValue={this.state.position}                                className={!this.state.positionIsValid ? 'input-error mb-15' : 'mb-15'} type="text"                                ref={this.courierPosition}                                id="dynamic-label-input-0"/>                            <label className={'label'} htmlFor="dynamic-label-input-2">Ваше местоположение</label>                            <small                                className={this.state.positionIsValid ? 'hide' : 'error mb-15'}>                                {!this.state.positionIsValid ? <>Ваше местоположение не может быть пустым!</> : null}                            </small>                        </div>                        <div className="button-section">                            <button className="main-item-style" onClick={this.interactionWithList}>                                Загрузить список заказов по близости                            </button>                        </div>                    </div>                    <div className={!this.state.listIsOpen ? 'hide' : 'courier-panel__title_edit'}                         onClick={this.interactionWithList}                    >                        <span>{this.state.position}</span>                        <i className="fa fa-pencil-square-o" aria-hidden="true"/>                    </div>                </div>                <div className={this.state.listIsOpen ? 'courier-panel__content' : 'hide'}>                    {                        this.props.ordersList.length > 0                            ? this.props.ordersList.map((orderInfo) => (                                <div key={orderInfo.orderItem.id}>                                    <Order                                        orderInfo={orderInfo}                                        changeOrderData={this.props.changeOrderData}                                    />                                </div>                            ))                            : <>                                <span>Оу, здесь пусто :(</span>                            </>                    }                </div>            </>        )    }    renderOrderInfo = (deliveredOrder) => {        return (            <ul className={'courier-panel__delivered-info'}>                <li className={'mb-15'}>Откуда: {deliveredOrder.orderItem.name}</li>                <li className={'mb-15'}>Адресс доставки: {deliveredOrder.address}</li>                <li className={'mb-15'}>Имя клиента: {deliveredOrder.name}</li>                <li className={'mb-15'}>Контактный телефон: {deliveredOrder.numberPhone}</li>                <li className={'mb-15'}>Время начала заказа: {deliveredOrder.orderItem.startTime}</li>                {                    deliveredOrder.orderItem.orderValue                        ?                            <>                                <li className={'mb-15'}>Стоимость заказа: {deliveredOrder.orderItem.orderValue} ₽</li>                                <li className={'mb-15'}>Стоимость доставки: {deliveredOrder.orderItem.deliveryValue} ₽</li>                                <li className={'mb-15'}><b>Итого: {parseInt(deliveredOrder.orderItem.deliveryValue) + parseInt(deliveredOrder.orderItem.orderValue)} ₽</b></li>                            </>                        : null                }            </ul>        )    }    renderDeliveredOrder = () => {        const deliveredOrder = this.props.ordersList[0]        if (deliveredOrder)            return (                <div className={'courier-panel__delivered'}>                    <div                        onClick={this.interactWithOrder}                        className={'courier-panel__delivered-title'}>                        <h5>Текущий заказ {deliveredOrder.orderItem.id}</h5>                        {                            this.state.orderIsOpen                                ?                                <span>                                        <i className="fa fa-arrow-left" aria-hidden="true"/>                                        Вернуться к информации                                    </span>                                :                                <span>                                        Перейти к заказу                                        <i className="fa fa-arrow-right" aria-hidden="true"/>                                    </span>                        }                    </div>                    <br/>                    <div className={'courier-panel__delivered-content'}>                        {                            this.state.orderIsOpen                                ?                                <div className={'courier-panel__delivered-content_scroll'}>                                    {                                        deliveredOrder.orderItem.order.length > 0                                            ?                                            deliveredOrder.orderItem.order.map((product) => {                                                const item = `${product.name} ${product.brand !== undefined ? product.brand : ''}                                                         ${product.quantity} ${product.price} ${product.description}`                                                return (                                                    <div className="courier-panel__item" key={product.id}>                                                        <div className={'checkbox'}>                                                            <input                                                                onClick={this.interactWithCheckBox}                                                                defaultChecked={product.purchased === true ? 'checked' : ''}                                                                type="checkbox" id={product.id} name="todo"/>                                                            <label htmlFor="todo" data-content={item}>                                                                {item}                                                            </label>                                                        </div>                                                    </div>                                                )                                            })                                            :                                            <span>Оу заказ пуст!:(</span>                                    }                                    <small className={this.state.quantityIsValid ? 'hide' : 'error mb-15'}>                                        Преобретите как минимум 60% товаров, иначе откажитесь от заказа!                                    </small>                                </div>                                :                                <>                                    {this.renderOrderInfo(deliveredOrder)}                                </>                        }                        <div className="button-section button-section_bottom">                            <button className="main-item-style mr-15" onClick={this.finishBuy}>                                Закончить закупку                            </button>                            <button className="main-item-style main-item-style_danger" onClick={() => {                                this.props.changeOrderData(0, deliveredOrder)                            }}>                                Отказаться от заказа                            </button>                        </div>                    </div>                </div>            )    }    renderDeliveryPanel = () => {        const deliveredOrder = this.props.ordersList[0]        if (deliveredOrder)            return (                <>                    <div className="courier-panel__title">                        <div className={deliveredOrder.orderItem.orderValue ? 'hide' : 'courier-panel__title_input'}>                            <div className="form-group">                                <input  placeholder={'Укажите стоимость закупки'}                                        defaultValue={this.state.value}                                        className={!this.state.valueIsValid ? 'input-error' : ''} type="text"                                        ref={this.orderValue}                                        type='number'                                        id="dynamic-label-input-1"                                />                                <label className={'label'} htmlFor="dynamic-label-input-1">Стоимость закупки</label>                                <small                                    className={this.state.valueIsValid ? 'hide' : 'error'}>                                    Цена не может быть пустой!                                </small>                            </div>                            <div className="form-group">                                <input                                    placeholder={'Укажите ваше текущее местоположение'}                                    defaultValue={this.state.position}                                    className={!this.state.positionIsValid ? 'input-error' : ''}                                    type="text"                                    ref={this.courierPosition}                                    id="dynamic-label-input-2"/>                                <label className={'label'} htmlFor="dynamic-label-input-2">Ваше текущее местоположение</label>                                <small                                    className={this.state.positionIsValid ? 'hide' : 'error'}>                                    Ваше местоположение не может быть пустым!                                </small>                            </div>                            <div className={'checkbox mb-15'}>                                <input                                    className={this.state.checkIsValid ? '' : 'checkbox_input_error'}                                    ref={this.check}                                    type="checkbox" name="todo"/>                                <label className={'checkbox__label_mini'} htmlFor="todo"                                       data-content={'Сфотографируйте чек и отправте его вашему куратору'}>                                    Сфотографируйте чек и отправте его вашему куратору                                </label>                                <br/>                                <small                                    className={this.state.checkIsValid ? 'hide' : 'error'}>                                    Это обязательно!                                </small>                            </div>                            <div className="button-section">                                <button className="main-item-style" onClick={this.calculateThePrice}>                                    Далее                                </button>                            </div>                        </div>                    </div>                    <div className={deliveredOrder.orderItem.orderValue ? 'courier-panel__delivered' : 'hide'}>                        <div className={'courier-panel__delivered-title mb-15'}>                            <h5>Текущий заказ {deliveredOrder.orderItem.id}</h5>                        </div>                        <div className={'courier-panel__delivered-content'}>                            {this.renderOrderInfo(deliveredOrder)}                            <div className="button-section button-section_bottom">                                <button className="main-item-style mr-15" onClick={this.finishOrder}>                                    Завершить заказ                                </button>                                <button className="main-item-style main-item-style_danger"                                        onClick={() => {                                            this.props.changeOrderData(4, deliveredOrder)                                        }}>                                    Покупатель отказался                                </button>                            </div>                        </div>                    </div>                </>            )    }    render() {        return (            <>                {                    !this.props.loading                        ?                        <div className={'courier-panel'}>                            {                                this.props.courierStatus === 0 || this.props.courierStatus === -1                                    ? this.renderOrdersList()                                    : this.props.courierStatus === 1                                    ? this.renderDeliveredOrder()                                    : this.props.courierStatus === 2                                        ? this.renderDeliveryPanel()                                        : null                            }                        </div>                        :                        <div className="lds-ellipsis">                            <div></div>                            <div></div>                            <div></div>                            <div></div>                        </div>                }            </>        )    }}// <div className={'dropdown'}>////     <div className="dropdown__content">//         <span className={'dropdown__item'}>Купил</span>//         <span className={'dropdown__item'}>Нет в наличии</span>//     </div>// </div>/*<div class="holder">  <div class="preloader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>*/