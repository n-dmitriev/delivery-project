import React, {Component} from 'react'
import './InputCoordinate.scss'
import {
    Button,
    Circle,
    FullscreenControl,
    GeolocationControl,
    Map,
    Placemark,
    YMaps,
    ZoomControl
} from 'react-yandex-maps'
import BigPreloader from '../UI/Preloaders/BigPreloader'
import toaster from 'toasted-notes'

export default class InputCoordinate extends Component {
    constructor(props) {
        super(props)

        this.referencePoint = [59.220496, 39.891523]
        this.greenZone = 1000
        this.yellowZone = 2000
        this.redZone = 3000
        this.defaultPrice = 150
        this.priceIn1Km = 10

        this.map = null
        this.ymaps = null
        this.route = null
        this.search = React.createRef()

        this.state = {
            edit: false,
            showBorders: true,
            coordinate: this.referencePoint,
            zoom: 12,
            addressIsValid: false,
            errorMessage: '',
            deliveryValue: '',
            empty: true,
            loading: true,
            address: ''
        }
    }

    showOrHide = () => {
        this.setState({showBorders: !this.state.showBorders})
    }

    handleApiAvaliable = ymaps => {
        this.ymaps = ymaps
        ymaps.load(() => {
            new ymaps.SuggestView('suggest', {results: 5})
            this.setState({
                loading: false
            })
        })

    }

    clear = () => {
        this.search.current.value = ''
        this.setState({
            empty: true
        })
    }

    onChange = () => {
        if (this.search.current.value !== '' && this.state.empty)
            this.setState({empty: false})
        else if (this.search.current.value === '' && !this.state.empty)
            this.setState({empty: true})
    }

    calculateDeliveryValue = async () => {
        if (!this.state.addressIsValid) {
            if (this.state.errorMessage === '')
                toaster.notify('Сперва укажите адрес!', {
                    position: 'bottom-right',
                    duration: 3000
                })
            else
                toaster.notify(this.state.errorMessage, {
                    position: 'bottom-right',
                    duration: 3000
                })
        } else {
            // const route = await window.ymaps.route([this.referencePoint, this.state.coordinate])
            // const distance = Math.ceil(route.getLength())\
            const distance = Math.ceil(window.ymaps.coordSystem.geo.getDistance(this.state.coordinate, this.referencePoint))
            let deliveryValue = 0, addressIsValid = true

            if (distance < this.greenZone) {
                deliveryValue = 150
            } else if (distance <= this.yellowZone) {
                deliveryValue = 150 + Math.ceil((distance - this.greenZone) / 1000) * this.priceIn1Km
            } else if (distance <= this.redZone) {
                deliveryValue = 150 + Math.ceil((this.yellowZone - this.greenZone) / 1000) * this.priceIn1Km
                    + Math.ceil((distance - this.yellowZone) / 1000) * this.priceIn1Km * 2
            } else if (distance > this.redZone) {
                deliveryValue = 'Не доставим :('
                addressIsValid = false
            }


            this.setState({
                addressIsValid,
                deliveryValue: addressIsValid ? deliveryValue + ' ₽' : deliveryValue
            })
        }
    }

    checkingAddressCorrectness = (address) => {
        let addressIsValid = true, errorMessage = false

        if (address.getLocalities() === undefined) {
            addressIsValid = false
            errorMessage = 'Уточните название города!'
        } else if (address.getLocalities()[0] !== 'Вологда') {
            addressIsValid = false
            errorMessage = 'Мы работаем только в г. Вологда!'
        } else if (address.getThoroughfare() === undefined && address.getPremiseNumber() === undefined) {
            addressIsValid = false
            errorMessage = 'Уточните название улицы!'
        } else if (address.getPremiseNumber() === undefined) {
            addressIsValid = false
            errorMessage = 'Уточните номер дома!'
        }

        this.setState({
            addressIsValid, errorMessage,
            address: addressIsValid ? [address.getLocalities(), address.getThoroughfare(), address.getPremiseNumber()].join(', ') : ''
        })
    }

    submitSearch = async () => {
        const search = this.search.current.value

        if (search.replace(/\s+/g, '') !== '') {
            const answer = await this.ymaps.geocode(search)
            const coordinate = answer.geoObjects.get(0)?.geometry.getCoordinates()

            if (coordinate) {
                this.checkingAddressCorrectness(answer.geoObjects.get(0))
                this.setState({
                    deliveryValue: '',
                    coordinate,
                    zoom: 17
                })
            }
        }
    }

    clickOnMap = async (e) => {
        e.preventDefault()
        const coordinate = e.get('coords')

        const answer = await this.ymaps.geocode(coordinate)
        const address = answer.geoObjects.get(0)

        let addressLine = [address.getLocalities(), address.getThoroughfare(), address.getPremiseNumber()].join(', ')
        this.search.current.value = addressLine


        this.checkingAddressCorrectness(address)
        this.setState({
            deliveryValue: '',
            coordinate,
            zoom: 17
        })
    }

    instRef = (inst) => {
        if (inst) {
            inst.cursors.push('arrow')
            inst.events.add('click', this.clickOnMap)
        }
    }

