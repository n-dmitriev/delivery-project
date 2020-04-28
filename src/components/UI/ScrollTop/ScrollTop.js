import React, {Component} from 'react'
import './ScrollTop.scss'

export default class ScrollTop extends Component {
    scrollToTop(e) {
        window.scroll(0, 0);
    }

    render(){
        return(
            <button
                onClick={this.scrollToTop}
                className="scroll-to-top">
                <i className="fa fa-angle-up" aria-hidden="true"/>
            </button>
        )
    }
}