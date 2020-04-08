import React, {Component} from 'react'

export default class InputInformation extends Component {
    constructor(props) {
        super(props)
        this.name = React.createRef()
        this.numberPhone = React.createRef()
        this.address = React.createRef()
        this.state = {
            nameIsValid: true,
            numberPhoneIsValid: true,
            addressIsValid: true,
        }
    }

    //Валидация информации о пользователе
    validateUserInformation = () => {
        this.setState({
            nameIsValid: this.name.current.value.replace(/\s+/g, '') !== '',
            numberPhoneIsValid: this.numberPhone.current.value.replace(/\s+/g, '') !== '',
            addressIsValid: this.address.current.value.replace(/\s+/g, '') !== '',
        })
    }

    saveUI = async (e) => {
        e.preventDefault()
        if (this.name && this.numberPhone && this.address) {
            await this.validateUserInformation()
            if (this.state.nameIsValid && this.state.numberPhoneIsValid && this.state.addressIsValid) {
                const info = {
                    name: this.name.current.value,
                    numberPhone: this.numberPhone.current.value,
                    address: this.address.current.value,
                    role: this.props.type,
                }

                if(this.props.userInfo !== undefined)
                    info.id = this.props.userInfo.id

                this.props.saveContactInformation(info)
            }
        }
    }

    render() {
        let isEdit = false
        if (this.props.userInfo) {
            isEdit = true
        }
        return (
            <>

                <h2 className={'mb-30'}>{isEdit ? 'Контактная информация' : 'Укажите контактную ифнормацию'}</h2>

                <label className={'mb-15'}>Имя*</label>
                <input className={this.state.nameIsValid === false ? 'input-error mb-30' : 'mb-30'}
                       type="text"
                       ref={this.name}
                       defaultValue={isEdit ? this.props.userInfo.name : null}
                />
                <label className={'mb-15'}>Номер телефона*</label>
                <input className={this.state.numberPhoneIsValid === false ? 'input-error mb-30' : 'mb-30'}
                       type="text"
                       ref={this.numberPhone}
                       defaultValue={isEdit ? this.props.userInfo.numberPhone : null}/>
                <label className={'mb-15'}> {
                    this.props.type === 'courier'
                        ?
                            'Ссылка на вк'
                        :
                            'Адрес*'
                }</label>

                <input className={this.state.addressIsValid === false ? 'input-error mb-15' : 'mb-30'}
                       type="text"
                       ref={this.address}
                       defaultValue={isEdit ? this.props.userInfo.address : null}/>
                <small
                    className={this.state.nameIsValid && this.state.numberPhoneIsValid && this.state.addressIsValid ? 'hide' : 'error'}>
                    Поля помеченные * обязательные для заполнения
                </small>

                <div className={'button-section mt-15'}>
                    <button className={'main-item-style mr-15'} onClick={this.saveUI}>Применить</button>
                    {isEdit || this.props.trySend ? null :
                        <button className={'main-item-style'} onClick={this.props.onClose}>Позже</button>}
                </div>
            </>
        )
    }
}