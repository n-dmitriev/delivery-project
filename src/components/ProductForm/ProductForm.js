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
    }

    addAndEditOrder() {
        const item = {
            name: this.inputName.current.value,
            quantity: this.inputQuantity.current.value,
            brand: this.inputBrand.current.value,
            price: this.inputPrice.current.value,
            description: this.text.current.value,
        }

        if (this.props.item === null) {
            item.id = `note-${Math.random().toString(36).substr(2, 9)}`
            this.props.addProductToOrder(item)
        } else
        {
            item.id = this.props.item.id
            this.props.editOrderItem(item)
        }
        this.props.interactionWithDagger()
    }

    shopForm() {
        let isEdit
        this.props.item === null ? isEdit = false : isEdit = true
        return (
            <>
                <div className={'product-form__input-field'}>
                    <label>Наименование продукта*</label>
                    <input type="text" ref={this.inputName} defaultValue={isEdit ? this.props.item.name : null}/>
                </div>
                <div className={'product-form__input-field'}>
                    <label>Объём/Кол-во*</label>
                    <input type="text" ref={this.inputQuantity}
                           defaultValue={isEdit ? this.props.item.quantity : null}/>
                </div>
                <div className={'product-form__input-field'}>
                    <label>Бренд</label>
                    <input type="text" ref={this.inputBrand} defaultValue={isEdit ? this.props.item.brand : null}/>
                </div>
                <div className={'product-form__input-field'}>
                    <label>Примерная цена</label>
                    <input type="text" ref={this.inputPrice} defaultValue={isEdit ? this.props.item.price : null}/>
                </div>
                <div className={'product-form__input-field'}>
                    <label>Примечание</label>
                    <textarea ref={this.text} cols="30" rows="5" defaultValue={isEdit ? this.props.item.text : null}>
                </textarea>
                </div>
                <small>Поля помеченные * обязательные для заполнения</small>

                <div className="button-section button-section_bottom">
                    <span className="main-item-style" onClick={this.addAndEditOrder}>
                        {isEdit ? 'Применить' : 'Сохранить'}
                    </span>
                    <span className="main-item-style" onClick={this.props.interactionWithDagger}>
                        {isEdit ? 'Назад' : 'Отменить'}
                    </span>
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