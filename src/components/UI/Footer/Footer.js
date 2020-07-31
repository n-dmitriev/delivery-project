import React from 'react'
import './Footer.scss'

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
                    <a rel="noopener noreferrer" href="https://vk.com/easywayss">
                        <i className="fa fa-telegram fa-animate" aria-hidden="true"/>
                    </a>
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