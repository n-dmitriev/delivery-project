import React, {Component} from 'react'
import toaster from 'toasted-notes'
import InputInformation from '../InputInformation/InputInformation'
import {confirmAlert} from 'react-confirm-alert'

export default class AuthShape extends Component {
    constructor(props) {
        super(props)
        this.login = React.createRef()
        this.password = React.createRef()
        this.passwordDoubler = React.createRef()
        this.state = {
            loginIsValid: true,
            passwordIsValid: true,
            passwordDoublerIsValid: true,
            currentWin: this.props.currentWin
        }
    }

    //Меняем контент в модальном окне, состояния: signIn, signUp, userInfoInp, success
    switchCurrentWin = (winName) => {
        this.setState({
            currentWin: winName
        })
        if (this.props.isError)
            this.props.removeError()
    }

    validateUserData = () => {
        this.setState({
            loginIsValid: this.login.current.value.replace(/\s+/g, '') !== '',
            passwordIsValid: this.password.current.value.length > 6
        })
    }

    authHandler = async (e) => {
        e.preventDefault()
        if (this.password && this.login) {
            await this.validateUserData()
            if (this.state.loginIsValid && this.state.passwordIsValid && (this.passwordDoubler ? this.state.passwordDoublerIsValid : true)) {
                console.log(this.login.current.value, this.password.current.value)
                this.props.auth(this.login.current.value, this.password.current.value)
            }
        }
    }

    changePasswordDoubler = () => {
        if (this.passwordDoubler.current.value !== this.password.current.value) {
            if (this.state.passwordDoublerIsValid)
                this.setState({
                    passwordDoublerIsValid: false
                })
        } else {
            this.setState({
                passwordDoublerIsValid: true
            })
        }
    }

    resetPassword = () => {
        const login = this.login.current.value
        if (login.replace(/\s+/g, '') !== '') {
            this.props.resetPassword(login)
            confirmAlert(
                {
                    customUI: ({onClose}) => {
                        return (
                            <div className={'confirm'}>
                                <h3 className={'mb-4'}>Письмо было отправлено на указанный email</h3>
                                <div className="button-section">
                                    <button className={'btn btn-dark mr-2'}
                                            onClick={async () => {
                                                this.props.closeAuthWin()
                                                onClose()
                                            }}
                                    >
                                        Ок
                                    </button>
                                    <button className={'btn btn-dark'} onClick={onClose}>Назад</button>
                                </div>
                            </div>
                        )
                    }
                })
        }
    }

    //Обработчик попытки сохранения пользовательских данных
    saveContactInformation = async (info) => {
        this.props.setUserInfo(info)
        this.closeAuthWin()
        toaster.notify('Ваши данные сохранены!', {
            position: 'bottom-right',
            duration: 3000
        })
    }

    //Редеринг формы для ввода контактной информации
    inputUserInfoWindow() {
        return (
            <InputInformation
                saveContactInformation={this.saveContactInformation}
                type={'user'}
            />
        )
    }

    authWindow = () => {
        return (
            <>
                <h2 className={'mb-30'}>Авторизуйтесь</h2>

                <label className={'mb-15'}>Введите логин</label>
                <input className={this.props.isError === true ? 'input-error mb-15' : 'mb-30'} type="login"
                       ref={this.login}/>

                <label className={'mb-15'}>Введите пароль</label>
                <input className={this.props.isError === true ? 'input-error mb-15' : 'mb-15'} type="password"
                       ref={this.password}/>

                <small className={'error'}>
                    {!this.state.loginIsValid ? <div className={'mb-2'}>Почта не может быть пустой!</div> : null}
                    {!this.state.passwordIsValid ?
                        <div className={'mb-2'}>Пароль не может содержать менее 6 символов!</div>
                        : null}
                    {this.props.isError ? <div className={'mb-2'}>
                        Вы указали некорректную почту!</div> : null}
                </small>

                <span className={'change-password'}
                      onClick={() => this.switchCurrentWin('resetPassword')}
                >
                    Забыли пароль?
                </span>

                <div className={'button-section mt-15'}>
                    <button className={'main-item-style mr-15'} onClick={this.authHandler}>Войти</button>
                    {
                        this.props.type === 'authModal' ? <button className={'main-item-style'} onClick={() => {
                            this.switchCurrentWin('signUp')
                        }}>
                            Создать аккаунт
                        </button> : null
                    }
                </div>
            </>
        )
    }

    registrationWindow = () => {
        return (
            <>
                <h2 className={'mb-30'}>Регистрация {this.props.description}</h2>

                <label className={'mb-15'}>Укажите почту</label>
                <input
                    className={!this.state.loginIsValid || this.props.isError ? 'input-error mb-30' : 'mb-30'}
                    type="login" ref={this.login}/>

                <label className={'mb-15'}>Введите пароль</label>
                <input className={!this.state.passwordIsValid ? 'input-error mb-2' : 'mb-2'} type="password"
                       ref={this.password}/>

                <label className={'mb-15'}>Повторите пароль</label>
                <input className={!this.state.passwordDoublerIsValid ? 'input-error mb-15' : 'mb-30'} type="password"
                       onChange={this.changePasswordDoubler}
                       ref={this.passwordDoubler}/>

                <small className={'error'}>
                    {!this.state.loginIsValid ? <div className={'mb-2'}>Почта не может быть пустой!</div> : null}
                    {!this.state.passwordIsValid ?
                        <div className={'mb-2'}>Пароль не может содержать менее 6 символов!</div>
                        : null}
                    {!this.state.passwordDoublerIsValid ? <div className={'mb-2'}>
                            Пароли не совпадают!</div>
                        : null}
                    {this.props.isError ? <div className={'mb-2'}>
                        Вы указали некорректную почту!</div> : null}
                </small>

                <div className={'button-section mt-15'}>
                    <button className={'main-item-style mr-15'} onClick={this.authHandler}>
                        {
                            this.props.type === 'authModal'
                                ? 'Зарегистрироваться'
                                : 'Зарегистировать'
                        }
                    </button>
                    {
                        this.props.type === 'authModal' ? <button className={'main-item-style'} onClick={() => {
                            this.switchCurrentWin('signIn')
                        }}>
                            Назад
                        </button> : null
                    }
                </div>
            </>
        )
    }

    resetPasswordWindow = () => {
        return (
            <>
                <h2 className={'mb-30'}>Востановление пароля</h2>

                <label className={'mb-15'}>Укажите вашу почту</label>
                <input
                    className={!this.state.loginIsValid || this.props.isError ? 'input-error mb-30' : 'mb-30'}
                    type="login" ref={this.login}/>


                <small className={'error'}>
                    {this.props.isError ? 'Вы указали некорректную почту!' : null}
                </small>

                <div className={'button-section mt-15'}>
                    <button className={'main-item-style mr-15'} onClick={() => {
                        this.switchCurrentWin('signIn')
                    }}>
                        Назад
                    </button>
                    <button className={'main-item-style'} onClick={this.resetPassword}>
                        Отправить письмо
                    </button>
                </div>
            </>
        )
    }

    render() {
        console.log(this.props.isError)
        const winList = [
            {
                win: 'signIn',
                function: this.authWindow
            }, {
                win: 'signUp',
                function: this.registrationWindow
            }, {
                win: 'userInfoInp',
                function: this.inputUserInfoWindow
            }, {
                win: 'resetPassword',
                function: this.resetPasswordWindow
            }
        ]
        return (
            <>
                {
                    winList.map((el) => {
                        if (el.win === this.state.currentWin) {
                            return <div className={'auth-form__inputs'} key={el.win}>{el.function()}</div>
                        } else
                            return null
                    })
                }
            </>
        )
    }
}