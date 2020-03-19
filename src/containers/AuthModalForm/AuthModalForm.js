import React, {Component} from 'react'
import './AuthModalForm.scss'
import {connect} from 'react-redux'
import {auth} from '../../store/actions/auth'

class AuthModalForm extends Component {
    constructor(props) {
        super(props)
        this.login = React.createRef()
        this.password = React.createRef()
        this.name = React.createRef()
        this.numberPhone = React.createRef()
        this.address = React.createRef()
        this.state = {
            currentWin: 'signIn',
            isValid: true,
        }
    }

    switchCurrentWin = (winName) => {
        this.setState({
            currentWin: winName,
            isValid: true,
        })
    }

    invertIsValid = () => {
        this.setState({
            isValid: !this.state.isValid,
        })
    }

    loginHandler = (e) => {
        e.preventDefault()
        this.props.auth(
            this.login.current.value,
            this.password.current.value,
            true,
        )
    }

    registerHandler = (e) => {
        e.preventDefault()
        if (this.password.current.value.length < 6 || this.login.current.value.replace(/\s+/g, '') === '')
            this.invertIsValid()
        else {
            this.props.auth(
                this.login.current.value,
                this.password.current.value,
                false,
            )
            this.switchCurrentWin('userInfoInp')
        }
    }

    saveContactInformation = (e) => {
        e.preventDefault()
        if (this.name.current.value.replace(/\s+/g, '') !== ''
            && this.numberPhone.current.value.replace(/\s+/g, '') !== '' && this.address.current.value.replace(/\s+/g, '') !== '') {
            this.switchCurrentWin('success')
        } else {
            this.invertIsValid()
        }
    }

    renderSuccessMessage = () => {
        return (
            <>
                <h3>Вы успешно зарегестрированы!</h3>
                <div className={'button-section'}>
                    <button className={'main-item-style'} onClick={this.props.onClose}>Ок</button>
                </div>
            </>
        )
    }

    renderInputUserInfo() {
        if (this.props.isError === true)
            this.switchCurrentWin('signUp')
        return (
            <>
                <input className={'hide'}/><input className={'hide'}/><input className={'hide'}/>
                <h3>Введите вашу контактную ифнормацию</h3>

                <label>Введите ваше имя*</label>
                <input className={this.state.isValid === false ? 'input-error' : ''} type="text" ref={this.name}/>
                <label>Введите ваш номер телефона*</label>
                <input className={this.state.isValid === false ? 'input-error' : ''} type="text"
                       ref={this.numberPhone}/>
                <label>Введите ваш адрес*</label>
                <input className={this.state.isValid === false ? 'input-error' : ''} type="text" ref={this.address}/>
                <small className={this.state.isValid === false ? 'error' : 'hide'}>
                    Поля помеченные * обязательные для заполнения
                </small>

                <div className={'button-section'}>
                    <button className={'main-item-style'} onClick={this.saveContactInformation}>Применить</button>
                    <button className={'main-item-style'} onClick={this.saveContactInformation}>Позже</button>
                </div>
            </>
        )
    }

    renderSignUp = () => {
        if (this.props.isError === true)
            console.log(this.login)
        else
            return (
                <>
                    <h3>Регестрация</h3>

                    <label>Укажите почту</label>
                    <input
                        className={this.login.current.value.replace(/\s+/g, '') === '' && !this.state.isValid ? 'input-error' : ''}
                        type="text" ref={this.login}/>
                    <label>Придумайте пароль</label>
                    <input className={this.state.isValid === false ? 'input-error' : ''} type="text"
                           ref={this.password}/>
                    <small className={this.state.isValid === false ? 'error' : 'hide'}>
                        {this.login.current.value.replace(/\s+/g, '') === '' ? 'Почта не может быть пустой!' : null}
                        {this.password.current.value.replace(/\s+/g, '') === '' ? <><br/>Пароль не может содержать менее
                            6 символов!</> : null}
                    </small>

                    <div className={'button-section'}>
                        <button className={'main-item-style'} onClick={this.registerHandler}>Регистрация</button>
                        <button className={'main-item-style'} onClick={() => {
                            this.switchCurrentWin('signIn')
                        }}>Назад
                        </button>
                    </div>
                </>
            )
    }

    renderSignIn = () => {
        return (
            <>
                <h3>Авторизуйтесь</h3>
                <label>Введите логин</label>
                <input className={this.props.isError === true ? 'input-error' : ''} type="text" ref={this.login}/>
                <label>Введите пароль</label>
                <input className={this.props.isError === true ? 'input-error' : ''} type="text" ref={this.password}/>
                <small className={this.props.isError === true ? 'error' : 'hide'}>Не верный логин или пароль</small>

                <div className={'button-section'}>
                    <button className={'main-item-style'} onClick={this.loginHandler}>Войти</button>
                    <button className={'main-item-style'} onClick={() => {
                        this.switchCurrentWin('signUp')
                    }}>Создать аккаунт
                    </button>
                </div>
            </>
        )
    }

    render() {
        if (this.props.isOpen === false || (this.props.isAuth === true && this.state.currentWin === 'signIn')) return null
        return (
            <>
                <div className={'auth-form'}>
                    <div className="auth-form__inputs">
                        {
                            this.state.currentWin === 'signIn'
                                ? this.renderSignIn()
                                : this.state.currentWin === 'signUp' ? this.renderSignUp()
                                : this.state.currentWin === 'userInfoInp'
                                    ? this.renderInputUserInfo()
                                    : this.renderSuccessMessage()
                        }
                    </div>
                </div>
                <div className={'bg'} onClick={this.props.onClose}/>
            </>
        )
    }
}

function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        auth: (email, password, login) => dispatch(auth(email, password, login)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthModalForm)