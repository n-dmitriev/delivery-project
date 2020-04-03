import React, {Component} from 'react'
import RenderOrderList from '../../RenderOrderList/RenderOrderList'

export default class Courier extends Component {
    state = {
        completedOrdersIsOpen: false,
        executableOrdersIsOpen: false,
    }

    editCourier = (e) => {
        e.preventDefault()
        //this.props.setCourierInfo()
    }

    removeCourier = (e) => {
        e.preventDefault()
        this.props.removeCourier(this.props.courierInfo.id)
    }

    render() {
        return (
            <>
                <h4>Курьер {this.props.courierInfo.name}</h4>
                <ul>
                    <li className={'mb-15'}>Номер телефона: {this.props.courierInfo.numberPhone}</li>
                    <li className={'mb-15'}>Ссылка на вк: {this.props.courierInfo.address}</li>
                    <li className={'mb-15'}>Почта: {this.props.courierInfo.email}</li>
                </ul>

                <hr/>

                <RenderOrderList  description={'доставляемых заказов'}
                                 orderList={this.props.courierInfo.executableOrders || []}
                                 type={'active'}
                                 cancelOrder={this.props.cancelOrder}
                                 setEditItem={this.setEditItem}
                />

                <hr/>

                <RenderOrderList description={'доставленных заказов'}
                                 orderList={this.props.courierInfo.completedOrders || []}
                                 type={'finish'}
                />

                <div className="button-section mt-30">
                    <button
                        className="main-item-style mr-15"
                        onClick={this.editCourier}
                    >
                        Редактировать данные курьера
                    </button>
                    <button
                        onClick={this.removeCourier}
                        className="main-item-style main-item-style_danger"
                    >
                        Удалить курьера
                    </button>
                </div>
            </>
        )
    }
}