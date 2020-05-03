import React, {Component} from 'react'
import toaster from 'toasted-notes'

export default class DeliveryPanel extends Component {
    constructor(props) {
        super(props)
        this.orderValue = React.createRef()
        this.check = React.createRef()
        this.courierPosition = React.createRef()
        this.state = {
            value: '',
            valueIsValid: true,
            coordinateCourier: '',
            positionIsValid: true,
            checkIsValid: true,
        }
    }

    calculateThePrice = async () => {
        const answer = await window.ymaps.geocode(this.courierPosition.current.value)
        await this.setState({
            positionIsValid: this.courierPosition.current.value.replace(/\s+/g, '') !== '' || answer.geoObjects.get(0) !== undefined,
            valueIsValid: parseInt(this.orderValue.current.value),
            checkIsValid: this.check.current.checked,
        })
        if (this.state.positionIsValid && this.state.valueIsValid && this.state.checkIsValid) {
            const coordinate = answer.geoObjects.get(0).geometry.getCoordinates()
            this.props.calculateThePrice(this.props.ordersList[0].id, this.orderValue.current.value, this.courierPosition.current.value)
        }
    }

    finishOrder = () => {
        this.props.changeOrderData(3, this.props.ordersList[0])
        toaster.notify('Заказ завершён!', {
            position: 'bottom-right',
            duration: 3000,
        })
    }

    cancelOrder = () => {
        this.props.changeOrderData(4, this.props.ordersList[0])
        toaster.notify('Заказ возобновлён!', {
            position: 'bottom-right',
            duration: 3000,
        })
    }

    render() {
        const deliveredOrder = this.props.ordersList[0]
        if (deliveredOrder)
            return (
                <>
                    <div className="courier-panel__title">
                        <div className={deliveredOrder.orderValue ? 'hide' : 'courier-panel__title_input'}>
                            <div className="form-group">
                                <input placeholder={'Укажите стоимость закупки'}
                                       defaultValue={this.state.value}
                                       className={!this.state.valueIsValid ? 'input-error' : ''} type="text"
                                       ref={this.orderValue}
                                       type='number'
                                       id="dynamic-label-input-1"
                                />
                                <label className={'label'} htmlFor="dynamic-label-input-1">Стоимость закупки</label>
                                <small
                                    className={this.state.valueIsValid ? 'hide' : 'error'}>
                                    Цена не может быть пустой!
                                </small>
                            </div>

                            <div className="form-group">
                                <input
                                    placeholder={'Укажите ваше текущее местоположение'}
                                    defaultValue={this.props.position}
                                    className={!this.state.positionIsValid ? 'input-error' : ''}
                                    type="text"
                                    ref={this.courierPosition}
                                    id="dynamic-label-input-2"/>
                                <label className={'label'} htmlFor="dynamic-label-input-2">Ваше текущее
                                    местоположение</label>
                                <small
                                    className={this.state.positionIsValid ? 'hide' : 'error'}>
                                    Вы указали неверное местоположение!
                                </small>
                            </div>
                            <div className={'checkbox mb-15'}>
                                <input
                                    className={this.state.checkIsValid ? '' : 'checkbox_input_error'}
                                    ref={this.check}
                                    type="checkbox" name="todo"/>
                                <label className={'checkbox__label_mini'} htmlFor="todo"
                                       data-content={'Сфотографируйте чек и отправте его вашему куратору'}>
                                    Сфотографируйте чек и отправте его вашему куратору
                                </label>
                                <br/>
                                <small
                                    className={this.state.checkIsValid ? 'hide' : 'error'}>
                                    Это обязательно!
                                </small>
                            </div>
                            <div className="button-section">
                                <button className="main-item-style" onClick={this.calculateThePrice}>
                                    Далее
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={deliveredOrder.orderValue ? 'courier-panel__delivered' : 'hide'}>
                        <div className={'courier-panel__delivered-title mb-15'}>
                            <h5>Текущий заказ {deliveredOrder.id}</h5>
                        </div>
                        <div className={'courier-panel__delivered-content'}>
                            {this.props.renderOrderInfo(deliveredOrder)}
                            <div className="button-section button-section_bottom">
                                <button className="main-item-style mr-15" onClick={this.finishOrder}>
                                    Доставлен
                                </button>
                                <button className="main-item-style main-item-style_danger" onClick={this.cancelOrder}>
                                    Клиент отказался
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )
        else
            return null
    }
}