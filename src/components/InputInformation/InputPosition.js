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
import toaster from 'toasted-notes'
import MiniPreloader from '../UI/Preloaders/MiniPrleloader'

export default class InputPosition extends Component {
    constructor(props) {
        super(props)

        this.search = React.createRef()
    }

    greenZone = 1000
    yellowZone = 2000
    redZone = 3000
    defaultPrice = 150
    priceIn1Km = 20
    referencePoint = [59.220496, 39.891523]
    map = null
    ymaps = null
    route = null

    state = {
        edit: false,
        showBorders: true,
        coordinate: this.props.options?.coordinate ? this.props.options.coordinate : this.referencePoint,
        zoom: this.props.options?.isEdit ? 17 : 12,
        addressIsValid: this.props.options?.isEdit,
        errorMessage: '',
        deliveryValue: '',
        address: this.props.options?.address ? this.props.options.address : '',
        empty: true,
        loading: true,
        priceListIsOpen: this.props.options?.type === 'landing'
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

    instRef = (inst) => {
        if (inst) {
            inst.cursors.push('arrow')
            inst.events.add('click', this.clickOnMap)
        }
    }

    clear = () => {
        this.search.current.value = ''
        this.setState({
            empty: true
        })
    }

    interactWithPriceList = () => {
        this.setState({
            priceListIsOpen: !this.state.priceListIsOpen
        })
    }

    onChange = () => {
        if (this.search.current.value !== '' && this.state.empty)
            this.setState({empty: false})
        else if (this.search.current.value === '' && !this.state.empty)
            this.setState({empty: true})
    }

    checkingInputData = async () => {
        if (!this.state.addressIsValid) {
            if (this.state.errorMessage === '') {
                if (this.state.coordinate !== this.referencePoint && this.state.address !== '') {
                    const answer = await this.ymaps.geocode(this.state.address)
                    const address = answer.geoObjects.get(0)
                    await this.checkingAddressCorrectness(address, this.state.coordinate)
                    if (this.state.addressIsValid)
                        await this.calculateDeliveryValue()
                    else
                        toaster.notify(this.state.errorMessage, {
                            position: 'bottom-right',
                            duration: 3000
                        })
                } else
                    toaster.notify('Сперва укажите адрес!', {
                        position: 'bottom-right',
                        duration: 3000
                    })
            } else
                toaster.notify(this.state.errorMessage, {
                    position: 'bottom-right',
                    duration: 3000
                })
        } else
            await this.calculateDeliveryValue()
    }

    calculateDeliveryValue = async () => {
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

        if (this.props.options?.type === 'user')
            this.props.setAddressInfo(this.state.address, this.state.coordinate, deliveryValue)

        this.setState({
            addressIsValid,
            deliveryValue: addressIsValid ? deliveryValue + ' ₽' : deliveryValue
        })
    }

    checkingAddressCorrectness = (address, coordinate) => {
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
        } else if (address.getPremiseNumber() === undefined && this.props.options?.type !== 'courier') {
            addressIsValid = false
            errorMessage = 'Уточните номер дома!'
        }

        const thisAddress = addressIsValid ? [address.getLocalities(), address.getThoroughfare(), address.getPremiseNumber()].join(', ') : ''

        if (this.props.options?.type === 'courier' || this.props.options?.type === 'account') {
            this.props.setAddressInfo(thisAddress, coordinate, addressIsValid, errorMessage)
        }

        this.setState({
            addressIsValid, errorMessage,
            address: thisAddress,
            deliveryValue: '',
            coordinate,
            zoom: 17
        })
    }

    submitSearch = async () => {
        const search = this.search.current.value

        if (search.replace(/\s+/g, '') !== '') {
            const answer = await this.ymaps.geocode(search)
            const coordinate = answer.geoObjects.get(0)?.geometry.getCoordinates()

            if (coordinate) {
                this.checkingAddressCorrectness(answer.geoObjects.get(0), coordinate)
            }
        }
    }

