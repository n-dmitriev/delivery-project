import React, {Component} from 'react'
import './Header.scss'
import {NavLink} from 'react-router-dom'
import logo from '../../img/logo.png'
import {confirmAlert} from 'react-confirm-alert'
import AppModalWindows from './AppModalWindows'

export default class Header extends Component {
    state = {
        menuIsOpen: false,
        isOrderModalOpen: false,
        isAuthModalOpen: false
    }

    interactWithMenu = () => {
        this.setState({
            menuIsOpen: !this.state.menuIsOpen
        })
    }

    interactionWithOrderModal = () => {
        this.setState({isOrderModalOpen: !this.state.isOrderModalOpen})
    }

    interactionWithAuthModal = () => {
        this.setState({isAuthModalOpen: !this.state.isAuthModalOpen})
    }

    order = () => {
        this.interactWithMenu()
        this.interactionWithOrderModal()
    }

    confirm = () => {
        confirmAlert(
            {
                customUI: ({onClose}) => {
                    return (
                        <div className={'confirm'}>
                            <h2 className={'mb-3'}>Внимание!</h2>
                            <p className={'mb-3'}>Курьеры EasyWays принимают заказы только
                                с <b>10:00</b> по <b>19:00</b>!
                                <br/>
                                Вы можете сделать заказ сейчас, но он будет обработан позже.</p>
                            <b className={'mb-3'}>Вы уверены, что хотите сделать заказ?</b>
                            <div className="d-flex">
                                <button className={'btn btn-dark mr-2'}
                                        onClick={() => {
                                            this.order()
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

    checkTime = () => {
        const hour = new Date().getHours()
        const weClose = hour < 10 || hour > 19
        if (weClose) {
            this.confirm()
        } else {
            this.order()
        }
    }

    getNavMenu = () => {
        if (this.props.isAuth) {
            if (this.props.path === '/courier-account/') {
                return (
                    <NavLink className={'header__link'}
                             onClick={this.interactWithMenu}
                             to={(this.props.path + this.props.id) || '/'}>
                        <i className="fa fa-user-circle-o" aria-hidden="true"/>
                        <span className={'name'}>Личный кабинет</span>
                    </NavLink>
                )
            } else if (this.props.path === '/user-account/') {
                return (
                    <>
                        <div className={'header__link'} onClick={this.checkTime}>
                            {/*<i className="fa fa-pencil" aria-hidden="true"/>*/}
                            {/*<span className={'name'}>Заказать</span>*/}
                            Заказать
                        </div>
                        <NavLink className={'header__link'}
                                 to={('/user-orders/' + this.props.id) || '/'}>
                            {/*<i className="fa fa-list" aria-hidden="true"/>*/}
                            {/*<span className={'name'}>Заказы</span>*/}
                            Заказы
                        </NavLink>
                        <NavLink className={'header__link'}
                                 onClick={this.interactWithMenu}
                                 to={('/user-info/' + this.props.id) || '/'}>
                            <i className="fa fa-user-circle-o" aria-hidden="true"/>
                            <span className={'name'}>Профиль</span>
                        </NavLink>
                    </>
                )
            }
        } else
            return (
                <>
                    <button className={'header__link'} onClick={this.checkTime}>
                        {/*<i className="fa fa-pencil" aria-hidden="true"/>*/}
                        {/*<span className={'name'}>Заказать</span>*/}
                        Заказать
                    </button>
                    <button className={'header__link'} onClick={this.interactionWithAuthModal}>
                        {/*<i className="fa fa-sign-in" aria-hidden="true"/>*/}
                        {/*<span className={'name'}>Войти</span>*/}
                        Войти
                    </button>
                </>
            )
    }

    render() {
        return (
            <>
                <header>
                    <nav className={'header animate__slideInDown'}>
                        <NavLink to={'/'} className={`header__title ${this.state.menuIsOpen ? 'open' : ''}`}>
                            <img className={'header__title-logo'} src={logo} alt="EasyWays"/>
                        </NavLink>

                        <div className={'header__navigation-section d-none d-sm-block'}>
                            {
                                this.getNavMenu()
                            }
                        </div>

                        <div
                            className={'header__navigation-section header__navigation-section_mobile d-block d-sm-none'}>
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
                <AppModalWindows
                    isAuth={this.props.isAuth}
                    isError={this.props.isError}
                    isOrderModalOpen={this.state.isOrderModalOpen}
                    isAuthModalOpen={this.state.isAuthModalOpen}
                    interactionWithOrderModal={this.interactionWithOrderModal}
                    interactionWithAuthModal={this.interactionWithAuthModal}
                />
            </>
        )
    }
}