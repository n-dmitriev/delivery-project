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
        this.state = {
            value: '',
            valueIsValid: true,
            coordinateCourier: '',
            checkIsValid: true,
            edit: false,
            listIsOpen: false,
            infFromMap: {}
        }
    }


    handleApiAvaliable = ymaps => {
        this.ymaps = ymaps
        ymaps
            .route([this.props.coordinate, this.props.ordersList[0].coordinate])
            .then(route => {
                this.map.geoObjects.add(route)
            })
    }


    nextStep = async () => {
        await this.setState({
            valueIsValid: parseInt(this.orderValue.current.value),
            checkIsValid: this.check.current.checked
        })
        if (this.props.positionIsValid && this.state.valueIsValid && this.state.checkIsValid) {
            this.editInfo()
        } else toaster.notify(this.props.errorMessage, {
            position: 'bottom-right',
            duration: 3000
        })
    }

    finishOrder = () => {
        confirm(
            'завершить заказ', async () => {
                this.props.unsubscribeAllOrders()
                this.props.changeOrderData(3, this.props.ordersList[0])
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
                this.props.changeOrderData(4, this.props.ordersList[0])
                toaster.notify('Заказ отменён!', {
                    position: 'bottom-right',
                    duration: 3000
                })
            }
        )
    }

    editInfo = () => {
        this.setState({
            edit: !this.state.edit
        })
    }

    interactionWithList = () => {
        this.setState({
            listIsOpen: !this.state.listIsOpen
        })
    }

    render() {
        const deliveredOrder = this.props.ordersList[0]
        if (deliveredOrder)
            return (
                <>
                    <div className="courier-panel__title">
                        <div
                            className={deliveredOrder.orderValue === '' || this.state.edit ? 'courier-panel__title_input' : 'hide'}>
                            <InputPosition
                                setAddressInfo={this.props.changePosition}
                                options={{isEdit: false, type: 'courier'}}
                            />

                            <div className="form-group">
                                <input placeholder={'Укажите стоимость закупки'}
                                       defaultValue={this.props.ordersList[0].orderValue}
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
                    </div>

                    <div
                        className={deliveredOrder.orderValue && !this.state.edit ? 'courier-panel__delivered' : 'hide'}>
                        <div
                            onClick={this.editInfo}
                            className={'courier-panel__delivered-title mb-15'}>
                            <h5>Доставляемый заказ {deliveredOrder.id}</h5>
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
                                        ? 'К карте'
                                        : 'К информации'}
                                    <i className="fa fa-arrow-right fa-animate" aria-hidden="true"/>
                                </span>

                                <div className={'courier-panel__body'}>
                                    <div className={this.state.listIsOpen ? '' : 'hide'}>
                                        {this.props.renderOrderInfo(deliveredOrder)}
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