import React, {Component} from 'react'
import './UserAccount.scss'
import {connect} from 'react-redux'
import InputInformation from '../../components/InputInformation/InputInformation'
import {logout} from '../../store/authentication/authActions'
import {NavLink, Redirect} from 'react-router-dom'
import RenderOrderList from '../../components/RenderOrderList/RenderOrderList'
import {fetchOrderList, passwordChange, setUserInfo, subscribe} from '../../store/userInformation/userActions'
import PasswordChangeForm from '../../components/PasswordChangeForm/PasswordChangeForm'
import {cancelOrder, orderАgain} from '../../store/currentOrder/orderActions'
import OrderModalForm from '../OrderModalForm/OrderModalForm'

class UserAccount extends Component {
    state = {
        cpfIsOpen: false,
        isOrderModalOpen: false,
        editItem: null,
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


                    <div className="user-account__input">
                        <InputInformation
                            saveContactInformation={this.saveContactInformation}
                            userInfo={this.props.userInfo}
                        />
                        <hr/>

                        <div className="button-section">
                            <NavLink to={'/'} className="main-item-style main-item-style_danger mr-15"
                                     onClick={this.props.logout}>
                                Выйти
                            </NavLink>
                            <button className="main-item-style" onClick={this.interactionWithChangeModal}>
                                Сменить пароль
                            </button>
                        </div>

                    </div>

                    <h2>
                        Заказы
                    </h2>
                    <hr/>
                    <RenderOrderList
                        fetchOrderList={this.props.fetchOrderList}
                        orderList={this.props.listOfCurrentOrders}
                        cancelOrder={this.props.cancelOrder}
                        setEditItem={this.setEditItem}
                        type={'active'}
                        description={'активных заказов'}
                        loading={this.props.loading}
                        soughtId={'userId'}
                        statusList={[-1, 0, 1, 2]}
                        subscribe={this.props.subscribe}
                    />
                    <br/>
                    <RenderOrderList
                        fetchOrderList={this.props.fetchOrderList}
                        orderList={this.props.listOfDeliveredOrders}
                        type={'finish'}
                        description={'завершённых заказов'}
                        loading={this.props.loading}
                        soughtId={'userId'}
                        statusList={[3, 4]}
                        subscribe={this.props.subscribe}
                        orderАgain={this.props.orderАgain}
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
        listOfDeliveredOrders: state.userInfReducer.listOfDeliveredOrders,
        listOfCurrentOrders: state.userInfReducer.listOfCurrentOrders,
        loading: state.userInfReducer.loading,
        remove: state.userInfReducer.remove,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        logout: () => dispatch(logout()),
        setUserInfo: (info) => dispatch(setUserInfo(info)),
        passwordChange: (oldPassword, newPassword) => dispatch(passwordChange(oldPassword, newPassword)),
        cancelOrder: (id) => dispatch(cancelOrder(id)),
        subscribe: (listening, listType, typeId, soughtId, statusList) => dispatch(subscribe(listening, listType, typeId, soughtId, statusList)),
        fetchOrderList: (listType, typeId, soughtId, statusList) => dispatch(fetchOrderList(listType, typeId, soughtId, statusList)),
        orderАgain: (orderInfo) => dispatch(orderАgain(orderInfo))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserAccount)