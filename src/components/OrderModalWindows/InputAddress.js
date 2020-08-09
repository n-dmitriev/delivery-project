import React, {Component} from 'react'
import InputCoordinate from '../InputInformation/InputCoordinate'

export default class InputAddress extends Component {
    render() {
        return (
            <div className={'contact-information'}>
                <h2 className={'mb-2'}>Укажите ваш адрес</h2>
                <InputCoordinate
                    saveMapInformation={this.props.saveMapInformation}
                    setAddressInfo={this.props.setAddressInfo}
                />
                <div className="button-section mt-4">
                    <button
                        onClick={() => {
                            this.props.interactionWithDagger('list')
                        }}
                        className="main-item-style mr-3">
                        Назад
                    </button>
                    <button
                        onClick={this.props.nextStep}
                        className="main-item-style">
                        Далее
                    </button>
                </div>
            </div>
        )
    }
}