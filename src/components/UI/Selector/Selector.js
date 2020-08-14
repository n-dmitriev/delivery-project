import React, {Component} from 'react'
import './Selector.scss'

export default class Selector extends Component {
    state = {
        isOpen: false
    }

    onClickHandler = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    changeActiveItem = (option) => {
        this.props.setType(option)
        this.onClickHandler()
    }

    render() {
        return (
            <div>
                <div className={`select ${this.state.isOpen ? 'select_active' : ''}`} data-state=""
                     onClick={this.onClickHandler}>
                    <div className="select__title">
                        {this.props.activeType?.label
                            ? this.props.activeType.label
                            : <span className={'select__placeholder'}>{this.props.placeholder}</span> }
                    </div>
                    <div className={'select__option'}>
                        {
                            this.props.selectList.map(option => (
                                <div key={option.id}>
                                    <input className="select__input" type="radio"/>
                                    <label onClick={() => this.changeActiveItem(option)} className="select__label">
                                        {option.label}
                                    </label>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }
}