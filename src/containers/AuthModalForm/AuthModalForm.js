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
    state = {
        isLogin: true
    }

    componentWillUnmount() {
        if (this.state.isLogin)
            this.setState({
                isLogin: true
            })
    }

    shouldComponentUpdate = (nextProps, nextState, nextContext) => {
        if (nextProps.isAuth) {
            if (this.state.isLogin) {
                this.props.onClose()
                toaster.notify('Вы успешно авторизовались!', {
                    position: 'bottom-right',
                    duration: 3000
                })
            } else
                toaster.notify('Вы успешно зарегестрировались!', {
                    position: 'bottom-right',
                    duration: 3000
                })
        }
        return true
    }

    authHandler = async (login, email, isLogin) => {
        await this.setState({
            isLogin
        })
        await this.props.auth(login, email, isLogin, 'users')
    }

    renderContent = () => {
        return (
            <div className={'auth-form'}>
                <AuthShape
                    type={'authModal'}
                    isError={this.props.isError}
                    isAuth={this.props.isAuth}
                    authHandler={this.authHandler}
                    onClose={this.props.onClose}
                    currentWin={'signIn'}
                    removeError={this.props.removeError}
                    resetPassword={this.props.resetPassword}
                    setUserInfo={this.props.setUserInfo}
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