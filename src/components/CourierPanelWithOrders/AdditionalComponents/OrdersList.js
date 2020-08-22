import React, {Component} from 'react'
import List from '../../RenderOrderList/List'
import InputPosition from '../../InputInformation/InputPosition'
import toaster from 'toasted-notes'

export default class OrdersList extends Component {
    state = {
        value: '',
        listIsOpen: false
    }

    interactionWithList = async () => {
        if (this.props.positionIsValid || (this.props.position !== '' && this.props.coordinate.length > 0)) {
            this.setState({
                listIsOpen: !this.state.listIsOpen
            })
            this.props.subscribeOrders(this.props.coordinate, 0, this.props.ordersList)
        } else {
            const errorMessage = this.props.errorMessage.replace(/\s+/g, '') !== ''
                ? this.props.errorMessage
                : 'Укажите ваше местоположение!'
            toaster.notify(errorMessage, {
                position: 'bottom-right',
                duration: 3000
            })
        }
    }

    changeOrderData = async (status, data) => {
        if (status === 1)
            await this.interactionWithList()
        this.props.changeOrderData(status, data)
    }

    orderList = () => {
        if (this.props.ordersList.length > 0) {
            return (
                <List
                    increaseNumberElements={this.props.increaseNumberElements}
                    orderList={this.props.ordersList}
                    changeOrderData={this.props.changeOrderData}
                    type={'active-courier'}
                />
            )
        } else
            return (
                <>
                    <span>Оу, здесь пусто :(</span>
                </>
            )

    }

    renderPosition = () => {
        const options = {type: 'courier'}
        if (this.props.position !== '' && this.props.coordinate.length > 0) {
            options.isEdit = true
            options.coordinate = this.props.coordinate
            options.address = this.props.position
        } else {
            options.isEdit = false
        }
        return (
            <InputPosition
                setAddressInfo={this.props.changePosition}
                options={options}
            />
        )
    }

    render() {
        return (
            <>
                <div className="courier-panel__title">
                    <div className={!this.state.listIsOpen ? 'courier-panel__title_input' : 'hide'}>
                        {
                            this.renderPosition()
                        }
                        <div className="button-section mt-2">
                            <button className="main-item-style" onClick={this.interactionWithList}>
                                Загрузить список заказов
                            </button>
                        </div>
                    </div>

                    <div className={!this.state.listIsOpen ? 'hide' : 'courier-panel__title_edit'}
                         onClick={this.interactionWithList}
                    >
                        <span>{this.props.position}</span>
                        <i className="fa fa-pencil-square-o fa-animate" aria-hidden="true"/>
                    </div>
                </div>

                <div className={this.state.listIsOpen ? 'courier-panel__content' : 'hide'}>
                    {
                        this.orderList()
                    }
                </div>
            </>
        )
    }
}