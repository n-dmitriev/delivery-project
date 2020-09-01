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
import ContactInformation from '../../components/OrderModalWindows/ContactInformation'


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

    tryToOpenContacts = () => {
        if (this.props.isAuth) {
            this.changeActiveWindow('contacts')
        } else {
            this.props.onClose()
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
            info.deliveryValue = this.props.orderInfo.deliveryValue
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
        const data = {clientAddress, coordinate, deliveryValue}
        if (this.props.isEdit)
            this.props.mergedSentOderData(data)
        else
            this.props.mergedData(data)
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

    saveCurrentData = () => {
        this.changeActiveWindow('result')
        const user = this.props.userInfo
        const data = {
            clientAddress: user.clientAddress, coordinate: user.coordinate, deliveryValue: user.deliveryValue,
            clientName: user.clientName, clientNumberPhone: user.clientNumberPhone
        }

        if (this.props.isEdit)
            this.props.mergedSentOderData(data)
        else
            this.props.mergedData(data)
    }

    renderOrderListAndNavigationMenu = () => {
        return (
            <div className={'order-form'} key={'order-form'}>
                <div className={'order-constructor'}>
                    <OrderListAndMenu
                        isEdit={this.props.isEdit}
                        editProduct={this.editProduct}
                        orderInfo={this.props.isEdit ? this.props.editOrder : this.props.orderInfo}
                        removeProduct={this.removeProduct}
                        tryToOpenContacts={this.tryToOpenContacts}
                        onClose={this.props.onClose}
                        deleteOrder={this.props.deleteOrder}
                        changeActiveWindow={this.changeActiveWindow}
                    />
                </div>
            </div>
        )
    }

    renderProductForm = () => {
        return (
            <div className={'order-form'} key={'order-form'}>
                <div className={'order-constructor'}>
                    <Form
                        changeActiveWindow={this.changeActiveWindow}
                        addProductToOrder={this.addProductToOrder}
                        editOrderItem={this.editOrderItem}
                        item={this.state.activeItem}
                        resetActiveItem={this.resetActiveItem}
                        isEdit={this.props.isEdit}
                    />
                </div>
            </div>
        )

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
        return (
            <div className={'order-form'} key={'order-form'}>
                <div className={'order-constructor'}>
                    <InputName
                        changeActiveWindow={this.changeActiveWindow}
                        name={name}
                        type={type}
                        changeName={changeName}
                    />
                </div>
            </div>
        )
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
            <div key={'order-form'}>
                <InputAddress
                    nextStep={this.nextStep}
                    interactionWithDagger={this.changeActiveWindow}
                    setAddressInfo={this.setAddressInfo}
                    options={options}
                />
            </div>
        )
    }

    renderInputInformation = () => {
        return (
            <div className={'order-form'} key={'order-form'}>
                <InputInformation
                    saveContactInformation={this.saveContactInformation}
                    userInfo={this.props.userInfo}
                    type={'user'}
                    page={'order'}
                    changeActiveWindow={this.changeActiveWindow}
                />
            </div>
        )
    }

    renderContactInformation = () => {
        return (
                <ContactInformation
                    saveCurrentData={this.saveCurrentData}
                    interactionWithDagger={this.changeActiveWindow}
                    userInfo={this.props.userInfo}
                />
        )
    }

    renderResult = () => {
        const orderInfo = this.props.isEdit ? this.props.editOrder : this.props.orderInfo
        return (
            <div className={'order-form'} key={'order-form'}>
                <h2 className={'mb-15'}>Итог</h2>
                <div className={'order-constructor__result'}>
                    <RenderFullOrderInfo
                        type={'order'}
                        orderInfo={orderInfo}
                    />
                </div>
                <div className="button-section mt-15">
                    <div className="main-item-style mr-2" onClick={() => this.changeActiveWindow('contacts')}>Назад</div>
                    <div className="main-item-style" onClick={this.sendOrderHandler}>Зазказать</div>
                </div>
            </div>
        )
    }

    renderContent = () => {
        const tabList = [
            {
                win: 'map',
                render: this.renderInputAddress
            },
            {
                win: 'info',
                render: this.renderInputInformation
            },
            {
                win: 'result',
                render: this.renderResult
            },
            {
                win: 'form',
                render: this.renderProductForm
            },
            {
                win: 'list',
                render: this.renderOrderListAndNavigationMenu
            },
            {
                win: 'name',
                render: this.renderInputName
            },
            {
                win: 'contacts',
                render: this.renderContactInformation
            }
        ]
        return (
            <>
                {
                    tabList.map(tab => {
                        if (this.state.activeWin === tab.win)
                            return tab.render()
                        else
                            return null
                    })
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