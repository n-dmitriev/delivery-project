import React from 'react'
import './Footer.scss'
import {NavLink} from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="footer">
            <h2>Контакты</h2>
            <div className="footer__content">
                <div className="">
                    <a href="https://vk.com/easywayss" rel="noopener noreferrer">
                        <i className="fa fa-vk fa-animate" aria-hidden="true"/>
                    </a>
                </div>
                <div className="">
                    <NavLink to={'/'}>
                        <i className={'fa fa-animate footer__logo'} aria-hidden="true">
                            <span className={'footer__logo_e'}>E</span>
                            <span className={'footer__logo_w'}>W</span>
                        </i>
                    </NavLink>
                </div>
                <div className="">
                    <a href="mailto:delivery.project2020@gmail.com">
                        <i className="fa fa-envelope fa-animate" aria-hidden="true"/>
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer