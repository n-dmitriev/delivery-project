import React, {Component} from 'react'
import Order from './Order'

export default class List extends Component {
    render() {
        return (
            <div className={'list__content'}>
                {
                    this.props.orderList.length !== 0
                        ? this.props.orderList.map((orderInfo) =>
                            <div key={orderInfo.id}>
                                <Order orderInfo={orderInfo}
                                       type={this.props.type}
                                       cancelOrder={this.props.cancelOrder}
                                       setEditItem={this.props.setEditItem}
                                       remove={this.props.remove}
                                       orderАgain={this.props.orderАgain}
                                       changeOrderData={this.props.changeOrderData}
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