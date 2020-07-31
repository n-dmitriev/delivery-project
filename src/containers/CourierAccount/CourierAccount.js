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
    interactWithPurchased, calculateThePrice, subscribeOrderInfo, updateCourierStatus, subscribe
} from '../../store/courier/courierAction'
import FunctionalButtons from '../../components/FunctionalButtons/FunctionalButtons'

class CourierAccount extends Component {
    constructor() {
        super()

        document.title = 'EasyWays | Личный кабнет курьера'
    }

    state = {
        cpfIsOpen: false
    }

    interactionWithChangeModal = () => {
        this.setState({
            cpfIsOpen: !this.state.cpfIsOpen
        })
    }

    authAction = async (login, email) => {
        await this.props.auth(login, email, true, 'couriers')
    }

    logout = async () => {
        await this.props.updateCourierStatus(-1)
        await this.props.logout()
    }


    increaseNumberElementsD = async () => {
        if (!this.props.dlEnd && !this.props.loading) {
            const list = this.props.listOfDeliveredOrders
            await this.props.fetchOrderList('finish', 'courierId', null, [3, 4],
                list.length !== 0 ? list[list.length - 1].id : 0)
        }
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
                        courierStatus={+this.props.userInfo.courierStatus}
                        changeOrderData={this.props.changeOrderData}
                        interactWithPurchased={this.props.interactWithPurchased}
                        calculateThePrice={this.props.calculateThePrice}
                        loading={this.props.loading}
                        clEnd={this.props.clEnd}
                    />

                    <br className={'mb-30'}/>

                    <RenderOrderList description={'завершённых заказов'}
                                     orderList={this.props.listOfDeliveredOrders}
                                     type={'finish-courier'}
                                     soughtId={'courierId'}
                                     statusList={[3, 4]}
                                     fetchOrderList={this.props.fetchOrderList}
                                     loading={this.props.loading}
                                     increaseNumberElements={this.increaseNumberElementsD}
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
                        <div className="col-lg-2 col-md-1 col-sm-0"/>
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
        isAuth: state.authReducer.isAuth,
        error: state.authReducer.isError,
        userInfo: state.userReducer.info,
        errorPassword: state.userReducer.error,
        loading: state.userReducer.loading,
        listOfCurrentOrders: state.userReducer.listOfCurrentOrders,
        listOfDeliveredOrders: state.userReducer.listOfDeliveredOrders,
        clEnd: state.userReducer.alEnd,
        dlEnd: state.userReducer.flEnd
    }
}

function mapDispatchToProps(dispatch) {
    return {
        logout: () => dispatch(logout()),
        passwordChange: (oldPassword, newPassword) => dispatch(passwordChange(oldPassword, newPassword)),
        auth: (email, password, isLogin, collection) => dispatch(authActions(email, password, isLogin, collection)),
        subscribe: (listening, coordinates, skip) => dispatch(subscribe(listening, coordinates, skip)),
        subscribeOrderInfo: (listening, id) => dispatch(subscribeOrderInfo(listening, id)),
        changeOrderData: (status, data) => dispatch(changeOrderData(status, data)),
        interactWithPurchased: (id, flag) => dispatch(interactWithPurchased(id, flag)),
        fetchOrderList: (listType, typeId, soughtId, statusList, status) => dispatch(fetchOrderList(listType, typeId, soughtId, statusList, status)),
        calculateThePrice: (id, price, distance) => dispatch(calculateThePrice(id, price, distance)),
        updateCourierStatus: (status) => dispatch(updateCourierStatus(status))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CourierAccount)