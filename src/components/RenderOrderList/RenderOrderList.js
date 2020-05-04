import React, {Component} from 'react'
import List from './List'
import MiniPreloader from '../UI/Preloaders/MiniPrleloader'

export default class RenderOrderList extends Component {
    state = {
        orderListIsOpen: false,
    }

    interactionWithOrderList = () => {
        let type = this.props.type === 'active-user' || this.props.type === 'active-courier'
            ? 'active'
            : this.props.type === 'finish-user' || this.props.type === 'finish-courier'
            ? 'finish'
                : this.props.type === 'admin'
                    ? 'sample'
                    : null
            this.setState({
            orderListIsOpen: !this.state.orderListIsOpen,
        })
        if (!this.state.orderListIsOpen) {
            this.props.fetchOrderList(type, this.props.soughtId, null, this.props.statusList)
        }
        this.props.subscribe(!this.state.orderListIsOpen, type, this.props.soughtId, null, this.props.statusList, null)
    }

    render() {
        return (
            <div className={'list'}>
                <span className={'list__unwrapping-list mb-15'}
                      onClick={this.interactionWithOrderList}>
                    {this.state.orderListIsOpen
                        ? 'Скрыть '
                        : 'Показать '}
                    список {this.props.description}
                    <i className="fa fa-caret-down" aria-hidden="true"/>
                </span>

                {
                    this.props.loading && this.state.orderListIsOpen
                        ?
                        <MiniPreloader/>
                        :
                        <div className={this.state.orderListIsOpen ? '' : 'hide'}>
                            <List
                                orderList={this.props.orderList}
                                soughtId={this.props.soughtId}
                                type={this.props.type}
                                cancelOrder={this.props.cancelOrder}
                                setEditItem={this.props.setEditItem}
                                remove={this.props.remove}
                                reOrder={this.props.reOrder}
                            />
                        </div>
                }
            </div>
        )
    }
}