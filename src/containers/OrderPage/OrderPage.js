import React, {Component} from 'react'
import './OrderPage.scss'
import {connect} from 'react-redux'
import Footer from '../../components/UI/Footer/Footer'
import EditCurrentOrder, {accessCheck, editSentOrder, subscribe} from './auxiliaryFunction'
import BigPreloader from '../../components/UI/Preloaders/BigPreloader'
import {NavLink} from 'react-router-dom'
import ProgressBar from '../../components/UI/ProgressBar/ProgressBar'
import Item from '../../components/RenderOrderList/Item'
import Tooltip from 'react-tooltip-lite'
import {confirm} from '../../components/UI/Confirm/Confirm'
import toaster from 'toasted-notes'
import OrderModalForm from '../OrderModalForm/OrderModalForm'
import {cancelOrder, reOrder} from '../../store/order/orderActions'
import {subscribeOrderInfo} from '../../store/courier/courierAction'
import {getDate} from '../../store/universalFunctions'

class OrderPage extends Component {
    constructor() {
        super()
        document.title = 'EasyWays | Заказ'
    }

    state = {
        access: false,
        loading: true,
        orderInfo: {},
        isOrderModalOpen: false,
        unsubscribe: () => {
        }
    }

    componentDidMount = async () => {
        const path = localStorage.getItem('path') ? JSON.parse(localStorage.getItem('path')) : '/',
            userId = localStorage.getItem('id') ? JSON.parse(localStorage.getItem('id')) : '',
            adminId = localStorage.getItem('adminId') ? JSON.parse(localStorage.getItem('adminId')) : null,
            orderId = this.props.match.params.number
        accessCheck(adminId, userId, path, orderId, this.props.location.search.split('?')[1])
            .then(async (access) => {
                let unsubscribe = () => {
                }
                if (access) {
                    unsubscribe = subscribe(orderId, this.updateOrderInfo)
                }
                this.setState({
                    access, loading: false, unsubscribe
                })
            })
    }

    updateOrderInfo = (info) => this.setState({orderInfo: info})

    componentWillUnmount() {
        this.state.unsubscribe()
    }

    interactionWithOrderModal = () => {
        this.setState({isOrderModalOpen: !this.state.isOrderModalOpen})
    }

    cancelOrder = () => {
        confirm('отменить заказ',
            () => {
                this.props.cancelOrder(this.props.orderInfo.id)
                toaster.notify('Заказ отменён!', {
                    position: 'bottom-right',
                    duration: 3000
                })
            })
    }

