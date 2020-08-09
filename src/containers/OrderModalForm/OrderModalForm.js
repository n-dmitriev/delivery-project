import React, {Component} from 'react'
import './OrderModalForm.scss'
import {connect} from 'react-redux'
import {
    addProductToOrder, changeRestaurantName, changeShopName,
    deleteOrder,
    editOrderItem,
    removeProductFromOrder,
    sendOrder
} from '../../store/order/orderActions'
import ProductForm from '../../components/OrderModalWindows/Form'
import {
    addProductToSentOrder,
    editSentOrder,
    editSentOrderItem,
    removeProductFromSentOrder
} from '../../store/order/orderActions'
import toaster from 'toasted-notes'
import InputInformation from '../../components/InputInformation/InputInformation'
import {setUserInfo} from '../../store/user/userActions'
import TabPanel from '../../components/UI/TabPanel/TabPanel'
import OrderListAndMenu from '../../components/OrderModalWindows/OrderListAndMenu'
import InputName from '../../components/OrderModalWindows/InputName'
import ModalWindow from '../../components/UI/ModalWindow/ModalWindow'
import InputAddress from '../../components/OrderModalWindows/InputAddress'


//Данный контейнер отвечает за рендеринг модального окна
class OrderModalForm extends Component {
    state = {
        activeTab: 'shop-tab', // Активная вкладка 2 состояния shop-tab и restaurant-tab
        activeWin: 'list', // Активный комонент, list - список заказов, form - форма ввода, name - имя заведения, info - инф о клиенте
        activeItem: null, // В переменной хранится элемент, который выбран для редактирования
        infFromMap: {}
    }

    //Функция открывающая/закрывающая форму ввода
    interactionWithDagger = (activeWin) => {
        this.setState({
            activeWin
        })
    }

    //Функция меняющая активную вкладку
    clickItemHandler = (event) => {
        this.setState({
            activeTab: event.target.id,
            activeWin: 'list'
        })
    }

    // Обработчик, возвращает activeItem в начальное состояние
    resetActiveItem = () => {
        this.setState({
            activeItem: null
        })
    }

    // Обработчик, закрывает модальное окно и чистит содержимое
    close = () => {
        this.props.onClose()
        this.interactionWithDagger('list')
    }


    // Обработчик, кладёт в переменную activeItem эл-т, редактировать который хочет пользователь и открывает конструктор заказа
    editItemHandler = (e) => {
        e.preventDefault()
        this.props.isEdit === true
            ?
            this.setState({
                activeItem: this.props.editItem.order[e.target.id]
            })
            :
            this.state.activeTab === 'shop-tab'
                ? this.setState({
                    activeItem: this.props.shopOrder[e.target.id]
                })
                : this.setState({
                    activeItem: this.props.restaurantOrder[e.target.id]
                })

        this.interactionWithDagger('form')
    }

    // Обработчик, добавляет в ранее отправленный заказ продукт
    addSentOrder = (item) => {
        this.props.addProductToSentOrder(this.props.editItem.id, item)
        toaster.notify('Продукт добавлен в заказ!', {
            position: 'bottom-right',
            duration: 3000
        })
    }

    // Обработчик, редактирует в ранее отправленном закае продукт
    editSentOrderItem = (item) => {
        this.props.editSentOrderItem(this.props.editItem.id, item)
        toaster.notify('Продукт отредактирован!', {
            position: 'bottom-right',
            duration: 3000
        })
    }


    sendOrderHandler = () => {
        if (this.props.isAuth === true) {
            this.interactionWithDagger('map')
        } else {
            this.props.onClose()
            this.props.trySendOrder(true)
            this.props.onOpenAuth()
            toaster.notify('Сперва зарегистируйтесь!', {
                position: 'bottom-right',
                duration: null
            })
        }
    }

    saveContactInformation = (info) => {
        const fullOrderInfo = Object.assign(this.state.infFromMap, info)
        if (this.props.isEdit === true) {
            this.props.editSentOrder(this.props.editItem, fullOrderInfo)
            toaster.notify('Ваш заказ отредактирован!', {
                position: 'bottom-right',
                duration: null
            })
        } else {
            this.props.setUserInfo(fullOrderInfo)
            this.props.sendOrder(fullOrderInfo)

            toaster.notify('Ваш заказ отправлен!', {
                position: 'bottom-right',
                duration: null
            })
        }
        this.close()
    }

    setAddressInfo = (address, coordinate, deliveryValue) => {
        this.setState({
            infFromMap: {address, coordinate, deliveryValue}
        })
    }

    nextStep = () => {
        if (this.state.infFromMap.address?.replace(/\s+/g, '') !== '' && this.state.infFromMap.deliveryValue > 0) {
            this.interactionWithDagger('info')
        } else
            toaster.notify('Укажите адрес и расчитате стоимость доставки!', {
                position: 'bottom-right',
                duration: 3000
            })
    }

