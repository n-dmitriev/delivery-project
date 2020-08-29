import React, {Component} from 'react'
import {IMaskInput} from 'react-imask'

export default class ContactInformation extends Component {
    render() {
        return (
            <div className={'order-form'} key={'order-form'}>
                <h2 className={'mb-30'}>Контактная информация</h2>

                <div className={'non-click input-field mt-15'}>
                    <label className={'mb-2'}>Имя</label>
                    <input
                        className={'non-click'}
                        type="text"
                        defaultValue={this.props.userInfo.clientName}
                    />
                </div>

                <div className={'input-field mt-15'}>
                    <label className={'mb-2'}>Номер телефона</label>
                    <div
                        className={'non-click number-block'}>
                        <IMaskInput
                            mask={'+{7}(000)000-00-00'}
                            unmask={false}
                            onAccept={() => {
                            }}
                            placeholder='+7 ('
                            value={this.props.userInfo.clientNumberPhone}
                        />
                    </div>
                </div>
                <div className={'non-click input-field mt-15'}>
                    <label className={'mb-2'}>Адрес</label>
                    <input
                        className={'non-click'}
                        type="text"
                        defaultValue={this.props.userInfo.clientAddress}
                        readOnly
                    />
                </div>


                <div className="button-section mt-30">
                    <button
                        onClick={() => {
                            this.props.interactionWithDagger('list')
                        }}
                        className="main-item-style main-item-style_danger mr-3">
                        Назад
                    </button>
                    <button
                        onClick={() => {
                            this.props.interactionWithDagger('map')
                        }}
                        className="main-item-style mr-3 ">
                        Редактировать
                    </button>
                    <button
                        onClick={this.props.saveCurrentData}
                        className="main-item-style">
                        Далее
                    </button>
                </div>
            </div>
        )
    }
}