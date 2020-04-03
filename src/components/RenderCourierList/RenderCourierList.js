import React, {Component} from 'react'
import './RenderCourierList.scss'
import Courier from './Courier/Courier'

export default class RenderCourierList extends Component {
    state = {
        courierListIsOpen: false,
    }

    interactionWithCourierList = () => {
        this.setState({
            courierListIsOpen: !this.state.courierListIsOpen,
        })
    }

    fetchDb = () => {
        this.props.fetchDb()
        this.interactionWithCourierList()
    }

    render() {
        return (
            <>
                <div className={'list'}>
                <span className={'list__unwrapping-list mb-15'}
                      onClick={this.fetchDb}>
                    {this.state.courierListIsOpen
                        ? 'Скрыть '
                        : 'Показать '}
                    список курьеров
                    <i className="fa fa-caret-down" aria-hidden="true"/>
                </span>

                    <div className={this.state.courierListIsOpen ? '' : 'hide'}>
                        {
                            this.props.couriers.length > 0
                                ? this.props.couriers.map((courier) =>
                                    <div className={'list__item'} key={courier.id}>
                                        <Courier
                                            courierInfo={courier}
                                            removeCourier={this.props.removeCourier}
                                            editCourier={this.props.editCourier}
                                        />
                                    </div>
                                )
                                : <>
                                    <span>Карамба! У нас ещё нет курьеров :(</span>
                                </>
                        }
                    </div>
                </div>
            </>
        )
    }
}