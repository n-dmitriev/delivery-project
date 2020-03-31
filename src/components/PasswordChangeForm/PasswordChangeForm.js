import React, {Component} from 'react'
import './PasswordChangeForm.scss'


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
               this.props.passwordChange(this.oldPassword.current.value, this.newPassword.current.value)
               console.log(this.oldPassword.current.value, this.newPassword.current.value, this.oldPassword.current.value,this.props.passwordChange)
           }
       }
    }

    close = () => {
        this.props.onClose()
        this.setState({
            passwordIsValid: true
        })
    }

    render() {
        if(!this.props.isOpen)
            return null
        return (
            <>
                <div className={'password-change'}>
                    <div className={'password-change__content'}>
                        <h2>Смена пароля</h2>
                        <hr className={'mt-15 mb-30'}/>
                        <label className={'mb-15'}>Введите старый пароль</label>
                        <input className={!this.state.oldPasswordIsValid ? 'input-error' : ''} type="login"
                               ref={this.oldPassword}/>
                        <label className={'mb-15'}>Придумайте новый пароль</label>
                        <input className={!this.state.newPasswordIsValid ? 'input-error' : ''} type="login"
                               ref={this.newPassword}/>
                        <small className={this.state.newPasswordIsValid && this.state.oldPasswordIsValid ? 'hide' : 'error'}>
                            {!this.state.oldPasswordIsValid ? <>Вы указали не верный старый пароль</> : null}
                            {!this.state.newPasswordIsValid ? <><br/>Новый пароль не может содержать менее 6 символов!</> : null}
                        </small>

                        <div className={'button-section mt-15'}>
                            <button className={'main-item-style mr-15'} onClick={this.changePassword}>Сменить пароль</button>
                            <button className={'main-item-style'} onClick={this.close}>
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
                <div className={'bg'} onClick={this.close}/>
            </>
        )
    }
}
