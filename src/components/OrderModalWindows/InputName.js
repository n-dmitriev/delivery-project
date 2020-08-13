import React, {Component} from 'react'
import toaster from 'toasted-notes'

export default class InputName extends Component {
    constructor(props) {
        super(props)
        this.nameInput = React.createRef()
        this.state = {
            nameIsValid: true
        }
    }

    // Редактирование названия ресторана, с валидацией
    editName = (e) => {
        e.preventDefault()
        if (this.nameInput.current.value.replace(/\s+/g, '') !== '') {
            this.props.changeName(this.nameInput.current.value)
            this.props.changeActiveWindow('list')
            this.setState({
                nameIsValid: true
            })
            toaster.notify('Название сохранено!', {
                position: 'bottom-right',
                duration: 3000
            })
        } else {
            this.setState({
                restIsValid: false
            })
        }
    }

    render() {
        return (
            <div className={'product-form'}>
                <div className={'product-form__input-field product-form__input-field_name'}>
                    <h3 className={'mb-15'}>Введите название заведения</h3>
                    <input type="text" ref={this.nameInput} defaultValue={this.props.name}
                           className={'mb-15'}/>
                    <small className={'mb-30'}>Это поле необязательное для заполнения</small>
                    <button
                        className={'main-item-style'}
                        onClick={this.editName}>
                        Далее
                    </button>
                </div>
            </div>
        )
    }
}