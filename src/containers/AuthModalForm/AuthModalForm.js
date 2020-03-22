import React, {Component} from 'react'
import './AuthModalForm.scss'
import {connect} from 'react-redux'
import {auth, removeError} from '../../store/actions/auth'
import {createUserStore} from '../../store/actions/orders'
import {sendOrder} from '../../store/actions/currentOrder'

//Данный контейнер отвечает за авторизацию и регистрацию пользователей
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
            nameIsValid: true,
            numberPhoneIsValid: true,
            addressIsValid: true,
            loginIsValid: true,
            passwordIsValid: true,
        }
    }

    //Обунуление инпутов, необходимость вызвана переносом содержимого инпутов, при рендеринге нового элемента
    zeroingInputs = () => {
        if (this.login.current) this.login.current.value = ''
        if (this.password.current) this.password.current.value = ''
        if (this.numberPhone.current) this.numberPhone.current.value = ''
        if (this.address.current) this.address.current.value = ''
        if (this.name.current) this.name.current.value = ''
    }

    //Меняем контент в модальном окне, состояния: signIn, signUp, userInfoInp, success
    switchCurrentWin = (winName) => {
        this.setState({
            currentWin: winName,
            isValid: true,
        })
        this.props.removeError()
        this.zeroingInputs()
    }

    //Валидация пароля и логина
    validateUserData = () => {
        this.setState({
            loginIsValid: this.password.current.value.length > 6,
            passwordIsValid: this.login.current.value.replace(/\s+/g, '') !== '',
        })
    }

    //Валидация информации о пользователе
    validateUserInformation = () => {
        this.setState({
            nameIsValid: this.name.current.value.replace(/\s+/g, '') !== '',
            numberPhoneIsValid: this.numberPhone.current.value.replace(/\s+/g, '') !== '',
            addressIsValid: this.address.current.value.replace(/\s+/g, '') !== '',
        })
    }

    //Обрабочтик попытки авторизации
    loginHandler = async (e) => {
        e.preventDefault()
        await this.props.auth(
            this.login.current.value,
            this.password.current.value,
            true,
        )
        if(this.props.isAuth){
            this.switchCurrentWin('successAuth')
        }
    }

    //Обработчик попытки решистрации
    registerHandler = async (e) => {
        e.preventDefault()
        if (this.password && this.login) {
            {
                await this.validateUserData()
                if (this.state.loginIsValid && this.state.passwordIsValid) {
                    await this.props.auth(
                        this.login.current.value,
                        this.password.current.value,
                        false,
                    )
                    if (this.props.isError !== true)
                        this.switchCurrentWin('userInfoInp')
                }
            }
        }
    }

    //Обработчик попытки сохранения пользовательских данных
    saveContactInformation = async (e) => {
        e.preventDefault()
        if (this.name && this.numberPhone && this.address) {
            await this.validateUserInformation()
            if (this.state.nameIsValid && this.state.numberPhoneIsValid && this.state.addressIsValid) {
                this.props.createUserStore({
                    name: this.name.current.value,
                    numberPhone: this.numberPhone.current.value,
                    address: this.address.current.value,
                    role: 'user',
                    orderList: [],
                })
                this.switchCurrentWin('success')
            }
        }
    }

    //Сообщение об успешной регистрации
    renderSuccessMessage = (type) => {
        return (
            <>
                <h2>Вы успешно {this.state.currentWin === 'successAuth'? 'авторизовались' :'зарегестрированы'}!<br/>{this.props.trySendOrderNotAuth ? 'Ваш заказ успешно оформлен!' : null}</h2>
                <div className={'button-section'}>
                    <button className={'main-item-style'} onClick={() => {
                        this.props.onClose()
                        this.switchCurrentWin('signIn')
                        if(this.props.trySendOrderNotAuth){
                            this.props.trySendOrder(false)
                            this.props.sendOrder()
                        }
                    }}>Ок
                    </button>
                </div>
            </>
        )
    }


    //Редеринг формы для ввода контактной информации
    renderInputUserInfo() {
        return (
            <>
                <h3>Введите вашу контактную ифнормацию</h3>

                <label>Введите ваше имя*</label>
                <input className={this.state.nameIsValid === false ? 'input-error' : ''} type="text" ref={this.name}/>
                <label>Введите ваш номер телефона*</label>
                <input className={this.state.numberPhoneIsValid === false ? 'input-error' : ''} type="text"
                       ref={this.numberPhone}/>
                <label>Введите ваш адрес*</label>
                <input className={this.state.addressIsValid === false ? 'input-error' : ''} type="text"
                       ref={this.address}/>
                <small
                    className={this.state.nameIsValid && this.state.numberPhoneIsValid && this.state.addressIsValid ? 'hide' : 'error'}>
                    Поля помеченные * обязательные для заполнения
                </small>

                <div className={'button-section'}>
                    <button className={'main-item-style'} onClick={this.saveContactInformation}>Применить</button>
                    <button className={'main-item-style'} onClick={this.props.onClose}>Позже</button>
                </div>
            </>
        )
    }

    //Рендеринг формы для регестрации
    renderSignUp = () => {
        return (
            <>
                <h2>Регестрация</h2>

                <label>Укажите почту</label>
                <input
                    className={!this.state.loginIsValid || this.props.isError ? 'input-error' : ''}
                    type="text" ref={this.login}/>
                <label>Придумайте пароль</label>
                <input className={!this.state.passwordIsValid ? 'input-error' : ''} type="login"
                       ref={this.password}/>
                <small className={this.state.loginIsValid && this.state.passwordIsValid ? 'hide' : 'error'}>
                    {!this.state.loginIsValid ? 'Почта не может быть пустой!' : null}
                    {!this.state.passwordIsValid ? <><br/>Пароль не может содержать менее 6 символов!</> : null}
                </small>

                <small className={this.props.isError ? 'error' : 'hide'}>Вы указали некорректную почту!</small>

                <div className={'button-section'}>
                    <button className={'main-item-style'} onClick={this.registerHandler}>Зарегестрироваться</button>
                    <button className={'main-item-style'} onClick={() => {
                        this.switchCurrentWin('signIn')
                    }}>
                        Назад
                    </button>
                </div>
            </>
        )
    }

    //Рендеринг формы для авторизации
    renderSignIn = () => {
        return (
            <>
                <h2>{this.props.trySendOrderNotAuth? 'Прежде чем сдеать заказ, авторизуйтесь или зарегестрируйтесь' : 'Авторизуйтесь'}  </h2>

                <label>Введите логин</label>
                <input className={this.props.isError === true ? 'input-error' : ''} type="login" ref={this.login}/>
                <label>Введите пароль</label>
                <input className={this.props.isError === true ? 'input-error' : ''} type="password"
                       ref={this.password}/>
                <small className={this.props.isError === true ? 'error' : 'hide'}>Неверный логин или пароль!</small>

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
                            <span className="dagger dagger_delete" onClick={this.props.onClose}></span>
                            {
                                this.state.currentWin === 'signIn'
                                    ? this.renderSignIn()
                                    : this.state.currentWin === 'signUp'
                                        ? this.renderSignUp()
                                        : this.state.currentWin === 'userInfoInp'
                                            ? this.renderInputUserInfo()
                                            : this.state.currentWin === 'success'
                                                ? this.renderSuccessMessage('successRegistration')
                                                : this.renderSuccessMessage('successAuth')
                            }
                        </div>
                    </div>
                    <div className={'bg'} onClick={this.props.onClose}/>
                </>
            )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        auth: (email, password, login) => dispatch(auth(email, password, login)),
        createUserStore: (info) => dispatch(createUserStore(info)),
        removeError: () => dispatch(removeError()),
        sendOrder: () => dispatch(sendOrder()),
    }
}

export default connect(null, mapDispatchToProps)(AuthModalForm)