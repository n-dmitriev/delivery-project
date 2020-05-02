import React, {Component} from 'react'
import './AuthModalForm.scss'
import {connect} from 'react-redux'
import {authActions, removeError} from '../../store/authentication/authActions'
import {sendOrder} from '../../store/currentOrder/orderActions'
import InputInformation from '../../components/InputInformation/InputInformation'
import AuthShape from '../../components/AuthShape/AuthShape'
import {setUserInfo} from '../../store/userInformation/userActions'
import toaster from 'toasted-notes'


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
        await this.props.auth(login, email, true, 'users')
        if (this.props.isAuth) {
            if (this.props.trySendOrderNotAuth) {
                this.props.trySendOrder(false)
                this.props.sendOrder()
            }
            toaster.notify('Вы успешно авторизовались!', {
                position: 'bottom-right',
                duration: 3000,
            })
            this.closeAuthWin()
        }
    }

    //Обработчик попытки сохранения пользовательских данных
    saveContactInformation = async (info) => {
        this.props.setUserInfo(info)
        this.closeAuthWin('successRegistration')
        if (this.props.trySendOrderNotAuth) {
            this.props.trySendOrder(false)
            this.props.sendOrder(info)
            toaster.notify('Ваши данные сохранены, заказ отправлен!', {
                position: 'bottom-right',
                duration: 3000,
            })
        }
        else
            toaster.notify('Ваши данные сохранены!', {
                position: 'bottom-right',
                duration: 3000,
            })
    }

    //Обработчик попытки решистрации
    registerHandler = async (login, email) => {

        await this.props.auth(login, email, false, 'users')
        if (this.props.isError !== true) {
            toaster.notify('Вы успешно зарегестрировались!', {
                position: 'bottom-right',
                duration: 3000,
            })
            this.switchCurrentWin('userInfoInp')
        }
    }


    closeAuthWin = () => {
        this.props.onClose()
        this.switchCurrentWin('signIn')
    }


    //Редеринг формы для ввода контактной информации
    renderInputUserInfo() {
        return (
            <>
                <InputInformation
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
                        <span className="dagger dagger_delete" onClick={this.closeAuthWin}/>
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
        auth: (email, password, isLogin, collection) => dispatch(authActions(email, password, isLogin, collection)),
        removeError: () => dispatch(removeError()),
        sendOrder: (info) => dispatch(sendOrder(info)),
        setUserInfo: (info) => dispatch(setUserInfo(info)),
    }
}

export default connect(null, mapDispatchToProps)(AuthModalForm)