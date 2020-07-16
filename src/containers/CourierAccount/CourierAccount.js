import React, {Component} from 'react'
import './CourierAccount.scss'
import {connect} from 'react-redux'
import AuthShape from '../../components/AuthShape/AuthShape'
import {Redirect} from 'react-router-dom'
import PasswordChangeForm from '../../components/PasswordChangeForm/PasswordChangeForm'
import RenderOrderList from '../../components/RenderOrderList/RenderOrderList'
import {authActions, logout} from '../../store/authentication/authActions'
import {fetchOrderList, passwordChange} from '../../store/user/userActions'
import CourierPanel from '../../components/CourierPanelWithOrders/CourierPanel'
import {
    changeOrderData,
    interactWithPurchased, calculateThePrice, subscribeOrderInfo, updateCourierStatus,
} from '../../store/courier/courierAction'
import {subscribe} from '../../store/user/userActions'
import FunctionalButtons from '../../components/FunctionalButtons/FunctionalButtons'

class CourierAccount extends Component {
    state = {
        cpfIsOpen: false,
    }

    interactionWithChangeModal = () => {
        this.setState({
            cpfIsOpen: !this.state.cpfIsOpen,
        })
    }

    authAction = async (login, email) => {
        await this.props.auth(login, email, true, 'couriers')
    }

    logout = async () => {
        await this.props.updateCourierStatus(-1)
        await this.props.logout()
    }

    renderCourierPanel = () => {
        if (this.props.match.params.number !== this.props.id || this.props.userInfo === undefined)
            return null
        else
            return (
                <>
                    <h1 className={'mb-30'}>Личный кабинет курьера</h1>

                    <FunctionalButtons
                        logout={this.props.logout}
                        interactionWithChangeModal={this.interactionWithChangeModal}
                    />
                    <hr/>

                    <CourierPanel
                        fetchOrderList={this.props.fetchOrderList}
                        ordersList={this.props.listOfCurrentOrders}
                        subscribeUsers={this.props.subscribe}
                        subscribeOrderInfo={this.props.subscribeOrderInfo}
                        loading={this.props.listLoading}
                        courierStatus={+this.props.userInfo.courierStatus}
                        changeOrderData={this.props.changeOrderData}
                        interactWithPurchased={this.props.interactWithPurchased}
                        calculateThePrice={this.props.calculateThePrice}
                    />

                    <div className={'mb-30'}> </div>

                    <RenderOrderList description={'завершённых заказов'}
                                     orderList={this.props.listOfDeliveredOrders}
                                     type={'finish-courier'}
                                     soughtId={'courierId'}
                                     statusList={[3, 4]}
                                     fetchOrderList={this.props.fetchOrderList}
                                     subscribe={this.props.subscribe}
                    />
                </>
            )
    }

    render() {
        return (
            <div className={'courier'}>
                <PasswordChangeForm errorPassword={this.props.errorPassword}
                                    passwordChange={this.props.passwordChange}
                                    isOpen={this.state.cpfIsOpen}
                                    onClose={this.interactionWithChangeModal}/>

                <div className={'container'}>
                    <div className="row">
                        <div className="col-lg-2 col-md-1 col-sm-0"> </div>
                        <div className="col-lg-8 col-md-10 col-sm-12">
                            <div className="app__main-content">
                                {
                                    this.props.match.params.number === 'auth' && !this.props.isAuth
                                        ?
                                        <AuthShape
                                            isError={this.props.error}
                                            auth={this.authAction}
                                            thisReg={false}
                                        />
                                        : this.props.isAuth && JSON.parse(localStorage.getItem('path')) === '/courier-account/'
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
                        </div>
                        <div className="col-lg-2 col-md-1 col-sm-0"> </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        id: state.authReducer.id,
        isAuth: state.authReducer.isAuth,
        error: state.authReducer.isError,
        userInfo: state.userReducer.info,
        errorPassword: state.userReducer.error,
        loading: state.courierReducer.loading,
        listLoading: state.userReducer.loading,
        listOfCurrentOrders: state.userReducer.listOfCurrentOrders,
        listOfDeliveredOrders: state.userReducer.listOfDeliveredOrders,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        logout: () => dispatch(logout()),
        passwordChange: (oldPassword, newPassword) => dispatch(passwordChange(oldPassword, newPassword)),
        auth: (email, password, isLogin, collection) => dispatch(authActions(email, password, isLogin, collection)),
        subscribe: (listening, listType, typeId, soughtId, statusList, coordinates) => dispatch(subscribe(listening, listType, typeId, soughtId, statusList, coordinates)),
        subscribeOrderInfo: (listening, id) => dispatch(subscribeOrderInfo(listening, id)),
        changeOrderData: (status, data) => dispatch(changeOrderData(status, data)),
        interactWithPurchased: (id, flag) => dispatch(interactWithPurchased(id, flag)),
        fetchOrderList: (listType, typeId, soughtId, statusList, status) => dispatch(fetchOrderList(listType, typeId, soughtId, statusList, status)),
        calculateThePrice: (id, price, distance) => dispatch(calculateThePrice(id, price, distance)),
        updateCourierStatus: (status) => dispatch(updateCourierStatus(status))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CourierAccount)