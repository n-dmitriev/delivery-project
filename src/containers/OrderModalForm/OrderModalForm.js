import React, {Component} from 'react'
import './OrderModalForm.scss'
import {connect} from 'react-redux'
import {
    addProductToOrder,
    deleteOrder,
    editOrderItem, mergedData,
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
import RenderFullOrderInfo from '../../components/RenderOrderList/RenderFullOrderInfo'


//Данный контейнер отвечает за рендеринг модального окна
class OrderModalForm extends Component {
    state = {
        activeWin: 'list', // Активный комонент, list - список заказов, form - форма ввода, name - имя заведения, info - инф о клиенте
        activeItem: null, // В переменной хранится элемент, который выбран для редактирования
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
            activeItem: null,
            activeWin: 'list'
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
                activeItem: this.props.orderInfo.order[e.target.id]
            })

        this.changeActiveWindow('form')
    }

    // Обработчик, добавляет в ранее отправленный заказ продукт
    addProductToOrder = (item) => {
        if (this.props.isEdit)
            this.props.addProductToSentOrder(item)
        else
            this.props.addProductToOrder(item)
        this.setState({
            update: !this.props.update
        })
        toaster.notify('Продукт добавлен в заказ!', {
            position: 'bottom-right',
            duration: 3000
        })
    }

    // Обработчик, редактирует в ранее отправленном закае продукт
    editOrderItem = (product) => {
        if (this.props.isEdit)
            this.props.editSentOrderItem(product)
        else
            this.props.editOrderItem(product)
        this.setState({
            update: !this.props.update
        })
        toaster.notify('Продукт отредактирован!', {
            position: 'bottom-right',
            duration: 3000
        })
    }

    removeProduct = (id) => {
        if (this.props.isEdit)
            this.props.removeProductFromSentOrder(id)
        else
            this.props.removeProductFromOrder(id)
        this.setState({
            update: !this.props.update
        })
    }

    tryToOpenMap = () => {
        if (this.props.isAuth) {
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
        this.changeActiveWindow('result')
        if (this.props.isEdit) {
            this.props.mergedSentOderData(info)
        } else {
            this.props.mergedData(info)
            info.clientAddress = this.props.orderInfo.clientAddress
            info.coordinate = this.props.orderInfo.coordinate
            this.props.setUserInfo(info)
        }
    }

    sendOrderHandler = () => {
        if (this.props.isEdit) {
            this.props.editSentOrder(this.props.editOrder)
            toaster.notify('Ваш заказ отредактирован!', {
                position: 'bottom-right',
                duration: 3000
            })
        } else {
            this.props.sendOrder(this.props.orderInfo)
            toaster.notify('Ваш заказ отправлен!', {
                position: 'bottom-right',
                duration: 3000
            })
        }
        this.close()
    }

    setAddressInfo = (clientAddress, coordinate, deliveryValue) => {
        if (this.props.isEdit)
            this.props.mergedSentOderData({
                clientAddress, coordinate, deliveryValue
            })
        else
            this.props.mergedData({
                clientAddress, coordinate, deliveryValue
            })
    }

    checkingForCoordinate = () => {
        return (!this.props.isEdit && this.props.orderInfo.clientAddress && this.props.orderInfo.deliveryValue > 0)
            || (this.props.isEdit && this.props.editOrder.clientAddress && this.props.editOrder.deliveryValue > 0)

    }

    nextStep = () => {
        if (this.checkingForCoordinate()) {
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
            orderInfo={this.props.isEdit ? this.props.editOrder : this.props.orderInfo}
            removeProduct={this.removeProduct}
            tryToOpenMap={this.tryToOpenMap}
            onClose={this.props.onClose}
            deleteOrder={this.props.deleteOrder}
            changeActiveWindow={this.changeActiveWindow}
        />
    }

    renderProductForm = () => {
        return <Form
            changeActiveWindow={this.changeActiveWindow}
            addProductToOrder={this.addProductToOrder}
            editOrderItem={this.editOrderItem}
            item={this.state.activeItem}
            resetActiveItem={this.resetActiveItem}
            isEdit={this.props.isEdit}
        />
    }

    renderInputName = () => {
        let name, changeName, type
        if (this.props.isEdit) {
            name = this.props.editOrder.name
            type = this.props.editOrder.type
            changeName = this.props.mergedSentOderData
        } else {
            name = this.props.orderInfo.name
            type = this.props.orderInfo.type
            changeName = this.props.mergedData
        }
        return <InputName
            changeActiveWindow={this.changeActiveWindow}
            name={name}
            type={type}
            changeName={changeName}
        />
    }

    renderInputAddress = () => {
        const edit = this.checkingForCoordinate()
        const options = {isEdit: edit, type: 'user'}
        if (edit) {
            if (this.props.isEdit) {
                options.address = this.props.editOrder.clientAddress
                options.coordinate = this.props.editOrder.coordinate
                options.deliveryValue = this.props.editOrder.deliveryValue
            } else {
                options.address = this.props.orderInfo.clientAddress
                options.coordinate = this.props.orderInfo.coordinate
                options.deliveryValue = this.props.orderInfo.deliveryValue
            }
        } else {
            options.address = this.props.userInfo.clientAddress
            options.coordinate = this.props.userInfo.coordinate
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
                changeActiveWindow={this.changeActiveWindow}
            />
        )
    }

    renderResult = () => {
        const orderInfo = this.props.isEdit ? this.props.editOrder : this.props.orderInfo
        return (
            <>
                <h2 className={'mb-15'}>Итог</h2>
                <div className={'order-constructor__result'}>
                    <RenderFullOrderInfo
                        type={'order'}
                        orderInfo={orderInfo}
                    />
                </div>
                <div className="button-section mt-15">
                    <div className="main-item-style mr-2" onClick={() => this.changeActiveWindow('info')}>Назад</div>
                    <div className="main-item-style" onClick={this.sendOrderHandler}>Зазказать</div>
                </div>
            </>
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
                                    : this.state.activeWin === 'result'
                                    ? this.renderResult()
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
        orderInfo: state.orderReducer.orderInfo,
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
        setUserInfo: (info) => dispatch(setUserInfo(info)),
        mergedData: (data) => dispatch(mergedData(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderModalForm)