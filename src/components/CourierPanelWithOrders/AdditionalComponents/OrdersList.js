import React, {Component} from 'react'
import List from '../../RenderOrderList/List'
import InputPosition from '../../InputInformation/InputPosition'
import toaster from 'toasted-notes'

export default class OrdersList extends Component {
    state = {
        value: '',
        listIsOpen: false
    }

    openOrderList = async () => {
        if (this.props.positionIsValid || (this.props.position !== '' && this.props.coordinate.length > 0)) {
            this.setState({
                listIsOpen: true
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

    closeOrderList = () => {
        this.setState({
            listIsOpen: false
        })
        this.props.unsubscribeAllOrders()
        this.props.resetList()
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
            return null
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
                    <div className={!this.state.listIsOpen ? 'hide' : 'courier-panel__title_edit'}
                         onClick={this.closeOrderList}
                    >
                        <span>{this.props.position}</span>
                        <i className="fa fa-pencil-square-o fa-animate" aria-hidden="true"/>
                    </div>
                </div>

                <div
                    className={!this.state.listIsOpen ? 'courier-panel__title-input' : 'hide'}>
                    {
                        this.renderPosition()
                    }
                    <div className="button-section">
                        <button className="btn" onClick={this.openOrderList}>
                            Загрузить список заказов
                        </button>
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