import React, {Component} from 'react'

export default class AuthShape extends Component {
    constructor(props) {
        super(props)
        this.login = React.createRef()
        this.password = React.createRef()
        this.state = {
            loginIsValid: true,
            passwordIsValid: true,
        }
    }

    validateUserData = () => {
        this.setState({
            loginIsValid: this.login.current.value.replace(/\s+/g, '') !== '',
            passwordIsValid: this.password.current.value.length > 6,
        })
    }

    authHandler = async (e) => {
        e.preventDefault()
        if (this.password && this.login) {
            {
                await this.validateUserData()
                if (this.state.loginIsValid && this.state.passwordIsValid) {
                    this.props.auth(this.login.current.value, this.password.current.value)
                }
            }
        }

    }

    renderAuthForm = () => {
        return (
            <>
                <h2 className={'mb-30'}>Авторизуйтесь</h2>

                <label
                    className={'mb-15'}>{this.props.trySendOrderNotAuth ? 'Прежде чем сдеать заказ, авторизуйтесь или зарегестрируйтесь' : ''} </label>

                <label className={'mb-15'}>Введите логин</label>
                <input className={this.props.isError === true ? 'input-error mb-30' : 'mb-30'} type="login"
                       ref={this.login}/>
                <label className={'mb-15'}>Введите пароль</label>
                <input className={this.props.isError === true ? 'input-error mb-15' : 'mb-30'} type="password"
                       ref={this.password}/>
                <small className={this.props.isError === true ? 'error' : 'hide'}>Неверный логин или пароль!</small>

                <div className={'button-section mt-15'}>
                    <button className={'main-item-style mr-15'} onClick={this.authHandler}>Войти</button>
                    {
                        this.props.type === 'authModal' ? <button className={'main-item-style'} onClick={() => {
                            this.props.switchCurrentWin('signUp')
                        }}>
                            Создать аккаунт
                        </button> : null
                    }
                </div>
            </>
        )
    }

    renderRegistrForm = () => {
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
                    <button className={'main-item-style mr-15'} onClick={this.authHandler}>Зарегестрироваться
                    </button>
                    {
                        this.props.type === 'authModal' ? <button className={'main-item-style'} onClick={() => {
                            this.props.switchCurrentWin('signIn')
                        }}>
                            Назад
                        </button> : null
                    }
                </div>
            </>
        )
    }

    render() {
        return (
            <>
                {
                    this.props.thisReg === true ? this.renderRegistrForm() : this.renderAuthForm()
                }
            </>
        )
    }
}