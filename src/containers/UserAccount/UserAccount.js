import React, {Component} from 'react'
import './UserAccount.scss'
import {connect} from 'react-redux'
import InputInformation from '../../components/InputInformation/InputInformation'
import {logout} from '../../store/actions/auth'
import {NavLink, Redirect} from 'react-router-dom'
import RenderOrderList from '../../components/RenderOrderList/RenderOrderList'
import {passwordChange, setUserInfo, subscribe} from '../../store/actions/userInformation'
import PasswordChangeForm from '../../components/PasswordChangeForm/PasswordChangeForm'
import {cancelOrder} from '../../store/actions/currentOrder'
import OrderModalForm from '../OrderModalForm/OrderModalForm'

class UserAccount extends Component {
    state = {
        cpfIsOpen: false,
        isOrderModalOpen: false,
        editItem: null
    }

    componentDidMount() {
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
            editItem: item
        })
        this.interactionWithOrderModal()
    }

    render() {
        if ((this.props.match.path === '/user-account/:number' && this.props.match.params.number !== this.props.id) || this.props.userInfo === undefined)
            return <Redirect to={'/'}/>
        else
            return (
                <div className={'user-account'}>
                    <h1 className={'mb-30'}>Личный кабинет</h1>

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
                    />

                    <div className="row">
                        <div className="col-lg-6 col-sm-12 col-xs-12">
                           <div className="user-account__input">
                               <InputInformation
                                   saveContactInformation={this.saveContactInformation}
                                   userInfo={this.props.userInfo}
                               />
                               <hr/>

                               <div className="button-section">
                                   <NavLink to={'/'} className="main-item-style main-item-style_danger mr-15" onClick={this.props.logout}>
                                       Выйти
                                   </NavLink>
                                   <button className="main-item-style" onClick={this.interactionWithChangeModal}>
                                       Сменить пароль
                                   </button>
                               </div>
                           </div>
                        </div>
                        <div className="col-lg-6 col-sm-12 col-xs-12">
                            <h2>
                                Заказы
                            </h2>
                            <hr/>
                            <RenderOrderList description={'активных заказов'}
                                             orderList={this.props.userInfo.listOfCurrentOrders || []}
                                             type={'active'}
                                             cancelOrder={this.props.cancelOrder}
                                             setEditItem={this.setEditItem}
                            />
                           <br/>
                            <RenderOrderList description={'завершённых заказов'}
                                             orderList={this.props.userInfo.listOfDeliveredOrders || []}
                                             type={'finish'}
                            />
                        </div>
                    </div>
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
        subscribe: (listening) => dispatch(subscribe(listening))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserAccount)