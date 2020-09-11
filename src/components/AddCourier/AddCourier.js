import React, {Component} from 'react'
import './AddCourier.scss'
import AuthShape from '../AuthShape/AuthShape'
import InputInformation from '../InputInformation/InputInformation'
import toaster from 'toasted-notes'
import ModalWindow from '../UI/ModalWindow/ModalWindow'

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

    authHandler = (email, password) => {
        this.props.add(email, password)
        this.switchCurrentWin('input')
        toaster.notify('Курьер зарегистрирован!', {
            position: 'bottom-right',
            duration: 3000,
        })
    }

    renderRegistForm = () => {
        return <AuthShape
            currentWin={'signUp'}
            isError={this.props.error}
            authHandler={this.authHandler}
            description={'курьера'}
        />
    }
    
    saveContactInformation = (info)  => {
        this.props.setCourierInfo(info)
        this.close()
        toaster.notify('Данные курьера сохранены!', {
            position: 'bottom-right',
            duration: 3000,
        })
    }

    renderCourierInfoForm = () => {
        return <InputInformation
            courierId={this.props.courierId}
            saveContactInformation={this.saveContactInformation}
            onClose={this.close}
            type={'courier'}
        />
    }

    renderContent = () => {
        return (
            <div className={'add-courier'}>
                <div className={'add-courier__content'}>
                    {
                        this.state.currentWin === 'signUp'
                            ? this.renderRegistForm()
                            : this.renderCourierInfoForm()
                    }
                </div>
            </div>
        )
    }

    render() {
        return (
           <ModalWindow
               isOpen={this.props.isOpen}
               onClose={this.close}
               renderBody={this.renderContent}
           />
        )
    }
}