import React, {Component} from 'react'
import './MainPage.scss'
import {Map, Placemark, SearchControl, YMaps} from 'react-yandex-maps'

export default class MainPage extends Component {
    constructor(props) {
        super(props)
        this.input = React.createRef()
    }

    state = {coordinates: null}

    // componentDidMount() {
    //     window.addEventListener('load', this.handleLoad);
    // }

    handleLoad = () => {
        window.ymaps.ready(() => {
            window.ymaps.geocode(this.input.current.value).then(result => {
                console.log(result.geoObjects.get(0).geometry.getCoordinates())
                this.setState({coordinates: result.geoObjects.get(0).geometry.getCoordinates()})
            })
        })
    }

    render() {
        return (
            <div className={'main-page'}>
                <h1>Главная страница</h1>
                <input ref={this.input} type="text"/>
                <button onClick={this.handleLoad}>Поиск</button>
            </div>
        )
    }
}