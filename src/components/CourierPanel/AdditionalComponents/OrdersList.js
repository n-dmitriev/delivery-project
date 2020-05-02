import React, {Component} from 'react'
import Order from '../../RenderOrderList/Order'
import {sortArray} from '../../../store/universalFunctions'

export default class OrdersList extends Component {
    constructor(props) {
        super(props)
        this.courierPosition = React.createRef()
        this.state = {
            coordinate: '',
            value: '',
            positionIsValid: true,
            listIsOpen: false,
        }
    }

    interactionWithList = async () => {
        const answer = await window.ymaps.geocode(this.courierPosition.current.value)
        if (this.courierPosition.current.value.replace(/\s+/g, '') === '' || answer.geoObjects.get(0) === undefined) {
            this.setState({
                positionIsValid: false,
            })
        }
        else {
            this.props.changePosition(this.courierPosition.current.value)
            this.setState({
                listIsOpen: !this.state.listIsOpen,
                positionIsValid: true,
                coordinate: answer.geoObjects.get(0).geometry.getCoordinates(),
            })
            await this.props.fetchOrderList('active', 'courierId', '', [0])
            this.props.subscribeUsers(this.state.listIsOpen, 'active', 'courierId', '', [0])
        }
    }

    sortOrderList = () => {
        if (this.props.ordersList.length > 0)
        {
            const arr = sortArray(this.props.ordersList, this.state.coordinate)
            return (
                <>
                    {
                        this.props.ordersList.map((orderInfo) => (
                            <div key={orderInfo.orderItem.id}>
                                <Order
                                    orderInfo={orderInfo}
                                    changeOrderData={this.props.changeOrderData}
                                    type={'active-courier'}
                                />
                            </div>
                        ))
                    }
                </>
            )
        }
        else
            return (
                <>
                    <span>Оу, здесь пусто :(</span>
                </>
            )

    }

    render(){
        return(
            <>
                <div className="courier-panel__title">
                    <div className={!this.state.listIsOpen ? 'courier-panel__title_input' : 'hide'}>
                        <div className="form-group">
                            <input
                                placeholder={'Укажите ваше местоположение'}
                                defaultValue={this.props.position}
                                className={!this.state.positionIsValid ? 'input-error mb-15' : 'mb-15'} type="text"
                                ref={this.courierPosition}
                                id="dynamic-label-input-0"
                            />
                            <label className={'label'} htmlFor="dynamic-label-input-2">Ваше местоположение</label>
                            <small
                                className={this.state.positionIsValid ? 'hide' : 'error mb-15'}>
                                {!this.state.positionIsValid ? <> Вы указали неверное местоположение!</> : null}
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