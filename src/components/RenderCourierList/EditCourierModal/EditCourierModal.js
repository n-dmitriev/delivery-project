import React, {Component} from 'react'
import './EditCourierModal.scss'
import InputInformation from '../../InputInformation/InputInformation'

export default class EditCourierModal extends Component {
    saveContactInformation = (info)  => {
        this.props.setCourierInfo(info)
        this.props.onClose()
    }

    render() {
        if (this.props.isOpen === false) return null
        return (
            <>
                <div className={'edit-courier'}>
                    <div className={'add-courier__content'}>
                        <span className="dagger dagger_delete" onClick={this.props.onClose}/>
                        <InputInformation
                            saveContactInformation={this.saveContactInformation}
                            onClose={this.props.onClose}
                            type={'courier'}
                            userInfo={this.props.userInfo}
                        />
                    </div>
                </div>
                <div className={'bg'} onClick={this.props.onClose}/>
            </>
        )
    }
}