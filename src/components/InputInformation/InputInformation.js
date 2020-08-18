import React, {Component} from 'react'
import {IMaskInput} from 'react-imask'
import InputPosition from './InputPosition'
import toaster from 'toasted-notes'


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
            infFromMap: {}
        }
    }


    //Валидация информации о пользователе
    validateUserInformation = () => {
        this.setState({
            nameIsValid: this.name.current.value.replace(/\s+/g, '') !== '',
            numberPhoneIsValid: this.numberPhone.replace(/\s+/g, '') !== '',
            addressIsValid: this.props.type === 'courier' ? this.address.current.value.replace(/\s+/g, '') !== '' : true
        })
    }

    saveUI = async (e) => {
        e.preventDefault()
        if (this.name && this.numberPhone) {
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
                    if (this.props.page === 'account' && Object.keys(this.state.infFromMap).length > 0) {
                        if (this.state.infFromMap?.positionIsValid) {
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
                this.props.saveContactInformation(info)
            }
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
        const options = {
            isEdit: true, type: 'account', address: this.props.userInfo.clientAddress,
            coordinate: this.props.userInfo.coordinate
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
        if (this.props.userInfo) {
            isEdit = true
            this.numberPhone = this.props.userInfo.clientNumberPhone
        }
        return (
            <>
                <h2 className={'mb-30'}>{isEdit ? 'Контактная информация' : 'Укажите контактную ифнормацию'}</h2>


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
                        className={`number-block mb-30 ${this.state.numberPhoneIsValid === false ? 'input-error' : ''}`}>
                        <IMaskInput
                            mask={'+{7}(000)000-00-00'}
                            unmask={false}
                            onAccept={
                                (value) => this.numberPhone = value
                            }
                            placeholder='+7 ('
                            value={isEdit ? this.props.userInfo.clientNumberPhone : null}
                        />
                    </div>
                </div>

                {
                    this.props.type === 'courier'
                        ?
                        <div className={'input-field'}>
                            <label className={'mb-15'}>
                                {
                                    this.props.type === 'courier'
                                        ?
                                        'Ссылка на вк'
                                        :
                                        'Адрес*'
                                }
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

                <small
                    className={this.state.nameIsValid && this.state.numberPhoneIsValid && this.state.addressIsValid ? 'hide' : 'error'}>
                    Поля помеченные * обязательные для заполнения
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