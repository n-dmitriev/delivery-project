import React, {Component} from 'react'
import './ProductForm.scss'

export default class form extends Component {
    constructor(props) {
        super(props)
        this.inputName = React.createRef()
        this.inputQuantity = React.createRef()
        this.inputBrand = React.createRef()
        this.inputPrice = React.createRef()
        this.text = React.createRef()
        this.state = {
            orderFormIsValid: true,
            //Список вопросов для магазина
            listOfShopQuestions: [
                {
                    id: 'name',
                    question: 'Название продукта*',
                    required: true,
                    ref: this.inputName,
                    type: 'input',
                },
                {
                    id: 'quantity',
                    question: 'Объём/Кол-во*',
                    required: true,
                    ref: this.inputQuantity,
                    type: 'input',
                },
                {
                    id: 'brand',
                    question: 'Бренд',
                    required: false,
                    ref: this.inputBrand,
                    type: 'input',
                },
                {
                    id: 'price',
                    question: 'Примерная цена',
                    required: false,
                    ref: this.inputPrice,
                    type: 'input',
                },
                {
                    id: 'description',
                    question: 'Примечание',
                    required: false,
                    ref: this.text,
                    type: 'textarea',
                },
            ],
            //Список вопросов для ресторана
            listOfRestaurantQuestions: [
                {
                    id: 'name',
                    question: 'Название блюда*',
                    required: true,
                    ref: this.inputName,
                    type: 'input',
                },
                {
                    id: 'quantity',
                    question: 'Объём/Кол-во*',
                    required: true,
                    ref: this.inputQuantity,
                    type: 'input',
                },
                {
                    id: 'price',
                    question: 'Примерная, ожидаемая цена',
                    required: false,
                    ref: this.inputPrice,
                    type: 'input',
                },
                {
                    id: 'description',
                    question: 'Примечание',
                    required: false,
                    ref: this.text,
                    type: 'textarea',
                },
            ],
        }
    }

    // Валидация заказа
    validateOrderData = () => {
        this.setState({
            orderFormIsValid: this.inputName.current.value.replace(/\s+/g, '') !== '' && this.inputQuantity.current.value.replace(/\s+/g, '') !== '',
        })
    }

    // Функция отвечающая за добавление и редактивроание эл-та
    // Редактирование и добавление в 1-ом месте, так как функционал компонента переиспользуется
    addAndEditOrder = async (e) => {
        e.preventDefault()
        await this.validateOrderData()
        if (this.state.orderFormIsValid) {
            // Формируем объект из input-ов

            const item = {
                name: this.inputName.current.value,
                quantity: this.inputQuantity.current.value,
                price: this.inputPrice.current.value,
                description: this.text.current.value,
                purchased: false,
            }

            // Если магазин, то в объект добавляем название бренда
            if (this.props.activeTab === 'shop-tab')
                item.brand = this.inputBrand.current.value

            // Если item(текущий редактируемый эл-т) пустой, значит надо добавить в заказ новый продукт и сгенерировать его id
            if (this.props.item === null) {
                item.id = `note-${Math.random().toString(36).substr(2, 9)}`
                if (this.props.isEdit === true)
                    this.props.addSentOrder(item)
                else
                    this.props.addProductToOrder(item, this.props.activeTab)
            }
            // Иначе item(текущий редактируемый эл-т) непустой, значит надо редактировать продукт в заказе, id достаём из item-а
            else {
                item.id = this.props.item.id
                if (this.props.isEdit === true)
                    this.props.editSentOrder(item)
                else
                    this.props.editOrderItem(item, this.props.activeTab)
            }
            this.props.interactionWithDagger('list')
            this.props.resetActiveItem()
        }
    }

    render() {
        const isEdit = this.props.item === null
        const listQuestions = this.props.activeTab === 'shop-tab' ? this.state.listOfShopQuestions : this.state.listOfRestaurantQuestions

        return (
            <div className={'product-form'}>
                {
                    listQuestions.map((question) => (
                        <div key={question.id} className={'product-form__input-field'}>
                            <label>{question.question}</label>
                            {
                                question.type === 'input'
                                    ? <input type="text"
                                             ref={question.ref}
                                             defaultValue={isEdit ? this.props.item[question.id] : null}
                                             className={
                                                 question.required === true ? this.state.orderFormIsValid ? ' ' : 'input-error' : ' '
                                             }/>
                                    : <textarea
                                        ref={question.ref} cols="30" rows="5"
                                        defaultValue={isEdit ? this.props.item[question.id] : null}
                                        className={
                                            question.required === true ? this.state.orderFormIsValid ? '' : 'input-error' : ''
                                        }>
                                    </textarea>
                            }
                        </div>
                    ))
                }
                <small className={this.state.orderFormIsValid ? '' : 'error'}>Поля
                    помеченные * обязательные для заполнения</small>

                <div className="button-section mb-2">
                    <button className="main-item-style mr-15" onClick={this.addAndEditOrder}>
                        {isEdit ? 'Применить' : 'Сохранить'}
                    </button>
                    <button className="main-item-style main-item-style_danger" onClick={() => {
                        this.props.resetActiveItem()
                        this.props.interactionWithDagger()
                    }}>
                        {isEdit ? 'Назад' : 'Отменить'}
                    </button>
                </div>
            </div>
        )
    }
}