    renderOrderInfoPage = (orderInfo) => {
        if (Object.keys(orderInfo).length > 0)
            return (
                <>
                    <ul>
                        <li className={'mb-2'}>{orderInfo.description}</li>
                        <li className={'mb-15'}>
                            <ProgressBar status={orderInfo.status}/>
                        </li>
                        <li className={'mb-15'}>Откуда: {orderInfo.name}</li>
                        <li className={'mb-15'}>Адресс доставки: {orderInfo.clientAddress}</li>
                        <li className={'mb-15'}>Имя: {orderInfo.clientName}</li>
                        <li className={'mb-15'}>Контактный телефон: {orderInfo.clientNumberPhone}</li>
                        <li className={'mb-15'}>Время начала заказа: {getDate(orderInfo.startTime)}</li>
                        {
                            orderInfo.endTime !== ''
                                ?
                                <li className={'mb-15'}>Время окончания заказа: {getDate(orderInfo.endTime)}</li>
                                : null
                        }
                        {
                            orderInfo.orderValue !== ''
                                ?
                                <>
                                    <li className={'mb-15'}>Стоимость заказа: {orderInfo.orderValue} ₽</li>
                                    <li className={'mb-15'}>Стоимость доставки: {orderInfo.deliveryValue} ₽</li>
                                    <li className={'mb-15'}>
                                        <b>Итого: {parseInt(orderInfo.deliveryValue) + parseInt(orderInfo.orderValue)} ₽</b>
                                    </li>
                                </>
                                : null
                        }
                    </ul>


                    <h3 className={'mb-3'}>Заказ</h3>
                    <div className={'mb-4'}>
                        {
                            orderInfo.order && orderInfo.order.length > 0
                                ?
                                orderInfo.order.map((product) => (
                                    <div key={product.id}>
                                        <Item product={product} status={orderInfo.status}/>
                                    </div>
                                ))
                                :
                                <span>Ваш заказ пуст! :(</span>
                        }
                    </div>
                </>
            )
    }

    renderButtonSection = (orderInfo) => {
        const type = this.props.location.search.split('?')[1]

        return (
            <div className="button-section">
                {
                    type === 'active-user'
                        ?
                        <div className="button-section">
                            {
                                orderInfo.status >= 2
                                    ? <Tooltip
                                        content={'Эот заказ нельзя редактировать!'}
                                        direction="up"
                                        tagName="span"
                                        className="target"
                                        useDefaultStyles
                                    >
                                        <button className={`main-item-style mr-15 non-click`}>
                                            Редактировать
                                        </button>
                                    </Tooltip>
                                    : <button
                                        className={`main-item-style mr-15`}
                                        onClick={this.interactionWithOrderModal}>
                                        Редактировать
                                    </button>
                            }
                            <button
                                className={'main-item-style main-item-style_danger'}
                                onClick={this.cancelOrder}>
                                Отменить
                            </button>
                        </div>
                        : null
                }
                {
                    type === 'admin'
                        ?
                        <>
                        </>
                        : null
                }
            </div>
        )
    }

    renderModalWindow = () => {
        const editCurrentOrder = new EditCurrentOrder()
        const orderInfo = JSON.parse(JSON.stringify(this.state.orderInfo))
        editCurrentOrder.setOrderInfo(orderInfo)
        return (
            <OrderModalForm
                trySendOrder={false}
                isAuth={true}
                isEdit={true}
                isOpen={this.state.isOrderModalOpen}
                onClose={this.interactionWithOrderModal}
                editSentOrder={editSentOrder}
                editOrder={editCurrentOrder.getOrderInfo()}
                removeProductFromSentOrder={editCurrentOrder.removeProduct}
                addProductToSentOrder={editCurrentOrder.addProduct}
                editSentOrderItem={editCurrentOrder.editOrder}
                changeSentOrderName={editCurrentOrder.editName}
            />
        )
    }

    render() {
        if (!this.state.loading && this.state.access) {
            const orderInfo = this.state.orderInfo
            return (
                <div className={'order-page'}>
                    {
                        this.state.isOrderModalOpen
                            ? this.renderModalWindow()
                            : null
                    }

                    <div className={'container'}>
                        <div className="row">
                            <div className="col-lg-2 col-md-1 col-sm-0"/>
                            <div className="col-lg-8 col-md-10 col-sm-12">
                                <div className="app__main-content">
                                    <h2 className={'mb-30'}>
                                        Информация о заказе {orderInfo.id}
                                    </h2>
                                    {
                                        this.renderButtonSection(orderInfo)
                                    }

                                    <div className={'mb-3 mt-3'}/>

                                    {
                                        this.renderOrderInfoPage(orderInfo)
                                    }
                                </div>
                                <Footer/>
                            </div>
                            <div className="col-lg-2 col-md-1 col-sm-0"/>
                        </div>
                    </div>
                </div>
            )
        } else if (this.state.loading && !this.state.access)
            return (<BigPreloader/>)
        else if (!this.state.loading && !this.state.access)
            return (
                <div className={'page-404'}>
                    <div className={'page-404__content'}>
                        <h2 className={'mb-3'}>У вас нет доступа к данному заказу!</h2>
                        <NavLink to={'/'} className={'btn btn-danger'}>
                            На главную <i className="fa fa-home ml-1" aria-hidden="true"/>
                        </NavLink>
                    </div>
                </div>
            )
    }
}

function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        cancelOrder: (id) => dispatch(cancelOrder(id)),
        subscribeOrderInfo: (listening, id) => dispatch(subscribeOrderInfo(listening, id)),
        reOrder: (orderInfo) => dispatch(reOrder(orderInfo))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderPage)