import React, {Component} from 'react'
import './Admin.scss'
import {connect} from 'react-redux'
import AuthShape from '../../components/AuthShape/AuthShape'
import {authAdmin, fetchDataBase, registrNewCourier, removeCourier, setCourierInfo} from '../../store/actions/admin'
import AddCourier from '../../components/AddCourier/AddCourier'
import {dispatchAction} from '../../store/actions/universalFunctions'
import {REMOVE_ERROR} from '../../store/actions/actionTypes'
import RenderCourierList from '../../components/RenderCourierList/RenderCourierList'

class Admin extends Component {
    state = {
        isAddCourierOpen: false,
    }

    interactionWithCourierModal = () => {
        window.scrollTo(0, 0)
        this.setState({isAddCourierOpen: !this.state.isAddCourierOpen})
    }

    auth = async (login, email) => {
        await this.props.authAdmin(login, email)
    }

    fetchDb = async () => {
        await this.props.fetchDataBase('personnel')
    }

    removeCourier = (id) => {
        this.props.removeCourier(id)
    }

    renderAdminPanel = () => {
        return (
            <div>
                <h2 className={'mb-15'}>Информация о курьерах</h2>

                <AddCourier
                    add={this.props.registrNewCourier}
                    removeError={this.props.removeError}
                    isOpen={this.state.isAddCourierOpen}
                    ocClose={this.interactionWithCourierModal}
                    setCourierInfo={this.props.setCourierInfo}
                />

                <RenderCourierList
                    fetchDb={this.fetchDb}
                    couriers={this.props.couriers}
                    setCourierInfo={this.props.setCourierInfo}
                    removeCourier={this.removeCourier}
                />

                <div className="button-section mt-30">
                    <button
                        className="main-item-style"
                        onClick={this.interactionWithCourierModal}
                    >
                        Добавить курьера
                    </button>
                </div>


                <hr/>

                <h2>Информация о активных заказах</h2>
                <p>...</p>
                <hr/>

                <h2>Информация о пользователях</h2>
                <p>...</p>
            </div>
        )
    }

    render() {
        return (
            <div className={'admin'}>
                <h1>Панель админа</h1>
                <hr/>
                {
                    this.props.adminId === null
                        ?
                        <AuthShape
                            isError={this.props.error}
                            auth={this.auth}
                            thisReg={false}
                        />
                        : <>
                            {
                                this.renderAdminPanel()
                            }
                        </>
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        adminId: state.authAdmin.adminId,
        error: state.authAdmin.error,
        users: state.authAdmin.users,
        couriers: state.authAdmin.couriers,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        authAdmin: (login, email) => dispatch(authAdmin(login, email)),
        fetchDataBase: (collection) => dispatch(fetchDataBase(collection)),
        removeError: () => dispatch(dispatchAction(REMOVE_ERROR, null)),
        registrNewCourier: (email, password) => dispatch(registrNewCourier(email, password)),
        setCourierInfo: (info) => dispatch(setCourierInfo(info)),
        removeCourier: (id) => dispatch(removeCourier(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin)