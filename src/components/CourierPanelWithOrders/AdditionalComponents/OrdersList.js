import React, {Component} from 'react'
import List from '../../RenderOrderList/List'

export default class OrdersList extends Component {
    constructor(props) {
        super(props)
        this.courierPosition = React.createRef()
        this.state = {
            value: '',
            listIsOpen: false,
        }
    }

    interactionWithList = async () => {
        await this.props.changePosition(this.courierPosition.current.value)
        if (this.props.positionIsValid) {
            this.setState({
                listIsOpen: !this.state.listIsOpen,
            })
            // await this.props.fetchOrderList('active', 'courierId', '', [0], 0)
            this.props.subscribeUsers(this.state.listIsOpen, this.props.coordinate, 0)
        }
    }

    changeOrderData = async (status, data) => {
        if (status === 1)
            await this.interactionWithList()
        this.props.changeOrderData(status, data)
    }

    sortOrderList = () => {
        if (this.props.ordersList.length > 0) {
            return (
                <List
                    increaseNumberElements={() => {}}
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

    render() {
        return (
            <>
                <div className="courier-panel__title">
                    <div className={!this.state.listIsOpen ? 'courier-panel__title_input' : 'hide'}>
                        <div className="form-group">
                            <input
                                placeholder={'Укажите ваше местоположение'}
                                defaultValue={this.props.position}
                                className={!this.props.positionIsValid ? 'input-error mb-15' : 'mb-15'} type="text"
                                ref={this.courierPosition}
                                id="dynamic-label-input-0"
                            />
                            <label className={'label'} htmlFor="dynamic-label-input-2">Ваше местоположение</label>
                            <small
                                className={this.state.positionIsValid ? 'hide' : 'error mb-15'}>
                                {!this.props.positionIsValid ? <> Вы указали неверное местоположение!</> : null}
                            </small>
                        </div>
                        <div className="button-section">
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
                        this.sortOrderList()
                    }
                </div>
            </>
        )
    }
}