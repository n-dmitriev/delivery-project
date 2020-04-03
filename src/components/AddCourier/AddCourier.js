import React, {Component} from 'react'
import './AddCourier.scss'
import AuthShape from '../AuthShape/AuthShape'
import InputUserInformation from '../InputUserInformation/InputUserInformation'

export default class AddCourier extends Component {
    state = {
        currentWin: 'signUp',
    }

    switchCurrentWin = (winName) => {
        this.setState({
            currentWin: winName,
        })
        this.props.removeError()
    }

    close = () => {
        this.switchCurrentWin('signUp')
        this.props.ocClose()
    }

    registrHandler = (email, password) => {
        this.props.add(email, password)
        this.switchCurrentWin('input')
    }

    renderRegistForm = () => {
        return <AuthShape
            isError={this.props.error}
            auth={this.registrHandler}
            thisReg={true}
            description={'курьера'}
        />
    }


    saveContactInformation = (info)  => {
        this.props.setCourierInfo(info)
        this.close()
    }

    renderCourierInfoForm = () => {
        return <InputUserInformation
            saveContactInformation={this.saveContactInformation}
            onClose={this.close}
            type={'courier'}
        />
    }

    render() {
        if (this.props.isOpen === false) return null
        return (
            <>
                <div className={'add-courier'}>
                    <div className={'add-courier__content'}>
                        <span className="dagger dagger_delete" onClick={this.close}></span>
                        {
                            this.state.currentWin === 'signUp'
                                ? this.renderRegistForm()
                                : this.renderCourierInfoForm()
                        }
                    </div>
                </div>
                <div className={'bg'} onClick={this.close}/>
            </>
        )
    }
}