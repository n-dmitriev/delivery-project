import React, {Component} from 'react'
import './Header.scss'
import {NavLink} from 'react-router-dom'
import logo from '../../img/logo.png'

class Header extends Component {
    state = {
        menuIsOpen: false,
    }

    interactWithMenu = () => {
        this.setState({
            menuIsOpen: !this.state.menuIsOpen,
        })
    }

    getNavMenu = () => {
        return (
            <>
                {
                    this.props.path === '/courier-account/'
                        ?
                        null
                        :
                        <button className={'main-item-style'} onClick={() => {
                            this.interactWithMenu()
                            this.props.openOrderForm()
                        }
                        }>
                            Заказать
                        </button>
                }

                {
                    this.props.isAuth === true
                        ? <NavLink className={'header__user'}
                                   onClick={() => this.interactWithMenu()}
                                   to={(this.props.path + this.props.id) || '/'}>
                            <i className="fa fa-user-circle-o" aria-hidden="true"/>
                            <span className={'name'}>{this.props.name}</span>
                        </NavLink>
                        : <button className={'main-item-style'} onClick={() => {
                            this.interactWithMenu()
                            this.props.openAuthForm()
                        }}>
                            Войти
                        </button>
                }
            </>
        )
    }

    render() {
        return (
            <header>
                <nav className={'header'}>
                    <NavLink to={'/'}>
                        <span className={'header__title'}>
                            <img className={'header__title-logo'} src={logo} alt="EasyWays"/>
                        </span>
                    </NavLink>

                    <div className={'header__navigation-section d-none d-sm-block'}>
                        {
                            this.getNavMenu()
                        }
                    </div>

                    <div className={'header__navigation-section header__navigation-section_mobile d-block d-sm-none'}>
                        <div
                            onClick={this.interactWithMenu}
                            className="toggle-menu">
                            ☰
                        </div>
                        <div className={'mobile-content'}>
                            {
                                this.state.menuIsOpen ? this.getNavMenu() : null
                            }
                        </div>
                    </div>

                </nav>
            </header>
        )
    }
}

export default Header