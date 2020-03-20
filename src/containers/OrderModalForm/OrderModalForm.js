import React, {Component} from 'react'
import './OrderModalForm.scss'
import {connect} from 'react-redux'
import OrderConstructor from '../../components/OrderConstructor/OrderConstructor'
import {
    addProductToOrder, changeRestaurantName, changeShopName,
    deleteOrder,
    editOrderItem,
    removeProductFromOrder,
    sendOrder,
} from '../../store/actions/currentOrder'

//Данный контэйнер отвечает за рендеринг модального окна и отправку функций/перменных в качестве пропсов дочерним эл-там
class OrderModalForm extends Component {
    state = {
        activeTab: 'shop-tab', // текущее вкладка 2 состояния shop-tab и restaurant-tab
        formIsOpen: false, // флаг отвечающий за форму ввода, если false - рендерится заказ, true - рендерится форма ввода
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
            formIsOpen: false
        })
    }

    render() {
        if (this.props.isOpen === false) return null
        return (
            <>
                <div className={'order-form'} key={'order-form'}>
                    <span className="dagger dagger_delete" onClick={() =>{
                        this.props.onClose()
                        this.props.deleteOrder()
                    }}></span>
                    <div className={'order-form__selector'}>
                        <div
                            id={'shop-tab'}
                            className={this.state.activeTab === 'shop-tab'
                                ? 'order-form__select order-form__select_active'
                                : 'order-form__select'}
                            onClick={this.clickItemHandler}>
                            <span className={'non-click'}>Заказать из магазина</span>
                        </div>
                        <div
                            id={'restaurant-tab'}
                            className={this.state.activeTab === 'restaurant-tab'
                                ? 'order-form__select order-form__select_active'
                                : 'order-form__select'}
                            onClick={this.clickItemHandler}>
                            <span className={'non-click'}>Заказать из заведения</span>
                        </div>

                    </div>

                    <OrderConstructor
                        activeTab={this.state.activeTab} // Текущая вклака
                        shopOrder={this.props.shopOrder} // Коллекция в которой хранится текущий заказ из магазина
                        restaurantOrder={this.props.restaurantOrder} // Коллекция в которой хранится текущий заказ из ресторана
                        addProductToOrder={this.props.addProductToOrder} // Фу-я, добавляет продукт в заказ, на вход получает тип коллекции и заказ
                        removeProductFromOrder={this.props.removeProductFromOrder} // Фу-я, удаляет продукт из коллекции, на вход получает тип коллекции и id
                        editOrderItem={this.props.editOrderItem}// Фу-я, редактирует продукт в коллекции, на вход получает заменяющий объект и тип коллекции
                        sendOrder={this.props.sendOrder} // Фу-я, отпавляет текущий заказ на сервер
                        deleteOrder={this.props.deleteOrder} // Фу-я, удаляет текущий заказ
                        interactionWithDagger={this.interactionWithDagger} // Фу-я, закрывает/открывает форму ввода
                        formIsOpen={this.state.formIsOpen} //Флаг, открыта ли форма
                        nameOfRestaurant={this.props.nameOfRestaurant} // Название ресторана введённое пользователем
                        nameOfShop={this.props.nameOfShop} // Название магазина введённое пользователем
                        changeShopName={this.props.changeShopName} // Фу-я, меняет название магазина
                        changeRestaurantName={this.props.changeRestaurantName} // Фу-я, меняет название ресторана
                        close={this.props.onClose} //Закрывает модальное окно
                    />
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
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addProductToOrder: (item, list) =>
            dispatch(addProductToOrder(item, list)),
        editOrderItem: (item, list) =>
            dispatch(editOrderItem(item, list)),
        removeProductFromOrder: (id, list) => dispatch(removeProductFromOrder(id,list)),
        sendOrder: () => dispatch(sendOrder()),
        deleteOrder: () => dispatch(deleteOrder()),
        changeShopName: (name) => dispatch(changeShopName(name)),
        changeRestaurantName: (name) => dispatch(changeRestaurantName(name))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderModalForm)