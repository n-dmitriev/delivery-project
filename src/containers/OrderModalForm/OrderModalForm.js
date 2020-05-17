import React, {Component} from 'react'
import './OrderModalForm.scss'
import {connect} from 'react-redux'
import {
    addProductToOrder, changeRestaurantName, changeShopName,
    deleteOrder,
    editOrderItem,
    removeProductFromOrder,
    sendOrder,
} from '../../store/order/orderActions'
import ProductForm from '../../components/OrderForms/ProductForm'
import {
    addProductToSentOrder,
    editSentOrder,
    editSentOrderItem,
    removeProductFromSentOrder,
} from '../../store/order/orderActions'
import toaster from 'toasted-notes'
import InputInformation from '../../components/InputInformation/InputInformation'
import {setUserInfo} from '../../store/user/userActions'
import TabPanel from '../../components/UI/TabPanel/TabPanel'
import OrderListAndMenu from '../../components/OrderForms/OrderListAndMenu'

//Данный контэйнер отвечает за рендеринг модального окна и отправку функций/перменных в качестве пропсов дочерним эл-там
class OrderModalForm extends Component {
    state = {
        activeTab: 'shop-tab', // текущее вкладка 2 состояния shop-tab и restaurant-tab
        formIsOpen: false, // флаг отвечающий за форму ввода, если false - рендерится заказ, true - рендерится форма ввода
        activeItem: null, // В переменной хранится текуший элемент, который выбран для редактирования
        send: false,
        currentWin: 'list'
    }

    //Функция открывающая/закрывающая форму ввода
    interactionWithDagger = () => {
        this.setState({
            formIsOpen: !this.state.formIsOpen,
        })
    }

    //Функция меняющая активную вкладку и закрывающая форму ввода
    clickItemHandler = (event) => {
        this.setState({
            activeTab: event.target.id,
            formIsOpen: false,
        })
    }

    // Отправка заказа, если пользователь не авторизоывался, открывается окно авторизации, после чего заказ отправляется на сервер
    sendOrderHandler = () => {
        if (this.props.isEdit === true) {
            this.props.onClose()
            this.props.editSentOrder(this.props.editItem)
            toaster.notify('Ваш заказ отредактирован!', {
                position: 'bottom-right',
                duration: null,
            })
        } else {
            if (this.props.isAuth === true) {
                this.setState({
                    send: true,
                })
            } else {
                this.props.onClose()
                this.props.trySendOrder(true)
                this.props.onOpenAuth()
                toaster.notify('Сперва зарегестируйтесь!', {
                    position: 'bottom-right',
                    duration: null,
                })
            }
        }
    }

    // Обработчик, возвращает activeItem в начальное состояние
    resetActiveItem = () => {
        this.setState({
            activeItem: null,
        })
    }

    // Обработчик, кладёт в переменную activeItem эл-т, редактировать который хочет пользователь и открывает конструктор заказа
    editItem = (e) => {
        e.preventDefault()
        this.props.isEdit === true
            ?
            this.setState({
                activeItem: this.props.editItem.order[e.target.id],
            })
            :
            this.state.activeTab === 'shop-tab'
                ? this.setState({
                    activeItem: this.props.shopOrder[e.target.id],
                })
                : this.setState({
                    activeItem: this.props.restaurantOrder[e.target.id],
                })

        this.interactionWithDagger()
    }

    addSentOrder = (item) => {
        this.props.addProductToSentOrder(this.props.editItem.id, item)
        toaster.notify('Продукт добавлен в заказ!', {
            position: 'bottom-right',
            duration: 3000,
        })
    }

    editSentOrderItem = (item) => {
        this.props.editSentOrderItem(this.props.editItem.id, item)
        toaster.notify('Продукт отредактирован!', {
            position: 'bottom-right',
            duration: 3000,
        })
    }


    saveContactInformation = (info) => {
        this.props.setUserInfo(info)
        this.props.sendOrder(info)
        this.setState({
            send: false,
        })
        this.props.onClose()
        toaster.notify('Ваш заказ отправлен!', {
            position: 'bottom-right',
            duration: null,
        })
    }

    close = () => {
        this.props.onClose()
        this.props.deleteOrder()
        this.setState({
            send: false,
        })
    }

    // Функция, рендерит заказ и навигационное меню
    renderOrderListAndNavigationMenu = () => {
        return <OrderListAndMenu
            isEdit={this.props.isEdit}
            editItem={this.props.editItem}
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
            editItem={this.editItem}
        />
    }

    renderProductForm = () => {
        return <ProductForm
            activeTab={this.state.activeTab}
            interactionWithDagger={this.interactionWithDagger}
            addProductToOrder={this.props.addProductToOrder}
            editOrderItem={this.props.editOrderItem}
            item={this.state.activeItem}
            nameOfRestaurant={this.props.nameOfRestaurant}
            nameOfShop={this.props.nameOfShop}
            resetActiveItem={this.resetActiveItem}
            changeShopName={this.props.changeShopName}
            changeRestaurantName={this.props.changeRestaurantName}
            isEdit={this.props.isEdit || false}
            addSentOrder={this.addSentOrder}
            editSentOrder={this.editSentOrderItem}
        />
    }

    renderTabPanel = () => {
        return  <TabPanel
            clickItemHandler={this.clickItemHandler}
            activeTab={this.state.activeTab}
            tabList={[{
                title: 'Из магазина',
                id: 'shop-tab',
            }, {
                title: 'Из заведения',
                id: 'restaurant-tab',
            }]}
        />

    }

    render() {
        if (this.props.isOpen === false) return null
        return (
            <>
                <div className={'order-form'} key={'order-form'}>
                    <span className="dagger dagger_delete" onClick={this.close}/>
                    {
                        this.state.send
                            ? <div className={'user-inf-input'}>
                                <InputInformation
                                    saveContactInformation={this.saveContactInformation}
                                    userInfo={this.props.userInfo}
                                    type={'user'}
                                />
                            </div>
                            : <>
                                {
                                    this.props.isEdit === true
                                        ? null
                                        : this.renderTabPanel()

                                }

                                <div className={'order-constructor'}>
                                    {this.state.formIsOpen === true
                                        ? this.renderProductForm()
                                        : this.renderOrderListAndNavigationMenu()
                                    }
                                </div>
                            </>
                    }
                </div>
                <div className={'bg'} onClick={this.props.onClose}/>
            </>
        )
    }
}

function mapStateToProps(state) {
    return {
        shopOrder: state.orderReducer.shopOrder,
        restaurantOrder: state.orderReducer.restaurantOrder,
        nameOfRestaurant: state.orderReducer.nameOfRestaurant,
        nameOfShop: state.orderReducer.nameOfShop,
        userInfo: state.userReducer.info,
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
        editSentOrder: (orderInfo) => dispatch(editSentOrder(orderInfo)),
        setUserInfo: (info) => dispatch(setUserInfo(info)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderModalForm)