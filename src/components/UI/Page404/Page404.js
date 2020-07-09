import React, {Component} from 'react'
import './Page404.scss'
import {NavLink} from 'react-router-dom'

export default class Page404 extends Component {
    render() {
        return (
            <div className={'page-404'}>
                <div className={'page-404__content'}>
                    <h1 className={'text-danger mb-2'}>Ошибка 404</h1>
                    <h2 className={'mb-4'}>Страница не найдена!</h2>
                    <NavLink to={'/'} className={'btn btn-danger'}>
                        На главную <i className="fa fa-home ml-1" aria-hidden="true"/>
                    </NavLink>
                </div>
            </div>
        )
    }
}