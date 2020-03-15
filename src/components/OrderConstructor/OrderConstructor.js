import React, {Component} from 'react'
import './OrderConstructor.scss'
import ProductForm from '../ProductForm/ProductForm'

export default class OrderConstructor extends Component {
    state = {
        formIsOpen: false,
        activeItem: null
    }

    interactionWithDagger() {
        this.setState({
            formIsOpen: !this.state.formIsOpen,
        })
    }

    editItem(e){
        e.preventDefault()
        this.setState({
            formIsOpen: !this.state.formIsOpen,
            activeItem: this.props.order[e.target.id]
        })
    }

    deleteItem(e){
        e.stopPropagation()
        this.props.removeProductFromOrder(e.target.id)
    }

    resetActiveItem(){
        this.setState({
            activeItem: null
        })
    }

    renderOrder() {
        return (
            <div className={'order-constructor__content'}>
                {
                    this.props.order.map((item, count) => (
                        <div key={item.id} id={count} className={'order-constructor__tab'} onClick={this.editItem.bind(this)}>
                            {item.name}, {item.quantity}, {item.price}, {item.brand}, {item.description}
                            <span id={item.id} className={'dagger dagger_delete'} onClick={this.deleteItem.bind(this)}></span>
                        </div>
                    ))
                }
                {
                    Object.keys(this.props.order).length !== 0
                        ? <div className="button-section button-section_bottom">
                            <button className="main-item-style" onClick={this.props.sendOrder}>Заказать</button>
                            <button className="main-item-style" onClick={this.props.deleteOrder}>Отменить</button>
                            <span
                                className={'dagger dagger_add'}
                                onClick={this.interactionWithDagger.bind(this)}>
                            </span>
                        </div>
                        : <>
                            <p className={'placeholder'}>Вы ещё ничего не добавили в заказ</p>
                            <span
                                className={'dagger dagger_add'}
                                onClick={this.interactionWithDagger.bind(this)}>
                            </span>
                        </>
                }
            </div>
        )
    }

    renderContent() {
        return (
            <>
                {this.state.formIsOpen === true
                    ? <ProductForm
                        formIsOpen={this.state.formIsOpen}
                        activeTab={this.props.activeTab}
                        interactionWithDagger={this.interactionWithDagger.bind(this)}
                        addProductToOrder={this.props.addProductToOrder}
                        editOrderItem={this.props.editOrderItem}
                        item={this.state.activeItem}
                        resetActiveItem={this.resetActiveItem.bind(this)}
                    />
                    : this.renderOrder()
                }
            </>
        )
    }

    render() {
        return (
            <div className={'order-constructor'}>
                {this.renderContent()}
            </div>
        )
    }
}