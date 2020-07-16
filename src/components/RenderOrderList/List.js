import React, {Component} from 'react'
import Order from './Order'
import MiniPreloader from '../UI/Preloaders/MiniPrleloader'

export default class List extends Component {
    onScroll = (e) => {
        if (Math.ceil(e.target.offsetHeight + e.target.scrollTop) >= e.target.scrollHeight) {
            this.props.increaseNumberElements()
        }
    }

    render() {
        return (
            <div className={'list__content'} onScroll={this.onScroll}>
                {
                    this.props.orderList.length !== 0
                        ? this.props.orderList.map((orderInfo) =>
                            <div key={orderInfo.id}>
                                <Order orderInfo={orderInfo}
                                       type={this.props.type}
                                       cancelOrder={this.props.cancelOrder}
                                       setEditItem={this.props.setEditItem}
                                       remove={this.props.remove}
                                       reOrder={this.props.reOrder}
                                       changeOrderData={this.props.changeOrderData}
                                />
                            </div>
                        )
                        : null
                }
                {
                    this.props.loading
                        ?  <MiniPreloader/>
                        : this.props.orderList.length === 0 ? <span>Оу, здесь пусто :(</span> : null
                }
            </div>
        )
    }
}