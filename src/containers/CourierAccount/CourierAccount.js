import React, {Component} from 'react'
import './CourierAccount.scss'
import {connect} from 'react-redux'
import AuthShape from '../../components/AuthShape/AuthShape'
import {NavLink, Redirect} from 'react-router-dom'
import PasswordChangeForm from '../../components/PasswordChangeForm/PasswordChangeForm'
import RenderOrderList from '../../components/RenderOrderList/RenderOrderList'
import {auth, logout} from '../../store/actions/auth'
import {passwordChange} from '../../store/actions/userInformation'
import CourierPanel from '../../components/CourierPanel/CourierPanel'
import {
    changeOrderData,
    fetchActiveOrders,
    subscribeUsers,
} from '../../store/actions/courier'

class CourierAccount extends Component {
    state = {
        cpfIsOpen: false,
    }


    interactionWithChangeModal = () => {
        this.setState({
            cpfIsOpen: !this.state.cpfIsOpen,
        })
    }


    renderCourierPanel = () => {
        if (this.props.match.params.number !== this.props.id || this.props.userInfo === undefined)
            return null
        else
            return (
                <div className={'courier'}>
                    <h1 className={'mb-30'}>Личный кабинет курьера</h1>

                    <PasswordChangeForm errorPassword={this.props.errorPassword}
                                        passwordChange={this.props.passwordChange}
                                        isOpen={this.state.cpfIsOpen}
                                        onClose={this.interactionWithChangeModal}/>


                    <CourierPanel
                        fetchActiveOrders={this.props.fetchActiveOrders}
                        ordersList={this.props.ordersList}
                        subscribeUsers={this.props.subscribeUsers}
                        loading={this.props.loading}
                        deliveredOrder={this.props.deliveredOrder}
                        changeOrderData={this.props.changeOrderData}
                    />

                    <br/>
                    <RenderOrderList description={'завершённых заказов'}
                                     orderList={this.props.userInfo.listOfDeliveredOrders || []}
                                     type={'finish'}
                    />

                    <div className="button-section mt-30">
                        <NavLink to={'/'} className="main-item-style main-item-style_danger mr-15"
                                 onClick={this.props.logout}>
                            Выйти
                        </NavLink>
                        <button className="main-item-style" onClick={this.interactionWithChangeModal}>
                            Сменить пароль
                        </button>
                    </div>
                </div>
            )
    }

    auth = async (login, email) => {
        await this.props.auth(login, email, true, 'couriers')
    }

    render() {
        return (
            <div className={'courier'}>
                {
                    this.props.match.params.number === 'auth' && !this.props.isAuth
                        ?
                        <AuthShape
                            isError={this.props.error}
                            auth={this.auth}
                            thisReg={false}
                        />
                        : this.props.isAuth
                        ?
                        <>
                            <Redirect to={`/courier-account/${this.props.id}`}/>
                            {
                                this.renderCourierPanel()
                            }
                        </>
                        :
                        <Redirect to={'/'}/>
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        id: state.authReducer.id,
        isAuth: state.authReducer.isAuth,
        error: state.authReducer.isError,
        userInfo: state.userInfReducer.info,
        errorPassword: state.userInfReducer.error,
        ordersList: state.courier.ordersList,
        deliveredOrder: state.courier.deliveredOrder,
        loading: state.courier.loading,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        logout: () => dispatch(logout()),
        passwordChange: (oldPassword, newPassword) => dispatch(passwordChange(oldPassword, newPassword)),
        auth: (email, password, isLogin, collection) => dispatch(auth(email, password, isLogin, collection)),
        fetchActiveOrders: () => dispatch(fetchActiveOrders()),
        subscribeUsers: (listening) => dispatch(subscribeUsers(listening)),
        changeOrderData: (status, data) => dispatch(changeOrderData(status, data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CourierAccount)