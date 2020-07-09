import React, {Component} from 'react'
import './EditCourierModal.scss'
import InputInformation from '../../InputInformation/InputInformation'
import ModalWindow from '../../UI/ModalWindow/ModalWindow'

export default class EditCourierModal extends Component {
    saveContactInformation = (info)  => {
        this.props.setCourierInfo(info)
        this.props.onClose()
    }

    renderContent =() => {
        return (
            <div className={'edit-courier'}>
                <div className={'add-courier__content'}>
                    <InputInformation
                        saveContactInformation={this.saveContactInformation}
                        onClose={this.props.onClose}
                        type={'courier'}
                        userInfo={this.props.userInfo}
                    />
                </div>
            </div>
        )
    }

    render() {
        return (
            <ModalWindow
                isOpen={this.props.isOpen}
                onClose={this.props.onClose}
                renderBody={this.renderContent}
            />
        )
    }
}