    clickOnMap = async (e) => {
        e.preventDefault()
        const coordinate = e.get('coords')

        const answer = await this.ymaps.geocode(coordinate)
        const address = answer.geoObjects.get(0)

        let addressLine = [address.getLocalities(), address.getThoroughfare(), address.getPremiseNumber()].join(', ')

        if (this.search.current)
            this.search.current.value = addressLine


        this.checkingAddressCorrectness(address, coordinate)
    }

    geolocationControl = async (e) => {
        //console.log(e.get('position'))
        // const position = e.get('position')
        // const answer = await this.ymaps.geocode(position)
        // const address = answer.geoObjects.get(0)
        // console.log(address)
    }

    render() {
        return (
            <div className={'input-coordinate'}>
                <div className={'input-coordinate__search'}>
                    <div className="form-group">
                        <input
                            placeholder={this.props.options?.type === 'courier' ? 'Укажите ваше местоположение'
                                : 'Укажите ваш адрес'}
                            defaultValue={this.props.options?.address}
                            ref={this.search}
                            type='text'
                            id="suggest"
                            onChange={this.onChange}
                        />
                        {
                            !this.state.empty
                                ? <span onClick={this.clear} className="input-dagger">
                                    <i className="fa fa-times-circle fa-animate" aria-hidden="true"/>
                                </span>
                                : null
                        }
                        <label className={'label'} htmlFor="suggest">
                            {
                                this.props.options?.type === 'courier'
                                    ? 'Местоположение'
                                    : 'Ваш адрес'
                            }</label>
                    </div>
                    <button onClick={this.submitSearch} className={'btn'}>
                        Поиск
                    </button>
                </div>
                <div className={'input-coordinate__map'}>
                    {
                        this.state.loading
                            ? <MiniPreloader/>
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
                                {
                                    this.props.options?.type !== 'courier'
                                        ? <>
                                            <Button
                                                options={{maxWidth: 100, float: 'right'}}
                                                data={{content: `Границы`}}
                                                defaultState={{selected: true}}
                                                onClick={this.showOrHide}
                                            />
                                            {
                                                this.props.options?.type !== 'account'
                                                    ?
                                                    <div
                                                        onClick={this.checkingInputData}
                                                        className={'input-coordinate__price'}>
                                                        {
                                                            this.props.options?.isEdit
                                                                ?
                                                                this.state.address === this.props.options.address
                                                                    ? <>Стоимость
                                                                        доставки: <b>{this.props.options.deliveryValue}</b></>
                                                                    :
                                                                    this.state.deliveryValue !== ''
                                                                        ? <>Стоимость
                                                                            доставки: <b>{this.state.deliveryValue}</b></>
                                                                        : 'Расчитать стоимость доставки'
                                                                :
                                                                this.state.deliveryValue !== ''
                                                                    ? <>Стоимость
                                                                        доставки: <b>{this.state.deliveryValue}</b></>
                                                                    : 'Расчитать стоимость доставки'
                                                        }
                                                    </div>
                                                    : null
                                            }
                                        </>
                                        : null
                                }
                                <GeolocationControl
                                    onCLick={this.geolocationControl}
                                    options={{
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
                                    this.state.showBorders && this.props.options?.type !== 'courier'
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
                {
                    this.props.options?.type !== 'courier'
                        ? <>
                            <h4
                                onClick={this.interactWithPriceList}
                                className={'bg-dark text-white text-center input-coordinate__price-list'}>
                                Стоимость доставки
                                {
                                    this.state.priceListIsOpen
                                        ? <i className="fa fa-caret-up fa-animate" aria-hidden="true"/>
                                        : <i className="fa fa-caret-down fa-animate" aria-hidden="true"/>
                                }
                            </h4>

                            <div className={'row text-center'}>
                                {
                                    this.state.priceListIsOpen
                                        ? <>
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
                                        </>
                                        : null
                                }

                            </div>
                        </>
                        : null
                }
            </div>
        )
    }
}