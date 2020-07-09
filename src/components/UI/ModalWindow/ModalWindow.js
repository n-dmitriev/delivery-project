import React, {Component} from 'react'
import './ModalWindow.scss'

export default class ModalWindow extends Component {
    render(){
        return(
            <div className={'modal-window'}>
                <div onClick={this.props.onClose} className={`modal-background ${this.props.isOpen ? 'is-open' : null}`}/>
                <div className={`modal-content ${this.props.isOpen ? 'is-open' : null}`}>
                    <span onClick={this.props.onClose} className="modal-close">&#10005;</span>
                    {
                        this.props.renderBody()
                    }
                </div>
            </div>
        )
    }
}