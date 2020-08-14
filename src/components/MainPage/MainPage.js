import React, {Component} from 'react'
import './MainPage.scss'

export default class MainPage extends Component {
    constructor(props) {
        super(props)
        document.title = 'EasyWays | Сервис доставки еды по г. Вологда'
    }


    render() {
        return (
            <div className={'main-page'}>
                <h1>Главная страница</h1>
            </div>
        )
    }
}