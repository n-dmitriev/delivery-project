import React, {Component} from 'react'
import './Notification.scss'

class Notification extends Component{
    state = {
        isOpen: true
    }

    onClose = () => {
        this.setState({
            isOpen: false
        })
    }

    render() {
        if(!this.state.isOpen)
            return null
        return (
            <>
                <div className={'notification'}>
                    <h2>{this.props.message}</h2>
                    <hr className={'mb-30 mt-15'}/>
                    <label className={'mb-30'}>{this.props.optionalMessage}</label>
                    <div className={'button-section mt-15 mb-15'}>
                        <button className={'main-item-style'} onClick={this.onClose}>
                            Ок
                        </button>
                    </div>
                </div>
                <div className={'bg'} onClick={this.onClose}/>
            </>
        )
    }
}

export default Notification