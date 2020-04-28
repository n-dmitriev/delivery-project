import React from 'react'
import './Footer.scss'

const Footer = props => {
    return (
        <footer className="footer">
            <h2>Контакты</h2>
            <div className="footer__content">
                <div className="">
                    <a href="https://vk.com/easywayss" target="_blank">
                        <i className="fa fa-vk" aria-hidden="true"/>
                    </a>
                </div>
                <div className="">
                    <a target="_blank">
                        <i className="fa fa-telegram" aria-hidden="true"/>
                    </a>
                </div>
                <div className="">
                    <a href="mailto:delivery.project2020@gmail.com">
                        <i className="fa fa-envelope" aria-hidden="true"/>
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer