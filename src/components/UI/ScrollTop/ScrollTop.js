import React, {Component} from 'react'
import './ScrollTop.scss'

export default class ScrollTop extends Component {
    scrollToTop = () => {
        window.scroll(0, 0)
    }

    render(){
        return(
            <button
                onClick={this.scrollToTop}
                className={this.props.scrollV ? `scroll-to-top` : 'hide'}>
                <i className={`fa fa-angle-up`} aria-hidden="true"/>
            </button>
        )
    }
}