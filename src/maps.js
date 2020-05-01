import React, {Component} from 'react'
import {Map, Placemark, SearchControl, YMaps} from 'react-yandex-maps'

export default class maps extends Component {
    state = {coordinates: null}

    componentDidMount() {
        window.addEventListener('load', this.handleLoad);
    }

    handleLoad() {
        window.ymaps.ready(() => {
            window.ymaps.geocode('Вологда ул Ленина').then(result => {
                console.log(result.geoObjects.get(0).geometry.getCoordinates())
                this.setState({coordinates: result.geoObjects.get(0).geometry.getCoordinates()})
            })
        })
    }

    geocode = (ymaps) => {
        ymaps.geocode('Вологда ул Ленина')
            .then(result => {
                console.log(result.geoObjects.get(0).geometry.getCoordinates())
                this.setState({coordinates: result.geoObjects.get(0).geometry.getCoordinates()})
            })
    }

    search = (ymaps) => {
        ymaps.searchControl.search('Москва').then(function () {
            var geoObjectsArray = ymaps.searchControl.getResultsArray()
            if (geoObjectsArray.length) {
                // Выводит свойство name первого геообъекта из результатов запроса.
                console.log(geoObjectsArray[0].properties.get('name'))
            }})
    }

    render() {
        return (
            <div>
                <YMaps query={{
                    apikey: '87bbec27-5093-4a9c-a244-9bedba71ad27',
                }}>
                    <Map defaultState={{center: [59.220496, 39.891523], zoom: 12}} onLoad={ymaps => this.geocode(ymaps)}
                         modules={['geocode']}>
                        {this.state.coordinates ?
                            <Placemark
                                geometry={this.state.coordinates}
                            />
                            : null
                        }
                        <SearchControl options={{float: 'right'}}/>
                    </Map>
                </YMaps>
            </div>
        )
    }
}