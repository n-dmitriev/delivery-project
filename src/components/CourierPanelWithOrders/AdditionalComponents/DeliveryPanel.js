import React, {Component} from 'react'
import toaster from 'toasted-notes'
import {Map, YMaps, ZoomControl} from 'react-yandex-maps'
import {confirm} from '../../UI/Confirm/Confirm'
import InputPosition from '../../InputInformation/InputPosition'

export default class DeliveryPanel extends Component {
    constructor(props) {
        super(props)
        this.orderValue = React.createRef()
        this.check = React.createRef()
        //this.courierPosition = React.createRef()
        this.map = null
        this.ymaps = null
        this.route = null
    }

    state = {
        valueIsValid: true,
        coordinateCourier: '',
        checkIsValid: true,
        isEdit: false,
        listIsOpen: false,
        infFromMap: {}
    }


    handleApiAvaliable = ymaps => {
        this.ymaps = ymaps
        ymaps
            .route([this.props.coordinate, this.props.orderInfo.coordinate])
            .then(route => {
                this.map.geoObjects.add(route)
            })
    }


    nextStep = async () => {
        const orderValue = parseInt(this.orderValue.current.value)
        await this.setState({
            valueIsValid: orderValue > 0,
            checkIsValid: this.check.current.checked
        })
        if ((this.props.positionIsValid || this.props.errorMessage === '') && this.state.valueIsValid && this.state.checkIsValid) {
            this.props.setOrderValue(this.props.orderInfo.id, orderValue)
            if (this.state.isEdit)
                this.editInfoIsOpen()
        } else toaster.notify(this.props.errorMessage, {
            position: 'bottom-right',
            duration: 3000
        })
    }

    finishOrder = () => {
        confirm(
            'завершить заказ', async () => {
                this.props.unsubscribeAllOrders()
                this.props.changeOrderData(3, this.props.orderInfo)
                toaster.notify('Заказ завершён!', {
                    position: 'bottom-right',
                    duration: 3000
                })
            }
        )
    }

    cancelOrder = () => {
        confirm(
            'клиент отказался', async () => {
                this.props.changeOrderData(4, this.props.orderInfo)
                toaster.notify('Заказ отменён!', {
                    position: 'bottom-right',
                    duration: 3000
                })
            }
        )
    }

    editInfoIsOpen = () => {
        this.setState({
            isEdit: !this.state.isEdit
        })
    }

    interactionWithList = () => {
        this.setState({
            listIsOpen: !this.state.listIsOpen
        })
    }

    render() {
        const orderInfo = this.props.orderInfo
        if (orderInfo) {
            return (
                <>
                    <div
                        className={this.state.isEdit || orderInfo.orderValue === ''
                            ? 'courier-panel__title courier-panel__title_p' : 'hide'}>
                        <InputPosition
                            setAddressInfo={this.props.changePosition}
                            options={{
                                isEdit: true,
                                type: 'courier',
                                coordinate: this.props.coordinate,
                                address: this.props.position
                            }}
                        />

                        <div className="form-group mt-1">
                            <input placeholder={'Укажите стоимость закупки'}
                                   defaultValue={orderInfo.orderValue}
                                   className={!this.state.valueIsValid ? 'input-error' : ''}
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
                        <div className={'checkbox mb-15'}>
                            <input
                                className={this.state.checkIsValid ? '' : 'checkbox_input_error'}
                                defaultChecked={orderInfo.orderValue !== '' ? 'checked' : ''}
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
                            <button className="main-item-style" onClick={this.nextStep}>
                                Применить
                            </button>
                        </div>
                    </div>

                    <div
                        className={!this.state.isEdit && orderInfo.orderValue !== '' ? 'courier-panel__delivered' : 'hide'}>
                        <div
                            onClick={this.editInfoIsOpen}
                            className={'courier-panel__delivered-title mb-15'}>
                            <h5>Доставляемый заказ {orderInfo.id}</h5>
                            <span>
                                <i className="fa fa-arrow-left  fa-animate" aria-hidden="true"/>
                                Редактировать
                            </span>
                        </div>
                        <div className={'courier-panel__delivered-content'}>
                            <div className={'courier-panel__list'}>
                                <span className={'courier-panel__list-item mb-15'}
                                      onClick={this.interactionWithList}>
                                    {this.state.listIsOpen
                                        ?
                                        <>
                                            К карте
                                            <i className="fa fa-arrow-left fa-animate" aria-hidden="true"/>
                                        </>
                                        :
                                        <>
                                            К информации
                                            <i className="fa fa-arrow-right fa-animate" aria-hidden="true"/>
                                        </>
                                    }
                                </span>

                                <div className={'courier-panel__body'}>
                                    <div className={this.state.listIsOpen ? '' : 'hide'}>
                                        {this.props.renderOrderInfo(orderInfo)}
                                    </div>
                                    <div className={this.state.listIsOpen ? 'hide' : 'courier-panel__map'}>
                                        <YMaps query={{apikey: '87bbec27-5093-4a9c-a244-9bedba71ad27'}}>
                                            <Map defaultState={{center: [59.220496, 39.891523], zoom: 12}}
                                                 modules={['templateLayoutFactory', 'route']}
                                                 instanceRef={ref => (this.map = ref)}
                                                 onLoad={ymaps => this.handleApiAvaliable(ymaps)}
                                                 width="100%"
                                                 height={'350px'}
                                            >
                                                <ZoomControl options={{float: 'right'}}/>
                                            </Map>
                                        </YMaps>
                                    </div>
                                </div>
                            </div>


                            <div className="button-section mt-4">
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
        } else
            return null
    }
}