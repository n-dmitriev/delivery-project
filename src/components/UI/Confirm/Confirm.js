import {confirmAlert} from "react-confirm-alert"
import React from 'react'
import './Confirm.scss'

export function confirm(message, yesFunc) {
    confirmAlert(
        {
            customUI: ({onClose}) => {
                return (
                    <div className={'confirm'}>
                        <h3 className={'mb-4'}>Вы уверены, что хотите {message}?</h3>
                        <div className="button-section">
                            <button className = {'btn btn-dark mr-2'}
                                    onClick={async () => {
                                        if (typeof yesFunc === 'function')
                                            yesFunc()
                                        onClose()
                                    }}
                            >
                                Да
                            </button>
                            <button className={'btn btn-dark'} onClick={onClose}>Нет</button>
                        </div>
                    </div>
                )
            }
        })
}