import React, {Component} from 'react'
import toaster from 'toasted-notes'

export default class OrderListAndMenu extends Component {

    //При нажатии на название, открываем форму редактирования
    editName = () => {
        if (this.props.isEdit !== true) {
            this.props.interactionWithDagger('name')
        }
    }

    // Обработчик, удаляет выбранный продукт из заказа
    deleteItem = (e) => {
        e.stopPropagation()
        if (this.props.isEdit === true)
            this.props.removeProductFromSentOrder(this.props.editItem.id, e.target.id)
        else
            this.props.removeProductFromOrder(e.target.id, this.props.activeTab)

        toaster.notify('Продукт удалён из заказа!', {
            position: 'bottom-right',
            duration: 3000
        })
    }

    addedNewOrderItem = () => {
        if (((this.props.nameOfShop === '' && this.props.activeTab === 'shop-tab') || (this.props.nameOfRestaurant === '' && this.props.activeTab === 'restaurant-tab')) && !this.props.isEdit)
            this.props.interactionWithDagger('name')
        else
            this.props.interactionWithDagger('form')
    }

    render() {
        const list = this.props.isEdit ? this.props.editItem?.order : this.props.shopOrder
        if (list)
            return (
                <div className={'order-constructor__content'}>
                    {
                        // Вывод названия заведения
                        this.props.activeTab === 'shop-tab'
                            ? this.props.nameOfShop !== '' || this.props.isEdit === true
                            ? <>
                                <div
                                    className={'order-constructor__name'}
                                    onClick={this.editName}>
                                    {this.props.isEdit ? this.props.editItem.name : this.props.nameOfShop}
                                    <i className="fa fa-pencil-square-o fa-animate" aria-hidden="true"/>
                                </div>
                                <div className={'order-constructor__order-list'}>
                                    {list.map((item, count) => (
                                        <div key={item.id} id={count} className={'order-constructor__tab'}
                                             onClick={this.props.editItemHandler}>
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
                                <div className={'order-constructor__name'} onClick={this.editName}>
                                    {this.props.nameOfRestaurant}
                                    <i className="fa fa-pencil-square-o fa-animate" aria-hidden="true"/>
                                </div>
                                <div className={'order-constructor__order-list'}>
                                    {this.props.restaurantOrder.map((item, count) => (
                                        <div key={item.id} id={count} className={'order-constructor__tab'}
                                             onClick={this.props.editItemHandler}>
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
                        (this.props.activeTab === 'shop-tab' && Object.keys(this.props.shopOrder).length !== 0)
                        || (this.props.activeTab === 'restaurant-tab' && Object.keys(this.props.restaurantOrder).length !== 0) || this.props.isEdit === true
                            ? <div className="button-section button-section_bottom mb-1">
                                <button className="main-item-style mr-15 ml-1" onClick={this.props.sendOrderHandler}>
                                   Далее
                                </button>
                                <button className="main-item-style main-item-style_danger" onClick={() =>
                                    this.props.isEdit === true ? this.props.onClose() : this.props.deleteOrder()
                                }>Отменить
                                </button>
                                <span
                                    className={'dagger dagger_add'}
                                    onClick={this.addedNewOrderItem}>
                            </span>
                            </div>
                            : <>
                                <p className={'placeholder'}>Вы ещё ничего не добавили в заказ</p>
                                <span
                                    className={'dagger dagger_add'}
                                    onClick={this.addedNewOrderItem}>
                            </span>
                            </>
                    }
                </div>
            )
        else return null
    }
}