import React, {Component} from 'react'
import './ProductForm.scss'
import MiniTabPanel from '../UI/MiniTabPanel/MiniTabPanel'
import Selector from '../UI/Selector/Selector'

export default class Form extends Component {
    constructor(props) {
        super(props)
        this.inputName = React.createRef()
        this.inputQuantity = React.createRef()
        this.inputBrand = React.createRef()
        this.inputPrice = React.createRef()
        this.text = React.createRef()
        this.state = {
            orderFormIsValid: true,
            activeTab: 'shorty-tab',
            activeType: ''
        }
    }

    // Валидация заказа
    validateOrderData = () => {
        this.setState({
            orderFormIsValid: this.inputName.current.value.replace(/\s+/g, '') !== ''
                && this.inputQuantity.current.value.replace(/\s+/g, '') !== ''
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
                brand: this.inputBrand.current.value,
                relation: this.state.activeType.label ? this.state.activeType.label : ''
            }

            // Если item(текущий редактируемый эл-т) пустой, значит надо добавить в заказ новый продукт и сгенерировать его id
            if (this.props.item === null) {
                item.id = `note-${Math.random().toString(36).substr(2, 9)}`
                this.props.addProductToOrder(item)
            }
            // Иначе item(текущий редактируемый эл-т) непустой, значит надо редактировать продукт в заказе, id достаём из item-а
            else {
                item.id = this.props.item.id
                this.props.editOrderItem(item)
            }
            this.props.resetActiveItem()
        }
    }

    clickItemHandler = async (event) => {
        await this.setState({
            activeTab: event.target.id
        })
    }

    setType = (activeType) => {
        this.setState({
            activeType
        })
    }

    render() {
        const isEdit = this.props.item !== null
        return (
            <div className={'product-form product-form_h'}>
                <MiniTabPanel
                    clickItemHandler={this.clickItemHandler}
                    activeTab={this.state.activeTab}
                    tabList={[{
                        title: 'Кратко',
                        id: 'shorty-tab'
                    }, {
                        title: 'Развернуто',
                        id: 'long-tab'
                    }]}
                    type={'invert'}
                />

                <div className={'product-form__input-field mt-2'}>
                    <label>Название продукта*</label>
                    <input type="text"
                           ref={this.inputName}
                           defaultValue={isEdit ? this.props.item['name'] : null}
                           className={this.state.orderFormIsValid ? ' ' : 'input-error'}/>
                </div>
                <div className={'product-form__input-field'}>
                    <label>Объём/Кол-во*</label>
                    <input type="text"
                           ref={this.inputQuantity}
                           defaultValue={isEdit ? this.props.item['quantity'] : null}
                           className={this.state.orderFormIsValid ? ' ' : 'input-error'}/>
                </div>
                <div className={this.state.activeTab === 'shorty-tab' ? '' : 'hide'}>
                    <Selector
                        selectList={[
                            {
                                id: 'price',
                                label: 'Цена'
                            },
                            {
                                id: 'balance',
                                label: 'Цена/Качество'
                            },
                            {
                                id: 'quality',
                                label: 'Качество'
                            }
                        ]}
                        activeType={this.state.activeType}
                        setType={this.setType}
                        placeholder={'Выберите соотношение'}
                    />
                </div>

                <div className={this.state.activeTab === 'long-tab' ? '' : 'hide'}>
                    <div className={'product-form__input-field'}>
                        <label>Бренд</label>
                        <input type="text"
                               ref={this.inputBrand}
                               defaultValue={isEdit ? this.props.item['brand'] : null}/>
                    </div>
                    <div className={'product-form__input-field'}>
                        <label>Примерная цена</label>
                        <input type="text"
                               ref={this.inputPrice}
                               defaultValue={isEdit ? this.props.item['price'] : null}/>
                    </div>
                    <div className={'product-form__input-field'}>
                        <label>Примечание</label>
                        <textarea
                            ref={this.text} cols="30" rows="5"
                            defaultValue={isEdit ? this.props.item['description'] : null}>
                                         </textarea>
                    </div>
                </div>


                <div className={'mt-auto'}>
                    <small className={this.state.orderFormIsValid ? '' : 'error'}>
                        Поля помеченные * обязательные для заполнения
                    </small>

                    <div className="button-section mb-2 mt-3">
                        <button className="main-item-style mr-15" onClick={this.addAndEditOrder}>
                            {isEdit ? 'Применить' : 'Сохранить'}
                        </button>
                        <button className="main-item-style main-item-style_danger" onClick={this.props.resetActiveItem}>
                            {isEdit ? 'Назад' : 'Отменить'}
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}