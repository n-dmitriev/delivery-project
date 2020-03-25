import React, {Component} from 'react'
import './Header.scss'
import {NavLink} from 'react-router-dom'

class Header extends Component {
    render() {
        return (
            <header className={'header'}>
                <NavLink to={'/'}>
                    <span className={'header__title'}>Delivery Project</span>
                </NavLink>
                <div className={'header__btn-section'}>
                    <button className={'main-item-style'} onClick={this.props.openOrderForm}>
                        Сделать заказ
                    </button>
                    {
                        this.props.isAuth === true
                            ? <NavLink className={'header__user'} to={`/user-account/${this.props.id}`}>
                                <i className="fa fa-user-circle-o" aria-hidden="true"></i>
                                <span className={'name'}>{this.props.name}</span>
                            </NavLink>
                            : <button className={'main-item-style'} onClick={() => {
                                this.props.openAuthForm()
                            }}>
                                Войти или создать аккаунт
                            </button>
                    }
                </div>
            </header>
        )
    }
}

export default Header