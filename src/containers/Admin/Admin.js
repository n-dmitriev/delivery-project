import React, {Component} from 'react'
import './Admin.scss'
import {connect} from 'react-redux'
import AuthShape from '../../components/AuthShape/AuthShape'
import {authAdmin, fetchDataBase} from '../../store/actions/admin'

class Admin extends Component {
    state = {
        database: {},
    }

    async componentDidMount() {
        if(this.props.adminId !== null)
            await this.props.fetchDataBase()
    }

    auth = async (login, email) => {
        await this.props.authAdmin(login, email)
        await this.props.fetchDataBase()
    }

    renderAdminPanel = () => {
        return (
            <div>
                <h2>Панель админа</h2>
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
    }
}

function mapDispatchToProps(dispatch) {
    return {
        authAdmin: (login, email) => dispatch(authAdmin(login, email)),
        fetchDataBase: () => dispatch(fetchDataBase()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin)