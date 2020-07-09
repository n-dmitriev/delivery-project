import React, {Component} from 'react'
import './MainPage.scss'
import Tooltip from 'react-tooltip-lite'

export default class MainPage extends Component {
    state = {
        isOpen: false
    }

    modalHandler = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    render() {
        return (
            <div className={'main-page'}>
                <h1>Главная страница</h1>
                <Tooltip
                    content={(
                        <div>
                            <h4 className="tip-heading">An unordered list to demo some html content</h4>
                            <ul className="tip-list">
                                <li>One</li>
                                <li>Two</li>
                                <li>Three</li>
                                <li>Four</li>
                                <li>Five</li>
                            </ul>
                        </div>
                    )}
                    direction="right"
                    tagName="span"
                    className="target"
                    useDefaultStyles
                >
                    Target content for big html tip
                </Tooltip>
            </div>
        )
    }
}