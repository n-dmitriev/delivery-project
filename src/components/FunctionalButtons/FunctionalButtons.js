import React, {Component} from 'react'
import {confirm} from '../UI/Confirm/Confirm'
import toaster from 'toasted-notes'

export default class FunctionalButtons extends Component {
    logout =() => {
        confirm(
            'выйти из учетной записи', async () => {
                this.props.logout()
                toaster.notify('Вы вышли из учетной записи!', {
                    position: 'bottom-right',
                    duration: 3000
                })
            }
        )
    }

    render(){
        return(
            <div className="button-section">
                <button className="main-item-style main-item-style_danger mr-15"
                        onClick={this.logout}>
                    Выйти
                </button>
                <button className="main-item-style"
                        onClick={this.props.interactionWithChangeModal}>
                    Сменить пароль
                </button>
            </div>
        )
    }
}