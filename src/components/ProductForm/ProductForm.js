import React, {Component} from 'react'
import './ProductForm.scss'

export default class productForm extends Component {
    constructor(props) {
        super(props)
        this.addAndEditOrder = this.addAndEditOrder.bind(this)
        this.inputName = React.createRef()
        this.inputQuantity = React.createRef()
        this.inputBrand = React.createRef()
        this.inputPrice = React.createRef()
        this.text = React.createRef()
        this.restaurantName = React.createRef()
        this.shopName = React.createRef()
        this.state = {
            listOfShopQuestions: [
                {
                    id: 'name',
                    question: 'Наименование продукта*',
                    required: 'true',
                    ref: this.inputName,
                    type: 'input'
                },
                {
                    id: 'quantity',
                    question: 'Объём/Кол-во*',
                    required: 'true',
                    ref: this.inputQuantity,
                    type: 'input'
                },
                {
                    id: 'brand',
                    question: 'Бренд',
                    required: 'false',
                    ref: this.inputBrand,
                    type: 'input'
                },
                {
                    id: 'price',
                    question: 'Примерная, ожидаемая цена',
                    required: 'false',
                    ref: this.inputPrice,
                    type: 'input'
                },
                {
                    id: 'description',
                    question: 'Примечание',
                    required: 'false',
                    ref: this.text,
                    type: 'textarea'
                },
            ],
            listOfRestaurantQuestions: [
                {
                    id: 'name',
                    question: 'Наименование блюда*',
                    required: 'true',
                    ref: this.inputName,
                    type: 'input'
                },
                {
                    id: 'quantity',
                    question: 'Объём/Кол-во*',
                    required: 'true',
                    ref: this.inputQuantity,
                    type: 'input'
                },
                {
                    id: 'price',
                    question: 'Примерная, ожидаемая цена',
                    required: 'false',
                    ref: this.inputPrice,
                    type: 'input'
                },
                {
                    id: 'description',
                    question: 'Примечание',
                    required: 'false',
                    ref: this.text,
                    type: 'textarea'
                },
            ],
        }
    }

    addAndEditOrder() {
        const item = {
            name: this.inputName.current.value,
            quantity: this.inputQuantity.current.value,
            price: this.inputPrice.current.value,
            description: this.text.current.value,
        }

        if (this.props.activeTab === 'shop-tab')
            item.brand = this.inputBrand.current.value

        if (this.props.item === null) {
            item.id = `note-${Math.random().toString(36).substr(2, 9)}`
            this.props.addProductToOrder(item, this.props.activeTab)
        } else {
            item.id = this.props.item.id
            this.props.editOrderItem(item, this.props.activeTab)
        }
        this.props.interactionWithDagger()
        this.props.resetActiveItem()
    }

    formInputs(isEdit, listQuestions) {
        return (
            <>
                <input className={'none'}/>
                {
                    listQuestions.map((question) =>(
                        <div key={question.id} className={'product-form__input-field'}>
                            <label>{question.question}</label>
                            {
                                question.type === 'input'
                                ? <input type="text"
                                         ref={question.ref}
                                         defaultValue={isEdit ? this.props.item[question.id] : null}/>
                                : <textarea
                                        ref={question.ref} cols="30" rows="5"
                                        defaultValue={isEdit ? this.props.item[question.id] : null}>
                                </textarea>
                            }
                        </div>
                    ))
                }
                <small>Поля помеченные * обязательные для заполнения</small>

                <div className="button-section button-section_bottom">
                    <button className="main-item-style" onClick={this.addAndEditOrder}>
                        {isEdit ? 'Применить' : 'Сохранить'}
                    </button>
                    <button className="main-item-style" onClick={() => {
                        this.props.resetActiveItem()
                        this.props.interactionWithDagger()
                    }}>
                        {isEdit ? 'Назад' : 'Отменить'}
                    </button>
                </div>
            </>
        )
    }

    form() {
        let isEdit
        this.props.item === null ? isEdit = false : isEdit = true

        if(this.props.activeTab === 'shop-tab'){
            if (this.props.nameOfShop === '' && !isEdit)
                return (
                    <div className={'product-form__input-field product-form__input-field_name'}>
                        <label>Введите название магазина</label>
                        <input type="text" ref={this.shopName}/>
                        <small>Это поле необязательное для заполнения</small>
                        <button
                            className={'main-item-style'}
                            onClick={() => {this.props.changeShopName(this.shopName.current.value)}}>
                            Далее
                        </button>
                    </div>
                )
            else
                return this.formInputs(isEdit, this.state.listOfShopQuestions)
        }
        else {
            if (this.props.nameOfRestaurant === '' && !isEdit)
                return (
                    <div className={'product-form__input-field product-form__input-field_name'}>
                        <label>Введите название ресторана</label>
                        <input type="text" ref={this.restaurantName}/>
                        <small>Это поле обязательное для заполнения</small>
                        <button
                            className={'main-item-style'}
                            onClick={() => this.props.changeRestaurantName(this.restaurantName.current.value)}>
                            Далее
                        </button>
                    </div>
                )
            else
                return  this.formInputs(isEdit, this.state.listOfRestaurantQuestions)
        }
    }

    render() {
        return (
            <div className={'product-form'}>
                {this.form()}
            </div>
        )
    }
}