import React, {Component} from 'react'
import './RenderOrderList.scss'
import Order from './Order'

export default class RenderOrderList extends Component {
    state = {
        orderListIsOpen: false,
    }

    interactionWithOrderList = () => {
        this.setState({
            orderListIsOpen: !this.state.orderListIsOpen,
        })
    }

    render() {
        return (
            <>
                <div className={'list'}>
                <span className={'list__unwrapping-list mb-15'}
                      onClick={this.interactionWithOrderList}>
                    {this.state.orderListIsOpen
                        ? 'Скрыть '
                        : 'Показать '}
                    список {this.props.description}
                    <i className="fa fa-caret-down" aria-hidden="true"></i>
                </span>

                    <div className={this.state.orderListIsOpen ? '' : 'hide'}>
                        {
                            this.props.orderList.length !== 0
                                ? this.props.orderList.map((orderInfo) => (
                                    <div className={'list__item'} key={orderInfo.id}>
                                        <Order orderInfo={orderInfo}
                                               type={this.props.type}
                                               cancelOrder={this.props.cancelOrder}
                                               setEditItem={this.props.setEditItem}/>
                                    </div>
                                ))
                                : <>
                                    <span>Оу, здесь пусто :(</span>
                                </>
                        }
                    </div>
                </div>
            </>
        )
    }
}