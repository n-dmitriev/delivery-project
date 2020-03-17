import React from 'react'
import './Header.scss'

const Header = props =>{
    return (
        <header className={'header'}>
            <div className={'header__logo'}>
                <span className={'header__title'}>Delivery Project</span>
            </div>
            <div className={'header__btn-section'}>
                <button className={'main-item-style'} onClick={props.openOrderForm}>
                    Сделать заказ
                </button>
                <button className={'main-item-style'} onClick={props.openAuthForm}>
                    Войти или создать аккаунт
                </button>
            </div>
        </header>
    )
}

export default Header