import React, {Component} from 'react'
import './AuthModalForm.scss'
import {connect} from 'react-redux'
import {auth, removeError} from '../../store/actions/auth'
import {createUserStore} from '../../store/actions/currentOrder'
import {sendOrder} from '../../store/actions/currentOrder'
import InputUserInformation from '../../components/InputUserInformation/InputUserInformation'

//Данный контейнер отвечает за авторизацию и регистрацию пользователей
class AuthModalForm extends Component {
    constructor(props) {
        super(props)
        this.login = React.createRef()
        this.password = React.createRef()
        this.state = {
            currentWin: 'signIn',
            loginIsValid: true,
            passwordIsValid: true,
        }
    }

    //Обунуление инпутов, необходимость вызвана переносом содержимого инпутов, при рендеринге нового элемента
    zeroingInputs = () => {
        if (this.login.current) this.login.current.value = ''
        if (this.password.current) this.password.current.value = ''
    }

    //Меняем контент в модальном окне, состояния: signIn, signUp, userInfoInp, success
    switchCurrentWin = (winName) => {
        this.setState({
            currentWin: winName
        })
        this.props.removeError()
        this.zeroingInputs()
    }

    //Валидация пароля и логина
    validateUserData = () => {
        this.setState({
            loginIsValid: this.login.current.value.replace(/\s+/g, '') !== '',
            passwordIsValid: this.password.current.value.length > 6,
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
            this.closeAuthWin()
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
                        this.switchCurrentWin()
                }
            }
        }
    }

    //Обработчик попытки сохранения пользовательских данных
    saveContactInformation = async (info) => {
        this.props.createUserStore(info)
        this.closeAuthWin('successRegistration')
    }


    closeAuthWin = () => {
        this.props.onClose()
        this.switchCurrentWin('signIn')
        if (this.props.trySendOrderNotAuth) {
            this.props.trySendOrder(false)
            this.props.sendOrder()
        }
    }


    //Редеринг формы для ввода контактной информации
    renderInputUserInfo() {
        return (
            <>
                <InputUserInformation
                    saveContactInformation={this.saveContactInformation}
                    onClose={this.props.onClose}
                />
            </>
        )
    }

    //Рендеринг формы для регестрации
    renderSignUp = () => {
        return (
            <>
                <h2 className={'mb-30'}>Регестрация</h2>

                <label className={'mb-15'}>Укажите почту</label>
                <input
                    className={!this.state.loginIsValid || this.props.isError ? 'input-error mb-30' : 'mb-30'}
                    type="text" ref={this.login}/>
                <label className={'mb-15'}>Придумайте пароль</label>
                <input className={!this.state.passwordIsValid ? 'input-error mb-15' : 'mb-30'} type="login"
                       ref={this.password}/>
                <small className={this.state.loginIsValid && this.state.passwordIsValid ? 'hide' : 'error'}>
                    {!this.state.loginIsValid ? 'Почта не может быть пустой!' : null}
                    {!this.state.passwordIsValid ? <><br/>Пароль не может содержать менее 6 символов!</> : null}
                </small>

                <small className={this.props.isError ? 'error' : 'hide'}>Вы указали некорректную почту!</small>

                <div className={'button-section'}>
                    <button className={'main-item-style mr-15'} onClick={this.registerHandler}>Зарегестрироваться</button>
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
                <h2 className={'mb-30'}>{this.props.trySendOrderNotAuth? 'Прежде чем сдеать заказ, авторизуйтесь или зарегестрируйтесь' : 'Авторизуйтесь'}  </h2>

                <label className={'mb-15'}>Введите логин</label>
                <input className={this.props.isError === true ? 'input-error mb-30' : 'mb-30'} type="login" ref={this.login}/>
                <label className={'mb-15'}>Введите пароль</label>
                <input className={this.props.isError === true ? 'input-error mb-15' : 'mb-30'} type="password"
                       ref={this.password}/>
                <small className={this.props.isError === true ? 'error' : 'hide'}>Неверный логин или пароль!</small>

                <div className={'button-section'}>
                    <button className={'main-item-style mr-15'} onClick={this.loginHandler}>Войти</button>
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
                                    : null
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