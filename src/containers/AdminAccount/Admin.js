import React, {Component} from 'react'
import './Admin.scss'
import {connect} from 'react-redux'
import AuthShape from '../../components/AuthShape/AuthShape'
import {
    authAdmin,
    fetchDataBase,
    registrationNewCourier,
    removeCourier,
    setCourierInfo,
} from '../../store/admin/adminActions'
import AddCourier from '../../components/AddCourier/AddCourier'
import {dispatchAction} from '../../store/universalFunctions'
import {REMOVE_ERROR} from '../../store/admin/actionTypes'
import RenderCourierList from '../../components/RenderCourierList/RenderCourierList'
import EditCourierModal from '../../components/RenderCourierList/EditCourierModal/EditCourierModal'
import AdminPanelWithOrders from '../../components/AdminPanelWithOrders/AdminPanelWithOrders'
import {fetchOrderList} from '../../store/user/userActions'
import toaster from 'toasted-notes'

class Admin extends Component {
    state = {
        isAddCourierOpen: false,
        editModalIsOpen: false,
        editingCourier: null,
    }

    componentDidMount() {
        document.title = 'EasyWays | Панель администратора'
    }

    interactionWithEditModal = () => {
        this.setState({
            editModalIsOpen: !this.state.editModalIsOpen,
        })
    }

    interactionWithCourierModal = () => {
        window.scrollTo(0, 0)
        this.setState({isAddCourierOpen: !this.state.isAddCourierOpen})
    }

    editCourier = (courier) => {
        window.scrollTo(0, 0)
        this.setState({
            editingCourier: courier,
        })
        toaster.notify('Данные курьера отредактированы!', {
            position: 'bottom-right',
            duration: 3000,
        })
        this.interactionWithEditModal()
    }

    authAction = async (login, email) => {
        await this.props.authAdmin(login, email)
    }

    fetchDb = async () => {
        await this.props.fetchDataBase('couriers')
    }

    removeCourier = (id) => {
        toaster.notify('Курьер удалён!', {
            position: 'bottom-right',
            duration: 3000,
        })
        this.props.removeCourier(id)
    }

    renderAdminPanel = () => {
        return (
            <div>
                <h2 className={'mb-15'}>Информация о заказах</h2>

                <AdminPanelWithOrders
                    fetchOrderList={this.props.fetchOrderList}
                    orderList={this.props.orderList}
                    isEnd={this.props.isEnd}
                    loading={this.props.loading}
                />

                <hr/>

                <h2 className={'mb-15'}>Информация о курьерах</h2>

                <RenderCourierList
                    fetchDb={this.fetchDb}
                    couriers={this.props.couriers}
                    setCourierInfo={this.props.setCourierInfo}
                    removeCourier={this.removeCourier}
                    editCourier={this.editCourier}
                />

                <div className="button-section mt-30">
                    <button
                        className="main-item-style"
                        onClick={this.interactionWithCourierModal}
                    >
                        Добавить курьера
                    </button>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className={'admin'}>
                <AddCourier
                    add={this.props.registrNewCourier}
                    removeError={this.props.removeError}
                    isOpen={this.state.isAddCourierOpen}
                    ocClose={this.interactionWithCourierModal}
                    setCourierInfo={this.props.setCourierInfo}
                />

                <EditCourierModal
                    isOpen={this.state.editModalIsOpen}
                    onClose={this.interactionWithEditModal}
                    setCourierInfo={this.props.setCourierInfo}
                    userInfo={this.state.editingCourier}
                />
                <div className={'container'}>
                    <div className="row">
                        <div className="col-lg-2 col-md-2 col-sm-0"> </div>
                        <div className="col-lg-8 col-md-8 col-sm-12">
                            <div className="app__main-content">
                                <h1>Панель админа</h1>
                                <hr/>
                                {
                                    this.props.adminId === null
                                        ?
                                        <AuthShape
                                            isError={this.props.error}
                                            auth={this.authAction}
                                            thisReg={false}
                                        />
                                        : <>
                                            {
                                                this.renderAdminPanel()
                                            }
                                        </>
                                }
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-2 col-sm-0"> </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        adminId: state.adminReducer.adminId,
        error: state.adminReducer.error,
        users: state.adminReducer.users,
        couriers: state.adminReducer.couriers,
        orderList: state.adminReducer.orderList,
        isEnd: state.adminReducer.sampleListIsEnd,
        loading: state.adminReducer.loading,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        authAdmin: (login, email) => dispatch(authAdmin(login, email)),
        fetchDataBase: (collection) => dispatch(fetchDataBase(collection)),
        removeError: () => dispatch(dispatchAction(REMOVE_ERROR, null)),
        registrNewCourier: (email, password) => dispatch(registrationNewCourier(email, password)),
        setCourierInfo: (info) => dispatch(setCourierInfo(info)),
        removeCourier: (id) => dispatch(removeCourier(id)),
        fetchOrderList: (listType, typeId, soughtId, statusList, status) => dispatch(fetchOrderList(listType, typeId, soughtId, statusList, status)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin)