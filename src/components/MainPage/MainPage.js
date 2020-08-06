import React, {Component} from 'react'
import './MainPage.scss'
import InputCoordinate from '../InputInformation/InputCoordinate'

export default class MainPage extends Component {
    componentDidMount() {
        document.title = 'EasyWays | Сервис доставки еды по г. Вологда'
    }

    render() {
        return (
            <div className={'main-page'}>
                <h1>Главная страница</h1>

                <InputCoordinate/>
            </div>
        )
    }
}