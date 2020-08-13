import React, {Component} from 'react'
import toaster from 'toasted-notes'

export default class OrderListAndMenu extends Component {
    // Обработчик, удаляет выбранный продукт из заказа
    deleteItem = (e) => {
        e.stopPropagation()
        if (this.props.isEdit === true)
            this.props.removeProductFromSentOrder(e.target.id)
        else
            this.props.removeProductFromOrder(e.target.id, this.props.activeTab)
        toaster.notify('Продукт удалён из заказа!', {
            position: 'bottom-right',
            duration: 3000
        })
    }

    addedNewOrderItem = () => {
        if (this.props.name === '' && !this.props.isEdit)
            this.props.changeActiveWindow('name')
        else
            this.props.changeActiveWindow('form')
    }

    render() {
        const list = this.props.isEdit ? this.props.editOrder?.order : this.props.order
        if (list)
            return (
                <div className={'order-constructor__content'}>
                    {
                        this.props.name.replace(/\s+/g, '') !== '' || this.props.isEdit
                            ? <>
                                <div
                                    className={'order-constructor__name'}
                                    onClick={() => {
                                        this.props.changeActiveWindow('name')
                                    }}>
                                    {this.props.isEdit ? this.props.editOrder.name : this.props.name}
                                    <i className="fa fa-pencil-square-o fa-animate" aria-hidden="true"/>
                                </div>
                                <div className={'order-constructor__order-list'}>
                                    {list.map((item, count) => (
                                        <div key={item.id} id={count} className={'order-constructor__tab'}
                                             onClick={this.props.editProduct}>
                                            {item.name}, {item.quantity}, {item.brand}
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
                        Object.keys(this.props.order).length !== 0 || this.props.isEdit === true
                            ? <div className="button-section button-section_bottom mb-1">
                                <button className="main-item-style main-item-style_danger mr-15 ml-1" onClick={() =>
                                    this.props.isEdit === true ? this.props.onClose() : this.props.deleteOrder()
                                }>Отменить
                                </button>
                                <button className="main-item-style" onClick={this.props.sendOrderHandler}>
                                    Далее
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