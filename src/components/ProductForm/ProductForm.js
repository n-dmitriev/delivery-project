import React, {Component} from 'react'
import './ProductForm.scss'

export default class productForm extends Component {
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.inputName = React.createRef()
        this.inputQuantity = React.createRef()
        this.inputBrand = React.createRef()
        this.inputPrice = React.createRef()
        this.text = React.createRef()
    }

    handleSubmit() {
        this.props.addProductToOrder({
            id: `note-${Math.random().toString(36).substr(2, 9)}`,
            name: this.inputName.current.value,
            quantity: this.inputQuantity.current.value,
            brand: this.inputBrand.current.value,
            price: this.inputPrice.current.value,
            description: this.text.current.value
        })
        this.props.interactionWithDagger()
    }

    shopForm() {
        return (
            <>
                <div className={'product-form__input-field'}>
                    <label>Наименование продукта*</label>
                    <input type="text" ref={this.inputName}/>
                </div>
                <div className={'product-form__input-field'}>
                    <label>Объём/Кол-во*</label>
                    <input type="text" ref={this.inputQuantity}/>
                </div>
                <div className={'product-form__input-field'}>
                    <label>Бренд</label>
                    <input type="text" ref={this.inputBrand}/>
                </div>
                <div className={'product-form__input-field'}>
                    <label>Примерная цена</label>
                    <input type="text" ref={this.inputPrice}/>
                </div>
                <div className={'product-form__input-field'}>
                    <label>Примечание</label>
                    <textarea ref={this.text} cols="30" rows="5">
                </textarea>
                </div>
                <small>Поля помеченные * обязательные для заполнения</small>

                <div className="button-section button-section_bottom">
                    <span className="main-item-style" onClick={this.handleSubmit}>Добавить</span>
                    <span className="main-item-style" onClick={this.props.interactionWithDagger}>Отменить</span>
                </div>
            </>
        )
    }

    restaurantForm() {
        return (
            <>

            </>
        )
    }

    render() {
        return (
            <div className={'product-form'}>
                {
                    this.props.activeTab === 'shop-tab'
                        ? this.shopForm()
                        : this.restaurantForm()
                }
            </div>
        )
    }
}

/*listOfQuestions: [
            {
                id: 'productName',
                question: 'Наименование продукта',
                answer: '',
                required: 'true',
            },
            {
                id: 'quantity',
                question: 'Объём/Кол-во',
                answer: '',
                required: 'true',
            },
            {
                id: 'brand',
                question: 'Бренд',
                answer: '',
                required: 'false',
            },
            {
                id: 'price',
                question: 'Примерная, ожидаемая цена',
                answer: '',
                required: 'false',
            },
            {
                id: 'description',
                question: 'Примечание',
                answer: '',
                required: 'false',
            },
        ],*/