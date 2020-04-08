import React, {Component} from 'react'
import './CourierPanel.scss'
import Order from './Order'

export default class CourierPanel extends Component {
    constructor(props) {
        super(props)
        this.courierPosition = React.createRef()
        this.state = {
            listIsOpen: false,
            positionIsValid: true
        }
    }


    interactionWithList = async () => {
        if(this.courierPosition.current.value.replace(/\s+/g, '') === '')
            this.setState({
                positionIsValid: false
            })
        else
        {
            await this.props.getActiveOrders()
            this.setState({
                listIsOpen: !this.state.listIsOpen,
                positionIsValid: true
            })
        }
    }


    renderOrdersList = () => {
        return (
            <>
                <div className="courier-panel__title">
                    <input placeholder={'Укажите ваше местоположение'} className={!this.state.positionIsValid ? 'input-error mb-15' : 'mb-15'} type="text"
                           ref={this.courierPosition}/>
                    <small className={this.state.newPasswordIsValid && this.state.oldPasswordIsValid ? 'hide' : 'error mb-15'}>
                        {!this.state.positionIsValid ? <>Ваше местоположение не может быть пустым!</> : null}
                    </small>
                    <div className="button-section">
                        <button className="main-item-style" onClick={this.interactionWithList}>
                            {this.state.listIsOpen ? 'Cкрыть' : 'Загрузить'} список заказов по близости
                        </button>
                    </div>
                </div>

                <div className={this.state.listIsOpen ? 'courier-panel__content' : 'hide'}>
                    {
                        this.props.ordersList.length > 0
                            ? this.props.ordersList.map((orderInfo) => (
                                <div className={'list__item'} key={orderInfo.id}>
                                    <Order orderInfo={orderInfo}
                                           takeOrder={this.props.takeOrder}
                                           itsTroll={this.props.itsTroll}
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

    renderDeliveredOrder = () => {

    }


    render() {
        return (
            <div className={'courier-panel'}>
                {
                    this.props.activeOrder !== undefined
                        ? this.renderDeliveredOrder()
                        : this.renderOrdersList()
                }
            </div>
        )
    }
}