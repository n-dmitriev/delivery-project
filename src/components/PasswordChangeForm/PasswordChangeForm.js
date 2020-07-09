import React, {Component} from 'react'
import './PasswordChangeForm.scss'
import toaster from 'toasted-notes'
import ModalWindow from '../UI/ModalWindow/ModalWindow'
import {confirm} from '../UI/Confirm/Confirm'


export default class PasswordChangeForm extends Component {
    constructor(props) {
        super(props)
        this.newPassword = React.createRef()
        this.oldPassword = React.createRef()
        this.state = {
            newPasswordIsValid: true,
            oldPasswordIsValid: true
        }
    }

    //Валидация пароля и логина
    validateUserData = () => {
        this.setState({
            newPasswordIsValid:  this.newPassword.current.value.length > 6,
            oldPasswordIsValid: this.oldPassword.current.value.length > 6 && this.props.errorPassword === false,
        })
    }

    changePassword = async (e) => {
        e.preventDefault()
       if (this.newPassword && this.oldPassword){
           await this.validateUserData()
           if (this.state.newPasswordIsValid && this.state.oldPasswordIsValid){
               confirm(
                   'изменить пароль', async () => {
                       this.props.passwordChange(this.oldPassword.current.value, this.newPassword.current.value)
                       toaster.notify('Ваш пароль успешно изменён!', {
                           position: 'bottom-right',
                           duration: null
                       })
                   }
               )
           }
       }
    }

    close = () => {
        this.props.onClose()
        this.setState({
            passwordIsValid: true
        })
    }

    renderContent =() => {
        return (
            <div className={'password-change'}>
                <div className={'password-change__content'}>
                    <h2 className={'mb-30'}>Смена пароля</h2>
                    <label className={'mb-15'}>Введите старый пароль</label>
                    <input className={!this.state.oldPasswordIsValid ? 'input-error mb-15' : 'mb-15'} type="login"
                           ref={this.oldPassword}/>
                    <label className={'mb-15'}>Придумайте новый пароль</label>
                    <input className={!this.state.newPasswordIsValid ? 'input-error' : ''} type="login"
                           ref={this.newPassword}/>
                    <small className={this.state.newPasswordIsValid && this.state.oldPasswordIsValid ? 'hide' : 'error'}>
                        {!this.state.oldPasswordIsValid ? <>Вы указали не верный старый пароль</> : null}
                        {!this.state.newPasswordIsValid ? <><br/>Новый пароль не может содержать менее 6 символов!</> : null}
                    </small>

                    <div className={'button-section mt-30'}>
                        <button className={'main-item-style mr-15'} onClick={this.changePassword}>Сменить пароль</button>
                        <button className={'main-item-style'} onClick={this.close}>
                            Отмена
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
           <ModalWindow
               isOpen={this.props.isOpen}
               onClose={this.close}
               renderBody={this.renderContent}
           />
        )
    }
}
