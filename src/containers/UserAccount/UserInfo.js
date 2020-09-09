import React, {Component} from 'react'
import {connect} from 'react-redux'
import {confirm} from '../../components/UI/Confirm/Confirm'
import toaster from 'toasted-notes'
import {Redirect} from 'react-router-dom'
import PasswordChangeForm from '../../components/PasswordChangeForm/PasswordChangeForm'
import FunctionalButtons from '../../components/FunctionalButtons/FunctionalButtons'
import InputInformation from '../../components/InputInformation/InputInformation'
import Footer from '../../components/UI/Footer/Footer'
import {logout} from '../../store/authentication/authActions'
import {passwordChange, setUserInfo} from '../../store/user/userActions'

class element extends Component {
    constructor() {
        super()
        document.title = 'EasyWays | Личный кабинет'
    }

    state = {
        cpfIsOpen: false
    }

    interactionWithChangeModal = () => {
        this.setState({
            cpfIsOpen: !this.state.cpfIsOpen
        })
    }

    saveContactInformation = (info) => {
        confirm(
            'изменить данные вашей учетной записи', async () => {
                await this.props.setUserInfo(info)
                toaster.notify('Ваши данные успешно изменены!', {
                    position: 'bottom-right',
                    duration: 3000
                })
            }
        )
    }

    render() {
        if ((this.props.match.path === '/user-account/:number/user-info' && this.props.match.params.number !== this.props.id)
            || Object.keys(this.props.userInfo).length === 0)
            return <Redirect to={'/'}/>
        else
            return (
                <div className={'user-account'}>
                    <PasswordChangeForm errorPassword={this.props.errorPassword}
                                        passwordChange={this.props.passwordChange}
                                        isOpen={this.state.cpfIsOpen}
                                        onClose={this.interactionWithChangeModal}/>

                    <div className={'container'}>
                        <div className="row">
                            <div className="col-lg-2 col-md-1 col-sm-0"/>
                            <div className="col-lg-8 col-md-10 col-sm-12">
                                <div className="app__main-content">
                                    <h1 className={'mb-30'}>
                                        Ваш профиль
                                    </h1>

                                    <FunctionalButtons
                                        logout={this.props.logout}
                                        interactionWithChangeModal={this.interactionWithChangeModal}
                                    />

                                    <hr/>

                                    <div className="user-account__input">
                                        <InputInformation
                                            saveContactInformation={this.saveContactInformation}
                                            userInfo={this.props.userInfo}
                                            type={'user'}
                                            page={'account'}
                                        />
                                    </div>
                                </div>
                                <Footer/>
                            </div>
                            <div className="col-lg-2 col-md-1 col-sm-0"/>
                        </div>
                    </div>
                </div>
            )

    }
}

function mapStateToProps(state) {
    return {
        id: state.authReducer.id,
        userInfo: state.userReducer.info,
        errorPassword: state.userReducer.error
    }
}

function mapDispatchToProps(dispatch) {
    return {
        logout: () => dispatch(logout()),
        setUserInfo: (info) => dispatch(setUserInfo(info)),
        passwordChange: (oldPassword, newPassword) => dispatch(passwordChange(oldPassword, newPassword))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(element)