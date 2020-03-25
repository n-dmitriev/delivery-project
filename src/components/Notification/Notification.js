import React from 'react'
import './Notification.scss'

const Notification = props =>{
    return (
        <div className={''}>
                <h2>Вы успешно {this.state.currentWin === 'successAuth' ? 'авторизовались' : 'зарегестрированы'}!</h2>
                <label>{this.props.trySendOrderNotAuth ? 'Ваш заказ успешно оформлен!' : null}</label>
                <div className={'button-section'}>
                    <button className={'main-item-style'} onClick={() => {

                    }}>Ок
                    </button>
                </div>
        </div>
    )
}

export default Notification