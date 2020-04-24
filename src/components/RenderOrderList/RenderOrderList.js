import React, {Component} from 'react'
import List from './List'

export default class RenderOrderList extends Component {
    state = {
        orderListIsOpen: false,
    }

    interactionWithOrderList = () => {
        this.setState({
            orderListIsOpen: !this.state.orderListIsOpen,
        })
        if (!this.state.orderListIsOpen) {
            this.props.fetchOrderList(this.props.type, this.props.soughtId, null, this.props.statusList)
        }
        this.props.subscribe(!this.state.orderListIsOpen, this.props.type, this.props.soughtId, null, this.props.statusList)
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
                    this.props.loading
                        ? <div className={this.state.orderListIsOpen ? 'lds-ellipsis' : 'hide'}>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                        :
                        <div className={this.state.orderListIsOpen ? '' : 'hide'}>
                            <List
                                orderList={this.props.orderList}
                                soughtId={this.props.soughtId}
                                type={this.props.type}
                                cancelOrder={this.props.cancelOrder}
                                setEditItem={this.props.setEditItem}
                                remove={this.props.remove}
                                orderАgain={this.props.orderАgain}
                            />
                        </div>

                }
            </div>
        )
    }
}