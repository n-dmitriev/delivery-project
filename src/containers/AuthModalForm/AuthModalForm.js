import React, {Component} from 'react'
import './AuthModalForm.scss'
import {connect} from 'react-redux'
import {auth, removeError} from '../../store/actions/auth'
import {sendOrder} from '../../store/actions/currentOrder'
import InputUserInformation from '../../components/InputUserInformation/InputUserInformation'
import AuthShape from '../../components/AuthShape/AuthShape'
import {setUserInfo} from '../../store/actions/userInformation'


//Данный контейнер отвечает за авторизацию и регистрацию пользователей
class AuthModalForm extends Component {
    state = {
        currentWin: 'signIn',
    }

    //Меняем контент в модальном окне, состояния: signIn, signUp, userInfoInp, success
    switchCurrentWin = (winName) => {
        this.setState({
            currentWin: winName,
        })
        this.props.removeError()
    }

    //Обрабочтик попытки авторизации
    loginHandler = async (login, email) => {
        await this.props.auth(login, email, true,)
        if (this.props.isAuth) {
            this.closeAuthWin()
        }
    }

    //Обработчик попытки сохранения пользовательских данных
    saveContactInformation = async (info) => {
        this.props.setUserInfo(info)
        this.closeAuthWin('successRegistration')
    }

    //Обработчик попытки решистрации
    registerHandler = async (login, email) => {

        await this.props.auth(login, email, false,)
        if (this.props.isError !== true) {
            this.switchCurrentWin('userInfoInp')
        }
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
                    onClose={this.closeAuthWin}
                    trySend={this.props.trySendOrderNotAuth}
                    type={'user'}
                />
            </>
        )
    }

    //Рендеринг формы для регестрации
    renderSignUp = () => {
        return (
            <AuthShape
                type={'authModal'}
                isError={this.props.isError}
                auth={this.registerHandler}
                thisReg={true}
                switchCurrentWin={this.switchCurrentWin}
            />
        )
    }

    //Рендеринг формы для авторизации
    renderSignIn = () => {
        return (
            <AuthShape
                trySendOrderNotAuth={this.props.trySendOrderNotAuth}
                type={'authModal'}
                isError={this.props.isError}
                auth={this.loginHandler}
                thisReg={false}
                switchCurrentWin={this.switchCurrentWin}
            />
        )
    }

    render() {
        if (this.props.isOpen === false || (this.props.isAuth === true && this.state.currentWin === 'signIn')) return null
        return (
            <>
                <div className={'auth-form'}>
                    <div className="auth-form__inputs">
                        <span className="dagger dagger_delete" onClick={this.closeAuthWin}></span>
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
                <div className={'bg'} onClick={this.closeAuthWin}/>
            </>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        auth: (email, password, login) => dispatch(auth(email, password, login)),
        removeError: () => dispatch(removeError()),
        sendOrder: () => dispatch(sendOrder()),
        setUserInfo: (info) => dispatch(setUserInfo(info))
    }
}

export default connect(null, mapDispatchToProps)(AuthModalForm)