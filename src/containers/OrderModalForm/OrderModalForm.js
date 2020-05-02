import React, {Component} from 'react'
import './OrderModalForm.scss'
import {connect} from 'react-redux'
import {
    addProductToOrder, changeRestaurantName, changeShopName,
    deleteOrder,
    editOrderItem,
    removeProductFromOrder,
    sendOrder,
} from '../../store/currentOrder/orderActions'
import ProductForm from '../../components/ProductForm/ProductForm'
import {
    addProductToSentOrder,
    editSentOrder,
    editSentOrderItem,
    removeProductFromSentOrder,
} from '../../store/currentOrder/orderActions'
import toaster from 'toasted-notes'
import InputInformation from '../../components/InputInformation/InputInformation'
import {setUserInfo} from '../../store/userInformation/userActions'

//Данный контэйнер отвечает за рендеринг модального окна и отправку функций/перменных в качестве пропсов дочерним эл-там
class OrderModalForm extends Component {
    state = {
        activeTab: 'shop-tab', // текущее вкладка 2 состояния shop-tab и restaurant-tab
        formIsOpen: false, // флаг отвечающий за форму ввода, если false - рендерится заказ, true - рендерится форма ввода
        activeItem: null, // В переменной хранится текуший элемент, который выбран для редактирования
        send: false,
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
    sendOrder = () => {
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

    // Обработчик, удаляет выбранный продукт из заказа
    deleteItem = (e) => {
        e.stopPropagation()
        if (this.props.isEdit === true)
            this.props.removeProductFromSentOrder(this.props.editItem.id, e.target.id)
        else
            this.props.removeProductFromOrder(e.target.id, this.state.activeTab)

        toaster.notify('Продукт удалён из заказа!', {
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

    // Функция, рендерит заказ и навигационное меню
    renderOrderListAndNavigationMenu() {
        let list
        this.props.isEdit ? list = this.props.editItem.order : list = this.props.shopOrder
        return (
            <div className={'order-constructor__content'}>
                {
                    // Вывод названия заведения
                    this.state.activeTab === 'shop-tab'
                        ? this.props.nameOfShop !== '' || this.props.isEdit === true
                        ? <>
                            <div
                                className={'order-constructor__name'}
                                //При нажатии на название, сбрасываем его и открываем форму редактирования
                                onClick={() => {
                                    if (this.props.isEdit !== true) {
                                        this.props.changeShopName('')
                                        this.interactionWithDagger()
                                    }
                                }}>
                                {this.props.isEdit ? this.props.editItem.name : this.props.nameOfShop}
                                <i className="fa fa-pencil-square-o fa-animate" aria-hidden="true"/>
                            </div>
                            <div className={'order-constructor__order-list'}>
                                {list.map((item, count) => (
                                    <div key={item.id} id={count} className={'order-constructor__tab'}
                                         onClick={this.editItem}>
                                        {item.name}, {item.quantity}, {item.brand}
                                        <span id={item.id} className={'dagger dagger_delete'}
                                              onClick={this.deleteItem}/>
                                    </div>
                                ))}
                            </div>
                        </>
                        : null
                        : this.props.nameOfRestaurant !== ''
                        ? <>
                            <div
                                className={'order-constructor__name'}
                                //При нажатии на название, сбрасываем его и открываем форму редактирования
                                onClick={() => {
                                    this.props.changeRestaurantName('')
                                    this.interactionWithDagger()
                                }}
                            >
                                {this.props.nameOfRestaurant}
                                <i className="fa fa-pencil-square-o fa-animate" aria-hidden="true"/>
                            </div>
                            <div className={'order-constructor__order-list'}>
                                {this.props.restaurantOrder.map((item, count) => (
                                    <div key={item.id} id={count} className={'order-constructor__tab'}
                                         onClick={this.editItem}>
                                        {item.name} {item.quantity} {item.price} {item.description}
                                        <span id={item.id} className={'dagger dagger_delete'}
                                              onClick={this.deleteItem}/>
                                    </div>
                                ))}
                            </div>
                        </>
                        : null
                }
                {
                    // Вывод навигационной панели, если заказ пуст, нет кнопок
                    (this.state.activeTab === 'shop-tab' && Object.keys(this.props.shopOrder).length !== 0)
                    || (this.state.activeTab === 'restaurant-tab' && Object.keys(this.props.restaurantOrder).length !== 0) || this.props.isEdit === true
                        ? <div className="button-section button-section_bottom mb-1">
                            <button className="main-item-style mr-15 ml-1" onClick={this.sendOrder}>
                                {this.props.isEdit === true ? 'Применить' : 'Заказать'}
                            </button>
                            <button className="main-item-style main-item-style_danger" onClick={() =>
                                this.props.isEdit === true ? this.props.onClose() : this.props.deleteOrder()
                            }>Отменить
                            </button>
                            <span
                                className={'dagger dagger_add'}
                                onClick={this.interactionWithDagger}>
                            </span>
                        </div>
                        : <>
                            <p className={'placeholder'}>Вы ещё ничего не добавили в заказ</p>
                            <span
                                className={'dagger dagger_add'}
                                onClick={this.interactionWithDagger}>
                            </span>
                        </>
                }
            </div>
        )
    }

    render() {
        if (this.props.isOpen === false) return null
        return (
            <>
                <div className={'order-form'} key={'order-form'}>
                    <span className="dagger dagger_delete" onClick={() => {
                        this.props.onClose()
                        this.props.deleteOrder()
                        this.setState({
                            send: false,
                        })
                    }}/>
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
                                        : <div className={'order-form__selector'}>
                                            <div
                                                id={'shop-tab'}
                                                className={this.state.activeTab === 'shop-tab'
                                                    ? 'order-form__select order-form__select_active'
                                                    : 'order-form__select'}
                                                onClick={this.clickItemHandler}>
                                                <span className={'non-click'}>Из магазина</span>
                                            </div>
                                            <div
                                                id={'restaurant-tab'}
                                                className={this.state.activeTab === 'restaurant-tab'
                                                    ? 'order-form__select order-form__select_active'
                                                    : 'order-form__select'}
                                                onClick={this.clickItemHandler}>
                                                <span className={'non-click'}>Из заведения</span>
                                            </div>
                                        </div>
                                }

                                <div className={'order-constructor'}>
                                    {this.state.formIsOpen === true
                                        ? <ProductForm
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
        shopOrder: state.currentOrder.shopOrder,
        restaurantOrder: state.currentOrder.restaurantOrder,
        nameOfRestaurant: state.currentOrder.nameOfRestaurant,
        nameOfShop: state.currentOrder.nameOfShop,
        userInfo: state.userInfReducer.info,
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