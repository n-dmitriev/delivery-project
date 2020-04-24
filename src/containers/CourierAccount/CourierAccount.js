import React, {Component} from 'react'
import './CourierAccount.scss'
import {connect} from 'react-redux'
import AuthShape from '../../components/AuthShape/AuthShape'
import {NavLink, Redirect} from 'react-router-dom'
import PasswordChangeForm from '../../components/PasswordChangeForm/PasswordChangeForm'
import RenderOrderList from '../../components/RenderOrderList/RenderOrderList'
import {authActions, logout} from '../../store/authentication/authActions'
import {fetchOrderList, passwordChange} from '../../store/userInformation/userActions'
import CourierPanel from '../../components/CourierPanel/CourierPanel'
import {
    changeOrderData,
    interactWithPurchased, calculateThePrice, subscribeOrderInfo,
} from '../../store/courier/courierAction'
import  {subscribe} from '../../store/userInformation/userActions'

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
                        fetchOrderList={this.props.fetchOrderList}
                        ordersList={this.props.listOfCurrentOrders}
                        subscribeUsers={this.props.subscribe}
                        subscribeOrderInfo={this.props.subscribeOrderInfo}
                        loading={this.props.listLoading}
                        courierStatus={+ this.props.userInfo.courierStatus}
                        changeOrderData={this.props.changeOrderData}
                        interactWithPurchased={this.props.interactWithPurchased}
                        calculateThePrice={this.props.calculateThePrice}
                    />

                    <div className={'mb-30'}></div>

                    <RenderOrderList description={'завершённых заказов'}
                                     orderList={this.props.listOfDeliveredOrders}
                                     type={'finish'}
                                     soughtId={'courierId'}
                                     statusList={[3, 4]}
                                     fetchOrderList={this.props.fetchOrderList}
                                     subscribe={this.props.subscribe}
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

    authAction = async (login, email) => {
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
                            auth={this.authAction}
                            thisReg={false}
                        />
                        : this.props.isAuth &&  JSON.parse(localStorage.getItem('path')) === "/courier-account/"
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
        loading: state.courier.loading,
        listLoading: state.userInfReducer.loading,
        listOfCurrentOrders: state.userInfReducer.listOfCurrentOrders,
        listOfDeliveredOrders: state.userInfReducer.listOfDeliveredOrders
    }
}

function mapDispatchToProps(dispatch) {
    return {
        logout: () => dispatch(logout()),
        passwordChange: (oldPassword, newPassword) => dispatch(passwordChange(oldPassword, newPassword)),
        auth: (email, password, isLogin, collection) => dispatch(authActions(email, password, isLogin, collection)),
        subscribe: (listening, listType, typeId, soughtId, statusList) => dispatch(subscribe(listening, listType, typeId, soughtId, statusList)),
        subscribeOrderInfo:(listening, id) => dispatch(subscribeOrderInfo(listening, id)),
        changeOrderData: (status, data) => dispatch(changeOrderData(status, data)),
        interactWithPurchased: (id, flag) => dispatch(interactWithPurchased(id, flag)),
        fetchOrderList: (listType, typeId, soughtId, statusList) => dispatch(fetchOrderList(listType, typeId, soughtId, statusList)),
        calculateThePrice: (id, price, position) => dispatch(calculateThePrice(id, price, position))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CourierAccount)