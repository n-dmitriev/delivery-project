import React, {Component} from 'react'
import toaster from 'toasted-notes'

export default class InputName extends Component {
    constructor(props) {
        super(props)
        this.restaurantNameInput = React.createRef()
        this.shopNameInput = React.createRef()
        this.state = {
            orderFormIsValid: true,
            restIsValid: true,
        }
    }

    // Редактирование названия ресторана, с валидацией
    editRestaurantName = (e) => {
        e.preventDefault()
        if (this.restaurantNameInput.current.value.replace(/\s+/g, '') !== '') {
            this.props.changeRestaurantName(this.restaurantNameInput.current.value)
            this.props.interactionWithDagger('list')
            this.setState({
                restIsValid: true,
            })
            toaster.notify('Навзвание ресторана изменено!', {
                position: 'bottom-right',
                duration: 3000,
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
        toaster.notify('Навзвание магазина изменено!', {
            position: 'bottom-right',
            duration: 3000,
        })
        this.props.interactionWithDagger('list')
    }

    render() {
        if (this.props.activeTab === 'shop-tab') {
            return (
                <div className={'product-form'}>
                    <div className={'product-form__input-field product-form__input-field_name'}>
                        <h3 className={'mb-15'}>Введите название магазина</h3>
                        <input type="text" ref={this.shopNameInput} defaultValue={this.props.nameOfShop} className={'mb-15'}/>
                        <small className={'mb-30'}>Это поле необязательное для заполнения</small>
                        <button
                            className={'main-item-style'}
                            onClick={this.editShopName}>
                            Далее
                        </button>
                    </div>
                </div>
            )
        } else
            return (
                <div className={'product-form'}>
                    <div className={'product-form__input-field product-form__input-field_name'}>
                        <h4 className={'mb-30'}>Введите название ресторана</h4>
                        <input className={this.state.restIsValid === true ? 'mb-15' : 'input-error mb-15'} type="text"
                               ref={this.restaurantNameInput} defaultValue={this.props.nameOfRestaurant}/>
                        <small className={this.state.restIsValid === true ? 'mb-30' : 'error mb-30'}>
                            {this.state.restIsValid === true ? 'Это поле обязательное для заполнения' : 'Введите корректное название'}
                        </small>
                        <button
                            className={'main-item-style'}
                            onClick={this.editRestaurantName}>
                            Далее
                        </button>
                    </div>
                </div>
            )
    }
}