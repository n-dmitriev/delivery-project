import React, {Component} from 'react'
import InputPosition from '../InputInformation/InputPosition'

export default class InputAddress extends Component {
    render() {
        return (
            <div className={'contact-information'}>
                <h2 className={'mb-30'}>Укажите ваш адрес</h2>
                <InputPosition
                    setAddressInfo={this.props.setAddressInfo}
                    options={this.props.options}
                />
                <div className="button-section mt-30">
                    <button
                        onClick={() => {
                            this.props.changeActiveWindow('list')
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