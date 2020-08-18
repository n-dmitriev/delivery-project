import React, {Component} from 'react'
import MiniPreloader from '../../UI/Preloaders/MiniPrleloader'
import Tab from './Tab'
import './Tabs.scss'

export default class TabList extends Component {
    onScroll = (e) => {
        if (Math.ceil(e.target.offsetHeight + e.target.scrollTop) >= e.target.scrollHeight && !this.props.loading) {
            this.props.increaseNumberElements()
        }
    }

    render() {
        return (
            <div className={'tab__content'} onScroll={this.onScroll}>
                {
                    this.props.orderList.length !== 0
                        ? this.props.orderList.map((orderInfo) =>
                            <div key={orderInfo.id}>
                                <Tab orderInfo={orderInfo}
                                       type={this.props.type}
                                       reOrder={this.props.reOrder}
                                       changeOrderData={this.props.changeOrderData}
                                />
                            </div>
                        )
                        : null
                }
                {
                    this.props.loading
                        ? <MiniPreloader/>
                        : this.props.orderList.length === 0 ? <span>Оу, здесь пусто :(</span> : null
                }
            </div>
        )
    }
}