import React, {Component} from 'react'
import './UserAccount.scss'
import {connect} from 'react-redux'
import InputInformation from '../../components/InputInformation/InputInformation'
import {logout} from '../../store/authentication/authActions'
import {NavLink, Redirect} from 'react-router-dom'
import {fetchOrderList, passwordChange, setUserInfo, subscribe} from '../../store/user/userActions'
import PasswordChangeForm from '../../components/PasswordChangeForm/PasswordChangeForm'
import {cancelOrder, reOrder} from '../../store/order/orderActions'
import OrderModalForm from '../OrderModalForm/OrderModalForm'
import Footer from '../../components/UI/Footer/Footer'
import UserOrdersPanel from '../../components/UserOrdersPanel/UserOrdersPanel'

class UserAccount extends Component {
    state = {
        isOrderModalOpen: false,
        editItem: null,
        cpfIsOpen: false,
    }

    interactionWithOrderModal = () => {
        window.scrollTo(0, 0)
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

    setEditItem = (item) => {
        this.setState({
            editItem: item,
        })
        this.interactionWithOrderModal()
    }

    render() {
        if ((this.props.match.path === '/user-account/:number' && this.props.match.params.number !== this.props.id) || this.props.userInfo === undefined)
            return <Redirect to={'/'}/>
        else
            return (
                <div className={'user-account'}>

                    <PasswordChangeForm errorPassword={this.props.errorPassword}
                                        passwordChange={this.props.passwordChange}
                                        isOpen={this.state.cpfIsOpen}
                                        onClose={this.interactionWithChangeModal}/>

                    <OrderModalForm
                        trySendOrder={false} isAuth={true}
                        isOpen={this.state.isOrderModalOpen}
                        onClose={this.interactionWithOrderModal}
                        isEdit={true}
                        editItem={this.state.editItem}
                        remove={this.props.remove}
                    />


                    <div className={'container'}>
                        <div className="row">
                            <div className="col-lg-1 col-md-1 col-sm-0"> </div>
                            <div className="col-lg-10 col-md-10 col-sm-12">
                                <div className="app__main-content">
                                    <div className="user-account__input">
                                        <h1 className={'mb-30'}>
                                            Личный кабинет
                                        </h1>
                                        <div className="button-section">
                                            <NavLink to={'/'} className="main-item-style main-item-style_danger mr-15"
                                                     onClick={this.props.logout}>
                                                Выйти
                                            </NavLink>
                                            <button className="main-item-style"
                                                    onClick={this.interactionWithChangeModal}>
                                                Сменить пароль
                                            </button>
                                        </div>

                                        <hr/>

                                        <InputInformation
                                            saveContactInformation={this.saveContactInformation}
                                            userInfo={this.props.userInfo}
                                            type={'user'}
                                        />
                                        <hr/>
                                    </div>

                                    <h2 className={'mb-30'}>
                                        Заказы
                                    </h2>

                                    <UserOrdersPanel
                                        fetchOrderList={this.props.fetchOrderList}
                                        editItem={this.props.editItem}
                                        subscribe={this.props.subscribe}
                                        cancelOrder={this.props.cancelOrder}
                                        reOrder={this.props.reOrder}
                                        setEditItem={this.setEditItem}
                                        loading={this.props.loading}
                                        arrOfLists={[
                                            {
                                                orderList: this.props.listOfCurrentOrders,
                                                type: 'active-user',
                                                soughtId: 'userId',
                                            },
                                            {
                                                orderList: this.props.listOfDeliveredOrders,
                                                type: 'finish-user',
                                                soughtId: 'userId',
                                            },
                                        ]}
                                    />
                                </div>
                                <Footer/>
                            </div>
                            <div className="col-lg-1 col-md-1 col-sm-0"> </div>
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
        errorPassword: state.userReducer.error,
        listOfDeliveredOrders: state.userReducer.listOfDeliveredOrders,
        listOfCurrentOrders: state.userReducer.listOfCurrentOrders,
        loading: state.userReducer.loading,
        remove: state.userReducer.remove,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        logout: () => dispatch(logout()),
        setUserInfo: (info) => dispatch(setUserInfo(info)),
        passwordChange: (oldPassword, newPassword) => dispatch(passwordChange(oldPassword, newPassword)),
        cancelOrder: (id) => dispatch(cancelOrder(id)),
        subscribe: (listening, listType, typeId, soughtId, statusList, coordinates) => dispatch(subscribe(listening, listType, typeId, soughtId, statusList, coordinates)),
        fetchOrderList: (listType, typeId, soughtId, statusList) => dispatch(fetchOrderList(listType, typeId, soughtId, statusList)),
        reOrder: (orderInfo) => dispatch(reOrder(orderInfo)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserAccount)