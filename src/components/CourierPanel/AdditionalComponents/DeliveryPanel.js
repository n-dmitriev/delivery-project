import React, {Component} from 'react'
import toaster from 'toasted-notes'

export default class DeliveryPanel extends Component {
    render(){
        const deliveredOrder = this.props.ordersList[0]
        if (deliveredOrder)
            return (
                <>
                    <div className="courier-panel__title">
                        <div className={deliveredOrder.orderItem.orderValue ? 'hide' : 'courier-panel__title_input'}>
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
                                    defaultValue={this.state.position}
                                    className={!this.state.positionIsValid ? 'input-error' : ''}
                                    type="text"
                                    ref={this.courierPosition}
                                    id="dynamic-label-input-2"/>
                                <label className={'label'} htmlFor="dynamic-label-input-2">Ваше текущее
                                    местоположение</label>
                                <small
                                    className={this.state.positionIsValid ? 'hide' : 'error'}>
                                    Ваше местоположение не может быть пустым!
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

                    <div className={deliveredOrder.orderItem.orderValue ? 'courier-panel__delivered' : 'hide'}>
                        <div className={'courier-panel__delivered-title mb-15'}>
                            <h5>Текущий заказ {deliveredOrder.orderItem.id}</h5>
                        </div>
                        <div className={'courier-panel__delivered-content'}>
                            {this.renderOrderInfo(deliveredOrder)}
                            <div className="button-section button-section_bottom">
                                <button className="main-item-style mr-15" onClick={this.finishOrder}>
                                    Доставлен
                                </button>
                                <button className="main-item-style main-item-style_danger"
                                        onClick={() => {
                                            this.props.changeOrderData(4, deliveredOrder)
                                            toaster.notify('Заказ возобновлён!', {
                                                position: 'bottom-right',
                                                duration: 3000,
                                            })
                                        }}>
                                    Клиент отказался
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )
    }
}