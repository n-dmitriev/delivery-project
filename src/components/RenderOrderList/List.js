import React, {Component} from 'react'
import Order2 from '../CourierPanel/Order'
import Order1 from './Order'

export default class List extends Component {
    render(){
        return(
            <div className={'list__content'}>
                {
                    this.props.orderList.length !== 0
                        ? this.props.orderList.map((orderInfo) =>
                            this.props.soughtId === 'courierId'
                                ?
                                <div key={orderInfo.orderItem.id}>
                                    <Order2 orderInfo={orderInfo}
                                            type={this.props.type}
                                            changeOrderData={this.props.changeOrderData}
                                    />
                                </div>
                                :
                                <div className={'list__item'} key={orderInfo.id}>
                                    <Order1 orderInfo={orderInfo}
                                            type={this.props.type}
                                            cancelOrder={this.props.cancelOrder}
                                            setEditItem={this.props.setEditItem}
                                            remove={this.props.remove}
                                            orderАgain={this.props.orderАgain}
                                    />
                                </div>,
                        )
                        : <>
                            <span>Оу, здесь пусто :(</span>
                        </>
                }
            </div>
        )
    }
}