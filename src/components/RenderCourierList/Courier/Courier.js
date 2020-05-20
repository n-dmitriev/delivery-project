import React, {Component} from 'react'

export default class Courier extends Component {
    removeCourier = (e) => {
        e.preventDefault()
        this.props.removeCourier(this.props.courierInfo.id)
    }

    render() {
        const status = this.props.courierInfo.courierStatus === -1
            ? 'Оффлайн'
                : this.props.courierInfo.courierStatus === 0
                    ? 'Онлайн'
                    : this.props.courierInfo.courierStatus === 1
                        ? 'Осуществляет закупку'
                        : this.props.courierInfo.courierStatus === 2
                            ? 'Доставляет заказ'
                            : null
        return (
            <>
                <h4 className={`mb-15 courier-name courier-name_${this.props.courierInfo.courierStatus >= 0 ? 'online' : 'offline'}`}>
                    Курьер {this.props.courierInfo.name}
                </h4>
                <ul>
                    <li className={'mb-15'}>Статус: {status}</li>
                    <li className={'mb-15'}>ID: {this.props.courierInfo.id}</li>
                    <li className={'mb-15'}>Номер телефона: {this.props.courierInfo.numberPhone}</li>
                    <li className={'mb-15'}>Ссылка на вк: {this.props.courierInfo.address}</li>
                    <li className={'mb-15'}>Почта: {this.props.courierInfo.email}</li>
                </ul>


                <div className="button-section mt-30">
                    <button
                        className="main-item-style mr-15"
                        onClick={() => {
                            this.props.editCourier(this.props.courierInfo)
                        }}
                    >
                        Редактировать
                    </button>
                    <button
                        onClick={this.removeCourier}
                        className="main-item-style main-item-style_danger"
                    >
                        Удалить
                    </button>
                </div>
            </>
        )
    }
}