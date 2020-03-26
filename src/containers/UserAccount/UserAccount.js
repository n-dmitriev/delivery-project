import React, {Component} from 'react'
import './UserAccount.scss'
import {connect} from 'react-redux'
import InputUserInformation from '../../components/InputUserInformation/InputUserInformation'
import {logout} from '../../store/actions/auth'
import {NavLink, Redirect} from 'react-router-dom'
import RenderOrderList from '../../components/RenderOrderList/RenderOrderList'
import {passwordChange, setUserInfo} from '../../store/actions/userInformation'
import PasswordChangeForm from '../../components/PasswordChangeForm/PasswordChangeForm'
import {cancelOrder} from '../../store/actions/currentOrder'
import OrderModalForm from '../OrderModalForm/OrderModalForm'

class UserAccount extends Component {
    state = {
        cpfIsOpen: false,
        isOrderModalOpen: false,
    }

    interactionWithOrderModal = () => {
        console.log('da')
        this.setState({isOrderModalOpen: !this.state.isOrderModalOpen})
    }

    interactionWithChangeModal = () => {
        this.setState({
            cpfIsOpen: !this.state.cpfIsOpen,
        })
    }

    saveContactInformation = (info) => {
        this.props.setUserInfo(info)
    }

    render() {
        if (this.props.match.params.number !== this.props.id)
            return <Redirect to={'/'}/>
        else
            return (
                <div className={'user-account'}>
                    <h1 className={'mb-30'}>Личный кабинет</h1>
                    <div className="button-section">
                        <NavLink to={'/'} className="main-item-style mr-15" onClick={this.props.logout}>
                            Выйти
                        </NavLink>
                        <button className="main-item-style" onClick={this.interactionWithChangeModal}>
                            Сменить пароль
                        </button>
                    </div>

                    <PasswordChangeForm errorPassword={this.props.errorPassword}
                                        passwordChange={this.props.passwordChange}
                                        isOpen={this.state.cpfIsOpen}
                                        onClose={this.interactionWithChangeModal}/>

                    <OrderModalForm
                        trySendOrder={false} isAuth={true}
                        isOpen={this.state.isOrderModalOpen}
                        onClose={this.interactionWithOrderModal}
                        isEdit={true}
                    />

                    <hr/>
                    <InputUserInformation
                        saveContactInformation={this.saveContactInformation}
                        userInfo={this.props.userInfo}
                    />
                    <hr/>
                    <RenderOrderList description={'активных заказов'}
                                     orderList={this.props.userInfo.listOfCurrentOrders || []}
                                     type={'active'}
                                     cancelOrder={this.props.cancelOrder}
                                     openForm={this.interactionWithOrderModal}
                    />
                    <hr/>
                    <RenderOrderList description={'завершённых заказов'}
                                     orderList={this.props.userInfo.listOfDeliveredOrders || []}
                                     type={'finish'}
                    />

                </div>
            )
    }
}

function mapStateToProps(state) {
    return {
        id: state.authReducer.id,
        userInfo: state.userInfReducer.info,
        errorPassword: state.userInfReducer.error,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        logout: () => dispatch(logout()),
        setUserInfo: (info) => dispatch(setUserInfo(info)),
        passwordChange: (oldPassword, newPassword) => dispatch(passwordChange(oldPassword, newPassword)),
        cancelOrder: (order) => dispatch(cancelOrder(order)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserAccount)