import React, {Component} from 'react'
import toaster from 'toasted-notes'
import Selector from '../UI/Selector/Selector'

export default class InputName extends Component {
    constructor(props) {
        super(props)
        this.nameInput = React.createRef()
        this.state = {
            nameIsValid: true,
            activeType: ''
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

    setType = (option) => {
        this.setState({
            activeType: option
        })
    }

    render() {
        return (
            <div className={'product-form'}>
                <div className={'product-form__input-field product-form__input-field_name'}>
                    <h3 className={'mb-3'}>Информация о заведении</h3>

                    <div className="form-group mb-15">
                        <input placeholder={'Укажите назавание'}
                               defaultValue={this.props.name}
                               className={!this.state.nameIsValid ? 'input-error' : ''}
                               ref={this.nameInput}
                               type='text'
                        />
                        <label className={'label'}>Название заведения</label>
                        <small
                            className={this.state.nameIsValid ? 'hide' : 'error'}>
                            Название не может быть пустым!
                        </small>
                    </div>

                    <Selector
                        selectList={[
                            {
                                id: 'shop',
                                label: 'Магазин'
                            },
                            {
                                id: 'restaurant',
                                label: 'Ресторан'
                            }
                        ]}
                        activeType={this.state.activeType}
                        setType={this.setType}
                        placeholder={'Укажите тип'}
                    />
                    <button
                        className={'main-item-style mt-auto'}
                        onClick={this.editName}>
                        Далее
                    </button>
                </div>
            </div>
        )
    }
}