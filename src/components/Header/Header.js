import React, {Component} from 'react'
import './Header.scss'
import {NavLink} from 'react-router-dom'
import logo from '../../img/logo.png'

class Header extends Component {
    render() {
        return (
            <header>
                <nav className={'header'}>
                    <NavLink to={'/'}>
                        <span className={'header__title'}>
                            <img className={'header__title-logo'} src={logo} alt="EasyWay"/>
                        </span>
                    </NavLink>
                    <div className={'header__content-section'}>
                        {
                            this.props.path === '/courier-account/'
                                ?
                                null
                                :
                                <button className={'main-item-style'} onClick={this.props.openOrderForm}>
                                    Заказать
                                </button>
                        }

                        {
                            this.props.isAuth === true
                                ? <NavLink className={'header__user'}
                                           to={(this.props.path + this.props.id) || '/'}>
                                    <i className="fa fa-user-circle-o" aria-hidden="true"/>
                                    <span className={'name'}>{this.props.name}</span>
                                </NavLink>
                                : <button className={'main-item-style'} onClick={() => {
                                    this.props.openAuthForm()
                                }}>
                                    Войти
                                </button>
                        }
                    </div>
                    <button className="toggle-menu" aria-label="Responsive Navigation Menu">☰</button>
                </nav>
            </header>
        )
    }
}

export default Header