    renderOrderListAndNavigationMenu = () => {
        return <OrderListAndMenu
            isEdit={this.props.isEdit}
            editItem={this.props.editItem}
            editItemHandler={this.editItemHandler}
            shopOrder={this.props.shopOrder}
            restaurantOrder={this.props.restaurantOrder}
            activeTab={this.state.activeTab}
            nameOfShop={this.props.nameOfShop}
            nameOfRestaurant={this.props.nameOfRestaurant}
            removeProductFromSentOrder={this.props.removeProductFromSentOrder}
            removeProductFromOrder={this.props.removeProductFromOrder}
            sendOrderHandler={this.sendOrderHandler}
            onClose={this.props.onClose}
            deleteOrder={this.props.deleteOrder}
            interactionWithDagger={this.interactionWithDagger}
        />
    }

    renderProductForm = () => {
        return <ProductForm
            activeTab={this.state.activeTab}
            interactionWithDagger={this.interactionWithDagger}
            addProductToOrder={this.props.addProductToOrder}
            editOrderItem={this.props.editOrderItem}
            item={this.state.activeItem}
            resetActiveItem={this.resetActiveItem}
            isEdit={this.props.isEdit || false}
            addSentOrder={this.addSentOrder}
            editSentOrder={this.editSentOrderItem}
        />
    }

    renderInputName = () => {
        return <InputName
            interactionWithDagger={this.interactionWithDagger}
            nameOfRestaurant={this.props.nameOfRestaurant}
            nameOfShop={this.props.nameOfShop}
            changeShopName={this.props.changeShopName}
            changeRestaurantName={this.props.changeRestaurantName}
            activeTab={this.state.activeTab}
        />
    }

    renderTabPanel = () => {
        return <TabPanel
            clickItemHandler={this.clickItemHandler}
            activeTab={this.state.activeTab}
            tabList={[{
                title: 'Из магазина',
                id: 'shop-tab'
            }, {
                title: 'Из заведения',
                id: 'restaurant-tab'
            }]}
        />
    }

    renderContent = () => {
        return (
            <>
                <div className={'order-form'} key={'order-form'}>
                    {
                        ['form', 'list', 'name'].indexOf(this.state.activeWin) !== -1
                            ? <>
                                {
                                    this.props.isEdit === true
                                        ? <div className={'mb-5'}/>
                                        : this.renderTabPanel()
                                }

                                <div className={'order-constructor'}>
                                    {this.state.activeWin === 'form'
                                        ? this.renderProductForm()
                                        : this.state.activeWin === 'list'
                                            ? this.renderOrderListAndNavigationMenu()
                                            : this.state.activeWin === 'name'
                                                ? this.renderInputName()
                                                : null
                                    }
                                </div>
                            </>
                            : null
                    }
                    {
                        this.state.activeWin === 'info'
                            ? <div className={'user-inf-input'}>
                                <InputInformation
                                    saveContactInformation={this.saveContactInformation}
                                    userInfo={this.props.userInfo}
                                    type={'user'}
                                    page={'order'}
                                    interactionWithDagger={this.interactionWithDagger}
                                />
                            </div>
                            : null
                    }
                </div>
                {
                    this.state.activeWin === 'map'
                        ? <InputAddress
                            nextStep={this.nextStep}
                            interactionWithDagger={this.interactionWithDagger}
                            setAddressInfo={this.setAddressInfo}
                        />
                        : null
                }
            </>
        )
    }

    render() {
        return (
            <ModalWindow
                isOpen={this.props.isOpen}
                onClose={this.close}
                renderBody={this.renderContent}
            />
        )
    }
}

function mapStateToProps(state) {
    return {
        shopOrder: state.orderReducer.shopOrder,
        restaurantOrder: state.orderReducer.restaurantOrder,
        nameOfRestaurant: state.orderReducer.nameOfRestaurant,
        nameOfShop: state.orderReducer.nameOfShop,
        userInfo: state.userReducer.info
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addProductToOrder: (item, list) =>
            dispatch(addProductToOrder(item, list)),
        editOrderItem: (item, list) =>
            dispatch(editOrderItem(item, list)),
        removeProductFromOrder: (id, list) => dispatch(removeProductFromOrder(id, list)),
        sendOrder: (info) => dispatch(sendOrder(info)),
        deleteOrder: () => dispatch(deleteOrder()),
        changeShopName: (name) => dispatch(changeShopName(name)),
        changeRestaurantName: (name) => dispatch(changeRestaurantName(name)),
        removeProductFromSentOrder: (listid, id) => dispatch(removeProductFromSentOrder(listid, id)),
        addProductToSentOrder: (listid, item) => dispatch(addProductToSentOrder(listid, item)),
        editSentOrderItem: (listid, item) => dispatch(editSentOrderItem(listid, item)),
        editSentOrder: (orderInfo, userInfo) => dispatch(editSentOrder(orderInfo, userInfo)),
        setUserInfo: (info) => dispatch(setUserInfo(info))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderModalForm)