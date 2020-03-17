import React, {Component} from 'react'
import './AuthModalForm.scss'
import {connect} from 'react-redux'

class AuthModalForm extends Component {
    constructor(props) {
        super(props)
        this.login = React.createRef()
        this.password = React.createRef()
        this.state = {}
    }

    render() {
        if (this.props.isOpen === false) return null
        return (
            <>
                <div className={'auth-form'}>
                    <div className="auth-form__inputs">
                        <h3>Авторизуйтесь</h3>
                        <label>Введите логин</label>
                        <input type="text" ref={this.login}/>
                        <label>Введите пароль</label>
                        <input type="text" ref={this.password}/>

                        <div className={'button-section'}>
                            <button className={'main-item-style'}>Войти</button>
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
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthModalForm)