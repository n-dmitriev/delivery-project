import React, {Component} from 'react'
import './UserAccount.scss'
import {connect} from 'react-redux'
import InputInformation from '../../components/InputInformation/InputInformation'
import {logout} from '../../store/authentication/authActions'
import {fetchOrderList, passwordChange, setUserInfo} from '../../store/user/userActions'
import {Redirect} from 'react-router-dom'
import PasswordChangeForm from '../../components/PasswordChangeForm/PasswordChangeForm'
import {reOrder} from '../../store/order/orderActions'
import Footer from '../../components/UI/Footer/Footer'
import UserOrdersPanel from '../../components/UserPanelWithOrders/UserOrdersPanel'
import FunctionalButtons from '../../components/FunctionalButtons/FunctionalButtons'
import {confirm} from '../../components/UI/Confirm/Confirm'
import toaster from 'toasted-notes'

class UserAccount extends Component {
    state = {
        cpfIsOpen: false
    }

    componentDidMount() {
        document.title = 'EasyWays | Личный кабинет'
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
        if ((this.props.match.path === '/user-account/:number' && this.props.match.params.number !== this.props.id)
            || this.props.userInfo === undefined)
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
                                        Личный кабинет
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
                                        />
                                        <hr/>
                                    </div>

                                    <h2 className={'mb-30'}>
                                        Заказы
                                    </h2>

                                    <UserOrdersPanel
                                        fetchOrderList={this.props.fetchOrderList}
                                        reOrder={this.props.reOrder}
                                        setEditItem={this.setEditItem}
                                        loading={this.props.loading}
                                        arrOfLists={[
                                            {
                                                orderList: this.props.listOfCurrentOrders,
                                                type: 'active-user',
                                                isEnd: this.props.clEnd
                                            },
                                            {
                                                orderList: this.props.listOfDeliveredOrders,
                                                type: 'finish-user',
                                                isEnd: this.props.dlEnd
                                            }
                                        ]}
                                    />
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
        errorPassword: state.userReducer.error,
        listOfDeliveredOrders: state.userReducer.listOfDeliveredOrders,
        listOfCurrentOrders: state.userReducer.listOfCurrentOrders,
        loading: state.userReducer.loading,
        remove: state.userReducer.remove,
        clEnd: state.userReducer.alEnd,
        dlEnd: state.userReducer.flEnd
    }
}

function mapDispatchToProps(dispatch) {
    return {
        logout: () => dispatch(logout()),
        setUserInfo: (info) => dispatch(setUserInfo(info)),
        passwordChange: (oldPassword, newPassword) => dispatch(passwordChange(oldPassword, newPassword)),
        fetchOrderList: (listType, typeId, soughtId, statusList, status) => dispatch(fetchOrderList(listType, typeId, soughtId, statusList, status)),
        reOrder: (orderInfo) => dispatch(reOrder(orderInfo))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserAccount)