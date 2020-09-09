import React, {Component} from 'react'
import './UserAccount.scss'
import {connect} from 'react-redux'
import {fetchOrderList} from '../../store/user/userActions'
import {Redirect} from 'react-router-dom'
import {reOrder} from '../../store/order/orderActions'
import Footer from '../../components/UI/Footer/Footer'
import UserOrdersPanel from '../../components/UserPanelWithOrders/UserOrdersPanel'

class UserOrders extends Component {
    constructor() {
        super()
        document.title = 'EasyWays | Заказы'
    }


    render() {
        if ((this.props.match.path === '/user-account/:number/user-orders' && this.props.match.params.number !== this.props.id)
            || Object.keys(this.props.userInfo).length === 0)
            return <Redirect to={'/'}/>
        else
            return (
                <div className={'user-account'}>
                    <div className={'container'}>
                        <div className="row">
                            <div className="col-lg-2 col-md-1 col-sm-0"/>
                            <div className="col-lg-8 col-md-10 col-sm-12">
                                <div className="app__main-content app__main-content_no-padding">
                                    <h1 className={'mb-15 text-center'}>
                                        Заказы
                                    </h1>

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
        fetchOrderList: (listType, typeId, soughtId, statusList, status) => dispatch(fetchOrderList(listType, typeId, soughtId, statusList, status)),
        reOrder: (orderInfo) => dispatch(reOrder(orderInfo))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserOrders)