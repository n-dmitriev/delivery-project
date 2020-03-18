import React, {Component} from 'react'
import './AuthModalForm.scss'
import {connect} from 'react-redux'
import {auth} from '../../store/actions/auth'

class AuthModalForm extends Component {
    constructor(props) {
        super(props)
        this.login = React.createRef()
        this.password = React.createRef()
        this.state = {}
    }

    loginHandler = (e) => {
        e.preventDefault()
        this.props.auth(
            this.login.current.value,
            this.password.current.value,
            true
        )
    }

    registerHandler = () => {
        this.props.auth(
            this.state.formControls.email.value,
            this.state.formControls.password.value,
            false
        )
    }

    render() {
        if (this.props.isOpen === false || this.props.isAuth === true) return null
        return (
            <>
                <div className={'auth-form'}>
                    <div className="auth-form__inputs">
                        <h3>Авторизуйтесь</h3>
                        <label>Введите логин</label>
                        <input className={this.props.isError === true ?'input-error' :''} type="text" ref={this.login}/>
                        <label>Введите пароль</label>
                        <input className={this.props.isError === true ?'input-error' :''} type="text" ref={this.password}/>
                        <small className={this.props.isError === true ?'error' :'hide'}>Не верный логин или пароль</small>

                        <div className={'button-section'}>
                            <button className={'main-item-style'} onClick={this.loginHandler}>Войти</button>
                            <button className={'main-item-style'}>Создать аккаунт</button>
                        </div>
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
        auth: (email, password, login) => dispatch(auth(email, password, login))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthModalForm)