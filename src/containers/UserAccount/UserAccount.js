import React, {Component} from 'react'
import './UserAccount.scss'
import {connect} from 'react-redux'
import InputUserInformation from '../../components/InputUserInformation/InputUserInformation'
import {logout} from '../../store/actions/auth'
import {NavLink} from 'react-router-dom'
import RenderOrderList from '../../components/RenderOrderList/RenderOrderList'
import {setUserInfo} from '../../store/actions/userInformation'

class UserAccount extends Component {
    saveContactInformation = (info) => {
        this.props.setUserInfo(info)
    }

    render() {
        if (this.props.match.params.number !== this.props.id) return null
        return (
            <div className={'user-account'}>
                <h1>Личный кабинет</h1>
                <div className="button-section">
                    <NavLink to={'/'} className="main-item-style" onClick={this.props.logout}>
                        Выйти
                    </NavLink>
                    <button className="main-item-style" onClick={this.props.logout}>
                        Сменить пароль
                    </button>
                </div>
                <hr/>
                <InputUserInformation
                    saveContactInformation={this.saveContactInformation}
                    userInfo={this.props.userInfo}
                />
                <hr/>
                <RenderOrderList description={'активных заказов'}
                                 orderList={this.props.userInfo.listOfCurrentOrders || []}/>
                <hr/>
                <RenderOrderList description={'завершённых заказов'}
                                 orderList={this.props.userInfo.listOfDeliveredOrders || []}/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        id: state.authReducer.id,
        userInfo: state.userInfReducer.info,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        logout: () => dispatch(logout()),
        setUserInfo: (info) => dispatch(setUserInfo(info))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserAccount)