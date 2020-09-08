import React, {Component} from 'react'
import './AuthModalForm.scss'
import {connect} from 'react-redux'
import {authActions, removeError, resetPassword} from '../../store/authentication/authActions'
import AuthShape from '../../components/AuthShape/AuthShape'
import {setUserInfo} from '../../store/user/userActions'
import toaster from 'toasted-notes'
import ModalWindow from '../../components/UI/ModalWindow/ModalWindow'


//Данный контейнер отвечает за авторизацию и регистрацию пользователей
class AuthModalForm extends Component {
    //Обрабочтик попытки авторизации
    loginHandler = async (login, email) => {
        await this.props.auth(login, email, true, 'users')
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

    renderContent = () => {
        return (
            <div className={'auth-form'}>
                <AuthShape
                    type={'authModal'}
                    isError={this.props.isError}
                    auth={this.loginHandler}
                    registerHandler={this.registerHandler}
                    closeAuthWin={this.props.onClose}
                    currentWin={'signIn'}
                    removeError={this.props.removeError()}
                    resetPassword={this.props.resetPassword}
                />
            </div>
        )
    }

    render() {
        return (
            <ModalWindow
                isOpen={this.props.isOpen}
                onClose={this.props.onClose}
                renderBody={this.renderContent}
            />
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        auth: (email, password, isLogin, collection) => dispatch(authActions(email, password, isLogin, collection)),
        removeError: () => dispatch(removeError()),
        setUserInfo: (info) => dispatch(setUserInfo(info)),
        resetPassword: (email) => dispatch(resetPassword(email))
    }
}

export default connect(null, mapDispatchToProps)(AuthModalForm)