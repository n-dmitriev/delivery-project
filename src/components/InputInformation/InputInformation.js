import React, {Component} from 'react'
import {IMaskInput} from 'react-imask'
import InputPosition from './InputPosition'
import toaster from 'toasted-notes'


export default class InputInformation extends Component {
    constructor(props) {
        super(props)
        this.name = React.createRef()
        this.address = React.createRef()
        this.numberPhone = ''
        this.state = {
            nameIsValid: true,
            numberPhoneIsValid: true,
            addressIsValid: true,
            infFromMap: {}
        }
    }

    //Валидация информации о пользователе
    validateUserInformation = () => {
        this.setState({
            nameIsValid: this.name.current.value.replace(/\s+/g, '') !== '',
            numberPhoneIsValid: this.numberPhone.replace(/\s+/g, '') !== '',
            addressIsValid: this.props.type === 'courier' ? this.address.current.value.replace(/\s+/g, '') !== '' :
                this.props.type === 'user' ? true : Object.keys(this.state.infFromMap).length > 0
        })
    }

    saveUI = async (e) => {
        e.preventDefault()
        await this.validateUserInformation()
        if (this.state.nameIsValid && this.state.numberPhoneIsValid && this.state.addressIsValid) {
            let info

            if (this.props.type === 'courier')
                info = {
                    name: this.name.current.value,
                    numberPhone: this.numberPhone,
                    role: this.props.type,
                    address: this.address.current.value
                }
            else {
                info = {
                    clientName: this.name.current.value,
                    clientNumberPhone: this.numberPhone,
                    role: this.props.type
                }
                if (this.props.page === 'account') {
                    if (this.state.infFromMap.positionIsValid) {
                        info.clientAddress = this.state.infFromMap.clientAddress
                        info.coordinate = this.state.infFromMap.coordinate
                    } else {
                        toaster.notify(this.state.infFromMap.errorMessage, {
                            position: 'bottom-right',
                            duration: 3000
                        })
                        return null
                    }
                }
            }
            if (!this.state.addressIsValid)
                this.setState({
                    addressIsValid: true
                })
            this.props.saveContactInformation(info)
        }
    }

    setAddressInfo = (clientAddress, coordinate, positionIsValid, errorMessage) => {
        this.setState({
            infFromMap: {
                clientAddress, coordinate, positionIsValid, errorMessage
            }
        })
    }

    renderInputAddress = () => {
        let options
        if (this.props.userInfo)
            options = {
                isEdit: true, type: 'account', address: this.props.userInfo.clientAddress,
                coordinate: this.props.userInfo.coordinate
            }
        else
            options = {
                isEdit: false, type: 'account'
            }
        return (
            <InputPosition
                setAddressInfo={this.setAddressInfo}
                options={options}
            />
        )
    }

    render() {
        let isEdit = false
        if (this.props.userInfo && this.props.userInfo.clientNumberPhone) {
            isEdit = true
            this.numberPhone = this.props.userInfo.clientNumberPhone
        }
        return (
            <>
                <h2 className={'mb-30'}>Контактная информация</h2>


                <div className={'input-field'}>
                    <label className={'mb-15'}>Имя*</label>
                    <input className={this.state.nameIsValid === false ? 'input-error mb-30' : 'mb-30'}
                           type="text"
                           ref={this.name}
                           defaultValue={isEdit ? this.props.userInfo.clientName : null}
                           placeholder={'Иван Иванович'}
                    />
                </div>

                <div className={'input-field'}>
                    <label className={'mb-15'}>Номер телефона*</label>
                    <div
                        className={`number-block mb-30 ${!this.state.numberPhoneIsValid ? 'input-error' : ''}`}>
                        <IMaskInput
                            mask={'+{7}(000)000-00-00'}
                            unmask={false}
                            onAccept={(value) => this.numberPhone = value}
                            placeholder='+7 ('
                            value={isEdit ? this.props.userInfo.clientNumberPhone : this.numberPhone}
                        />
                    </div>
                </div>

                {
                    this.props.type === 'courier'
                        ?
                        <div className={'input-field'}>
                            <label className={'mb-15'}>
                                Ссылка на вк
                            </label>
                            <input className={this.state.addressIsValid === false ? 'input-error mb-15' : 'mb-30'}
                                   type="text"
                                   ref={this.address}
                                   defaultValue={isEdit ? this.props.userInfo.address : null}
                                   placeholder={'Адрес*'}
                            />
                        </div>
                        : null
                }

                {
                    this.props.page === 'account'
                        ? this.renderInputAddress()
                        : null
                }

                <small className={'error mt-15'}>
                    {this.state.nameIsValid && this.state.numberPhoneIsValid && this.state.addressIsValid
                        ? null : <div className={'mb-2'}>Поля помеченные * обязательные для заполнения</div>}
                    {!this.state.addressIsValid ? <div className={'mb-2'}>Укажите адрес доставки!</div> : null}
                </small>

                <div className={'button-section mt-30'}>
                    {
                        this.props.page === 'order'
                            ? <button className={'main-item-style mr-2'}
                                      onClick={() => {
                                          this.props.changeActiveWindow('map')
                                      }}>
                                Назад
                            </button>
                            : this.props.page === 'account' && !isEdit
                            ? <button className={'main-item-style mr-2'}
                                      onClick={this.props.onClose}>
                                Позже
                            </button>
                            : null
                    }
                    <button className={'main-item-style'} onClick={this.saveUI}>
                        {this.props.page === 'order' ? 'Далее' : 'Применить'}
                    </button>
                </div>
            </>
        )
    }
}