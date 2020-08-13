import React, {Component} from 'react'
import './OrderModalForm.scss'
import {connect} from 'react-redux'
import {
    addProductToOrder, changeName,
    deleteOrder,
    editOrderItem,
    removeProductFromOrder,
    sendOrder
} from '../../store/order/orderActions'
import Form from '../../components/OrderModalWindows/Form'
import toaster from 'toasted-notes'
import InputInformation from '../../components/InputInformation/InputInformation'
import {setUserInfo} from '../../store/user/userActions'
import OrderListAndMenu from '../../components/OrderModalWindows/OrderListAndMenu'
import InputName from '../../components/OrderModalWindows/InputName'
import ModalWindow from '../../components/UI/ModalWindow/ModalWindow'
import InputAddress from '../../components/OrderModalWindows/InputAddress'


//Данный контейнер отвечает за рендеринг модального окна
class OrderModalForm extends Component {
    state = {
        activeWin: 'list', // Активный комонент, list - список заказов, form - форма ввода, name - имя заведения, info - инф о клиенте
        activeItem: null, // В переменной хранится элемент, который выбран для редактирования
        infFromMap: {},
        update: false // Костыль
    }

    //Функция меняющая активное окно
    changeActiveWindow = (activeWin) => {
        this.setState({
            activeWin
        })
    }

    // Обработчик, закрывает модальное окно и чистит содержимое
    close = () => {
        this.props.onClose()
        this.changeActiveWindow('list')
    }

    // Обработчик, возвращает activeItem в начальное состояние
    resetActiveItem = () => {
        this.setState({
            activeItem: null
        })
    }

    // Обработчик, кладёт в переменную activeItem эл-т, редактировать который хочет пользователь и открывает конструктор заказа
    editProduct = (e) => {
        e.preventDefault()
        this.props.isEdit
            ?
            this.setState({
                activeItem: this.props.editOrder.order[e.target.id]
            })
            :
            this.setState({
                activeItem: this.props.order[e.target.id]
            })

        this.changeActiveWindow('form')
    }

    // Обработчик, добавляет в ранее отправленный заказ продукт
    addSentOrder = (item) => {
        this.props.addProductToSentOrder(item)
        this.setState({
            update: !this.props.update
        })
        toaster.notify('Продукт добавлен в заказ!', {
            position: 'bottom-right',
            duration: 3000
        })
    }

    // Обработчик, редактирует в ранее отправленном закае продукт
    editSentOrderItem = (product) => {
        this.props.editSentOrderItem(product)
        this.setState({
            update: !this.props.update
        })
        toaster.notify('Продукт отредактирован!', {
            position: 'bottom-right',
            duration: 3000
        })
    }

    removeProductFromSentOrder = (id) => {
        this.props.removeProductFromSentOrder(id)
        this.setState({
            update: !this.props.update
        })
    }

    sendOrderHandler = () => {
        if (this.props.isAuth === true) {
            this.changeActiveWindow('map')
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
            this.props.editSentOrder(this.props.editOrder, fullOrderInfo)
            toaster.notify('Ваш заказ отредактирован!', {
                position: 'bottom-right',
                duration: 3000
            })
        } else {
            this.props.setUserInfo(fullOrderInfo)
            this.props.sendOrder(fullOrderInfo)

            toaster.notify('Ваш заказ отправлен!', {
                position: 'bottom-right',
                duration: 3000
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
            this.changeActiveWindow('info')
        } else
            toaster.notify('Укажите адрес и расчитате стоимость доставки!', {
                position: 'bottom-right',
                duration: 3000
            })
    }

    renderOrderListAndNavigationMenu = () => {
        return <OrderListAndMenu
            isEdit={this.props.isEdit}
            editProduct={this.editProduct}
            order={this.props.order}
            editOrder={this.props.editOrder}
            name={this.props.name}
            removeProductFromSentOrder={this.removeProductFromSentOrder}
            removeProductFromOrder={this.props.removeProductFromOrder}
            sendOrderHandler={this.sendOrderHandler}
            onClose={this.props.onClose}
            deleteOrder={this.props.deleteOrder}
            changeActiveWindow={this.changeActiveWindow}
        />
    }

    renderProductForm = () => {
        return <Form
            changeActiveWindow={this.changeActiveWindow}
            addProductToOrder={this.props.addProductToOrder}
            editOrderItem={this.props.editOrderItem}
            editSentOrderItem={this.editSentOrderItem}
            item={this.state.activeItem}
            resetActiveItem={this.resetActiveItem}
            isEdit={this.props.isEdit}
            addSentOrder={this.addSentOrder}
        />
    }

    renderInputName = () => {
        let name, changeName
        if (this.props.isEdit) {
            name = this.props.editOrder.name
            changeName = this.props.changeSentOrderName
        } else {
            name = this.props.name
            changeName = this.props.changeName
        }
        return <InputName
            changeActiveWindow={this.changeActiveWindow}
            name={name}
            changeName={changeName}
        />
    }

    renderInputAddress = () => {
        const options = {isEdit: this.props.isEdit, type: 'user'}
        if (this.props.isEdit) {
            options.address = this.props.editOrder.clientAddress
            options.coordinate = this.props.editOrder.coordinate
            options.deliveryValue = this.props.editOrder.deliveryValue
        }

        return (
            <InputAddress
                nextStep={this.nextStep}
                interactionWithDagger={this.changeActiveWindow}
                setAddressInfo={this.setAddressInfo}
                options={options}
            />
        )
    }

    renderInputInformation = () => {
        return (
            <InputInformation
                saveContactInformation={this.saveContactInformation}
                userInfo={this.props.userInfo}
                type={'user'}
                page={'order'}
                interactionWithDagger={this.changeActiveWindow}
            />
        )
    }

    renderContent = () => {
        return (
            <>
                {
                    this.state.activeWin === 'map'
                        ? this.renderInputAddress()
                        : <div className={'order-form'} key={'order-form'}>
                            {
                                this.state.activeWin === 'info'
                                    ? this.renderInputInformation()
                                    : <div className={'order-constructor'}>
                                        {this.state.activeWin === 'form'
                                            ? this.renderProductForm()
                                            : this.state.activeWin === 'list'
                                                ? this.renderOrderListAndNavigationMenu()
                                                : this.state.activeWin === 'name'
                                                    ? this.renderInputName()
                                                    : null
                                        }
                                    </div>
                            }
                        </div>
                }
            </>
        )
    }

    render() {
        return (
            <div className="order-modal-form">
                <ModalWindow
                    isOpen={this.props.isOpen}
                    onClose={this.close}
                    renderBody={this.renderContent}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        order: state.orderReducer.order,
        name: state.orderReducer.name,
        userInfo: state.userReducer.info
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addProductToOrder: (item, list) =>
            dispatch(addProductToOrder(item, list)),
        editOrderItem: (item, list) =>
            dispatch(editOrderItem(item, list)),
        removeProductFromOrder: (id, list) => dispatch(removeProductFromOrder(id, list)),
        sendOrder: (info) => dispatch(sendOrder(info)),
        deleteOrder: () => dispatch(deleteOrder()),
        changeName: (name) => dispatch(changeName(name)),
        setUserInfo: (info) => dispatch(setUserInfo(info))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderModalForm)