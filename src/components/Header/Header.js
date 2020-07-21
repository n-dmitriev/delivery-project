import React, {Component} from 'react'
import './Header.scss'
import {NavLink} from 'react-router-dom'
import logo from '../../img/logo.png'
import {confirmAlert} from 'react-confirm-alert'

class Header extends Component {
    state = {
        menuIsOpen: false,
        weClosed: false
    }

    componentDidMount() {
        const hour = new Date().getHours()
        if(hour < 10 || hour > 19){
            this.setState({
                weClosed:true
            })
        }
    }

    interactWithMenu = () => {
        this.setState({
            menuIsOpen: !this.state.menuIsOpen
        })
    }

    confirm = () =>  {
        confirmAlert(
            {
                customUI: ({onClose}) => {
                    return (
                        <div className={'confirm'}>
                            <h2 className={'mb-3'}>Внимание!</h2>
                                <p className={'mb-3'}>Курьеры EasyWays принимают заказы только с <b>10:00</b> по <b>19:00</b>!
                                <br/>
                                 Вы можете сделать заказ, но он будет доставлен, как только мы откроемся.</p>
                            <b className={'mb-3'}>Вы уверены, что хотите сделать заказ?</b>
                            <div className="d-flex">
                                <button className={'btn btn-dark mr-2'}
                                        onClick={() => {
                                            this.interactWithMenu()
                                            this.props.openOrderForm()
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

    getNavMenu = () => {
        return (
            <>
                {
                    this.props.path === '/courier-account/'
                        ?
                        null
                        :
                            this.state.weClosed
                                ? <button className={'main-item-style'} onClick={this.confirm}>
                                    Заказать
                                </button>
                                :<button className={'main-item-style'} onClick={() => {
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