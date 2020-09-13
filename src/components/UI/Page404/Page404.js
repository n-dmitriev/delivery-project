import React, {Component} from 'react'
import './Page404.scss'
import {NavLink} from 'react-router-dom'

export default class Page404 extends Component {
    render() {
        return (
            <div className={'page-404'}>
                <div className={'page-404__content'}>
                    <span className={'hit-the-floor'}>404</span>
                    <span className={'hit-the-floor hit-the-floor_mini'}>Страница не найдена!</span>
                    <NavLink to={'/'} className={'btn btn-danger mt-30'}>
                        На главную <i className="fa fa-home ml-1" aria-hidden="true"/>
                    </NavLink>
                </div>
            </div>
        )
    }
}