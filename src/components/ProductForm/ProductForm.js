import React, {Component} from 'react'
import './ProductForm.scss'

export default class productForm extends Component {
    constructor(props) {
        super(props)
        this.inputName = React.createRef()
        this.inputQuantity = React.createRef()
        this.inputBrand = React.createRef()
        this.inputPrice = React.createRef()
        this.text = React.createRef()
        this.restaurantNameInput = React.createRef()
        this.shopNameInput = React.createRef()
        this.state = {
            orderFormIsValid: true,
            restIsValid: true,
            //Список вопросов для магазина
            listOfShopQuestions: [
                {
                    id: 'name',
                    question: 'Наименование продукта*',
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
            //Список вопросов для ресторана
            listOfRestaurantQuestions: [
                {
                    id: 'name',
                    question: 'Наименование блюда*',
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

    // Редактирование названия ресторана, с валидацией
    editRestaurantName = (e) => {
        e.preventDefault()
        if (this.restaurantNameInput.current.value.replace(/\s+/g, '') !== '') {
            this.props.changeRestaurantName(this.restaurantNameInput.current.value)
            this.props.interactionWithDagger()
            this.setState({
                restIsValid: true,
            })
        } else {
            this.setState({
                restIsValid: false,
            })
        }
    }

    // Редактирование названия магазина
    editShopName = (e) => {
        e.preventDefault()
        if (this.shopNameInput.current.value.replace(/\s+/g, '') !== '') {
            this.props.changeShopName(this.shopNameInput.current.value)
        } else {
            this.props.changeShopName('В любом магазине')
        }
        this.props.interactionWithDagger()
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
                purchased: false
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
            this.props.interactionWithDagger()
            this.props.resetActiveItem()
        }

    }

    // Функция, рендерит input-ы с вопросами из list-ов
    formInputs(isEdit, listQuestions) {
        return (
            <>
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

                <div className="">
                    <button className="main-item-style" onClick={() => {
                        this.props.resetActiveItem()
                        this.props.interactionWithDagger()
                    }}>
                        {isEdit ? 'Назад' : 'Отменить'}
                    </button>
                    <button className="main-item-style" onClick={this.addAndEditOrder}>
                        {isEdit ? 'Применить' : 'Сохранить'}
                    </button>
                </div>
            </>
        )
    }

    //Главная функция, отвечает за редактирование названий заведений и вызов функции formInputs
    form() {
        let isEdit
        this.props.item === null ? isEdit = false : isEdit = true

        if (this.props.activeTab === 'shop-tab') {
            if (this.props.nameOfShop === '' && !isEdit && this.props.isEdit !== true)
                return (
                    <div className={'product-form__input-field product-form__input-field_name'}>
                        <h2 className={'mb-30'}>Введите название магазина</h2>
                        <input type="text" ref={this.shopNameInput} className={'mb-15'}/>
                        <small className={'mb-30'}>Это поле необязательное для заполнения</small>
                        <button
                            className={'main-item-style'}
                            onClick={this.editShopName}>
                            Далее
                        </button>
                    </div>
                )
            else
                return this.formInputs(isEdit, this.state.listOfShopQuestions)
        } else {
            if (this.props.nameOfRestaurant === '' && !isEdit)
                return (
                    <div className={'product-form__input-field product-form__input-field_name'}>
                        <h2 className={'mb-30'}>Введите название ресторана</h2>
                        <input className={this.state.restIsValid === true ? 'mb-15' : 'input-error mb-15'} type="text"
                               ref={this.restaurantNameInput}/>
                        <small className={this.state.restIsValid === true ? 'mb-30' : 'error mb-30'}>Это поле
                            обязательное для
                            заполнения</small>
                        <button
                            className={'main-item-style'}
                            onClick={this.editRestaurantName}>
                            Далее
                        </button>
                    </div>
                )
            else
                return this.formInputs(isEdit, this.state.listOfRestaurantQuestions)
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