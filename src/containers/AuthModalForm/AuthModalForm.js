import React, {Component} from 'react'
import './AuthModalForm.scss'
import {connect} from 'react-redux'
import {authActions, removeError} from '../../store/authentication/authActions'
import InputInformation from '../../components/InputInformation/InputInformation'
import AuthShape from '../../components/AuthShape/AuthShape'
import {setUserInfo} from '../../store/user/userActions'
import toaster from 'toasted-notes'
import ModalWindow from '../../components/UI/ModalWindow/ModalWindow'


//Данный контейнер отвечает за авторизацию и регистрацию пользователей
class AuthModalForm extends Component {
    state = {
        currentWin: 'signIn'
    }

    //Меняем контент в модальном окне, состояния: signIn, signUp, userInfoInp, success
    switchCurrentWin = (winName) => {
        this.setState({
            currentWin: winName
        })
        this.props.removeError()
    }

    //Обрабочтик попытки авторизации
    loginHandler = async (login, email) => {
        await this.props.auth(login, email, true, 'users')
        if (this.props.isAuth) {
            if (this.props.trySendOrderNotAuth) {
                this.props.trySendOrder(false)
            }
            toaster.notify('Вы успешно авторизовались!', {
                position: 'bottom-right',
                duration: 3000
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
            toaster.notify('Ваши данные сохранены!', {
                position: 'bottom-right',
                duration: 3000
            })
        } else
            toaster.notify('Ваши данные сохранены!', {
                position: 'bottom-right',
                duration: 3000
            })
    }

    //Обработчик попытки решистрации
    registerHandler = async (login, email) => {

        await this.props.auth(login, email, false, 'users')
        if (this.props.isError !== true) {
            toaster.notify('Вы успешно зарегестрировались!', {
                position: 'bottom-right',
                duration: 3000
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

    renderContent = () => {
        return (
            <div className={'auth-form'}>
                <div className="auth-form__inputs">
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
        )
    }

    render() {
        if (this.props.isAuth === true && this.state.currentWin === 'signIn') return null
        return (
            <ModalWindow
                isOpen={this.props.isOpen}
                onClose={this.closeAuthWin}
                renderBody={this.renderContent}
            />
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        auth: (email, password, isLogin, collection) => dispatch(authActions(email, password, isLogin, collection)),
        removeError: () => dispatch(removeError()),
        setUserInfo: (info) => dispatch(setUserInfo(info))
    }
}

export default connect(null, mapDispatchToProps)(AuthModalForm)