import React, {Component} from 'react'import './CourierPanel.scss'import DeliveryPanel from './AdditionalComponents/DeliveryPanel'import OrdersList from './AdditionalComponents/OrdersList'import DeliveredOrder from './AdditionalComponents/DeliveredOrder/DeliveredOrder'import MiniPreloader from '../UI/Preloaders/MiniPrleloader'import RenderFullOrderInfo from '../RenderOrderList/RenderFullOrderInfo'export default class CourierPanel extends Component {    state = {        position: localStorage.getItem('position') ? JSON.parse(localStorage.getItem('position')) : '',        coordinate: localStorage.getItem('coordinate') ? JSON.parse(localStorage.getItem('coordinate')) : [],        positionIsValid: false,        errorMessage: '',        sub: true    }    componentDidUpdate = async () => {        if (this.props.courierInfo.courierStatus > 0 && this.props.unsubscribeList.length === 0 && this.state.sub) {            await this.props.subscribeOrderInfo(this.props.courierInfo.id, this.props.courierInfo.courierStatus)        }    }    componentWillUnmount() {        this.props.unsubscribeAllOrders()        this.props.resetList()    }    changePosition = async (position, coordinate, positionIsValid, errorMessage) => {        console.log(position, coordinate, positionIsValid, errorMessage)        if (positionIsValid) {            this.setState({position, coordinate, errorMessage, positionIsValid})            localStorage.setItem('position', JSON.stringify(position))            localStorage.setItem('coordinate', JSON.stringify(coordinate))        } else {            this.setState({positionIsValid, errorMessage})        }    }    increaseNumberElements = async () => {        if (!this.props.clEnd) {            const list = this.props.ordersList            await this.props.subscribeOrders(this.state.coordinate, list[list.length - 1].id)        }    }    changeOrderData = async (status, data) => {        if (status === 0 || 1) {            this.props.resetList()            this.props.unsubscribeAllOrders()            this.props.changeOrderData(status, data)        } else if (status === 3) {            this.setState({                sub: false            })            this.props.resetList()            this.props.unsubscribeAllOrders()            await this.props.changeOrderData(status, data)            this.setState({                sub: true            })        } else            this.props.changeOrderData(status, data)    }    renderOrderInfo = (deliveredOrder) => {           return (               <RenderFullOrderInfo                   orderInfo={deliveredOrder}                   type={'courier'}               />           )       }    render() {        return (            <div className={'courier-panel'}>                {                    this.props.courierInfo.courierStatus === 0 || this.props.courierInfo.courierStatus === -1                        ? <OrdersList                            changePosition={this.changePosition}                            position={this.state.position}                            positionIsValid={this.state.positionIsValid}                            coordinate={this.state.coordinate}                            errorMessage={this.state.errorMessage}                            fetchOrderList={this.props.fetchOrderList}                            subscribeOrders={this.props.subscribeOrders}                            unsubscribeAllOrders={this.props.unsubscribeAllOrders}                            ordersList={this.props.ordersList}                            changeOrderData={this.changeOrderData}                            loading={this.props.loading}                            increaseNumberElements={this.increaseNumberElements}                            resetList={this.props.resetList}                        />                        : this.props.courierInfo.courierStatus === 1                        ? <DeliveredOrder                            orderInfo={this.props.ordersList[0]}                            interactWithPurchased={this.props.interactWithPurchased}                            renderOrderInfo={this.renderOrderInfo}                            changeOrderData={this.changeOrderData}                        />                        : this.props.courierInfo.courierStatus === 2                            ? <DeliveryPanel                                orderInfo={this.props.ordersList[0]}                                renderOrderInfo={this.renderOrderInfo}                                changeOrderData={this.changeOrderData}                                changePosition={this.changePosition}                                position={this.state.position}                                positionIsValid={this.state.positionIsValid}                                coordinate={this.state.coordinate}                                errorMessage={this.state.errorMessage}                                unsubscribeAllOrders={this.props.unsubscribeAllOrders}                                setOrderValue={this.props.setOrderValue}                            />                            : <MiniPreloader/>                }            </div>        )    }}// <div className={'dropdown'}>//     <div className="dropdown__content">//         <span className={'dropdown__item'}>Купил</span>//         <span className={'dropdown__item'}>Нет в наличии</span>//     </div>// </div>