    render() {
        return (
            <div className={'input-coordinate'}>
                <div className={'input-coordinate__search'}>
                    <div className="form-group">
                        <input placeholder={'Укажите ваш адрес'}
                            // defaultValue={this.props.ordersList[0].orderValue}
                               ref={this.search}
                               type='text'
                               id="suggest"
                               onChange={this.onChange}
                        />
                        {
                            !this.state.empty
                                ? <span onClick={this.clear} className="input-dagger fa-animate">
                                    &times;
                                </span>
                                : null
                        }
                        <label className={'label'} htmlFor="suggest">Ваш адрес</label>
                    </div>
                    <button onClick={this.submitSearch} className={'btn'}>
                        Поиск
                    </button>
                </div>
                <div className={'input-coordinate__map'}>
                    {
                        this.state.loading
                            ? <BigPreloader/>
                            : null
                    }
                    <div className={this.state.loading ? 'hide' : ''}>
                        <YMaps query={{apikey: '87bbec27-5093-4a9c-a244-9bedba71ad27'}}>
                            <Map state={{center: this.state.coordinate, zoom: this.state.zoom}}
                                 modules={['templateLayoutFactory']}
                                 onLoad={this.handleApiAvaliable}
                                 width="100%"
                                 height="350px"
                                 instanceRef={this.instRef}
                                 cursor={'arrow'}
                                 options={{suppressMapOpenBlock: true}}
                            >
                                <Button
                                    options={{maxWidth: 100, float: 'right'}}
                                    data={{content: `Границы`}}
                                    defaultState={{selected: true}}
                                    onClick={this.showOrHide}
                                />
                                <div
                                    onClick={this.calculateDeliveryValue}
                                    className={'input-coordinate__price'}>
                                    {
                                        this.state.deliveryValue !== ''
                                            ? `Стоимость доставки: ${this.state.deliveryValue}`
                                            : 'Расчитать стоимость доставки'
                                    }
                                </div>
                                <GeolocationControl options={{
                                    float: 'none',
                                    position: {
                                        top: '55px',
                                        left: '10px'
                                    }
                                }}/>
                                <FullscreenControl options={{
                                    float: 'none',
                                    position: {
                                        top: '315px',
                                        left: '10px'
                                    }
                                }}/>
                                <ZoomControl options={{
                                    position: {
                                        top: '95px',
                                        left: '10px'
                                    }
                                }}/>
                                {
                                    this.state.coordinate === this.referencePoint
                                        ? null
                                        : <Placemark geometry={this.state.coordinate}/>
                                }

                                {
                                    this.state.showBorders
                                        ?
                                        <>
                                            <Circle
                                                geometry={[this.referencePoint, this.redZone]}
                                                options={{
                                                    draggable: false,
                                                    fillColor: 'rgb(255,0,0)',
                                                    fillOpacity: 0.2,
                                                    strokeColor: 'rgba(0,0,0,0.47)',
                                                    strokeWidth: 2,
                                                    cursor: 'arrow'
                                                }}
                                                onClick={this.clickOnMap}
                                            />
                                            <Circle
                                                geometry={[this.referencePoint, this.yellowZone]}
                                                options={{
                                                    draggable: false,
                                                    fillColor: 'rgb(179,255,0)',
                                                    fillOpacity: 0.2,
                                                    strokeColor: 'rgba(154,169,34,0.47)',
                                                    strokeWidth: 2,
                                                    cursor: 'arrow'
                                                }}
                                                onClick={this.clickOnMap}
                                            />
                                            <Circle
                                                geometry={[this.referencePoint, this.greenZone]}
                                                options={{
                                                    draggable: false,
                                                    fillColor: 'rgb(0,124,21)',
                                                    fillOpacity: 0.2,
                                                    strokeColor: 'rgba(7,221,43,0.47)',
                                                    strokeWidth: 1,
                                                    cursor: 'arrow'
                                                }}
                                                onClick={this.clickOnMap}
                                            />
                                        </>
                                        : null
                                }
                            </Map>
                        </YMaps>
                    </div>
                </div>
                <h4 className={'text-center bg-dark text-white'}>Стоимость доставки</h4>

                <div className={'row text-center'}>
                    <div className="col-12 col-sm-4">
                        <b className={'text-success'}>{this.defaultPrice} ₽</b>
                    </div>
                    <div className="col-12 col-sm-4">
                        <b className={'text-warning'}>
                            {this.defaultPrice} ₽ +{this.priceIn1Km} ₽ за каждый км вне зеленой зоны
                        </b>
                    </div>
                    <div className="col-12 col-sm-4">
                        <b className={'text-danger'}>
                            {this.defaultPrice} ₽ +{this.priceIn1Km * 2} ₽ за каждый км вне желтой зоны
                        </b>
                    </div>
                </div>
            </div>
        )
    }
}

// search = async (e) => {
//     const request = e.originalEvent.request
//
//     const answer = await window.ymaps.geocode(request)
//     const coordinate = answer.geoObjects.get(0).geometry.getCoordinates()
//
// }