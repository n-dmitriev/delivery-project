import React, {Component} from 'react'
import './ScrollTop.scss'

export default class ScrollTop extends Component {
    state = {
        scrollV: false
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll)
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
    }

    handleScroll = (e) => {
        if (e.srcElement.scrollingElement.scrollTop > 100 && this.state.scrollV === false) {
            this.setState({
                scrollV: true
            })
        } else if (e.srcElement.scrollingElement.scrollTop <= 100 && this.state.scrollV === true) {
            this.setState({
                scrollV: false
            })
        }
    }

    scrollTo = (element = document.documentElement, to = 0, duration = 700) => {
        let start = element.scrollTop,
            change = to - start,
            currentTime = 0,
            increment = 20

        Math.easeInOutQuad = (t, b, c, d) => {
            t /= d / 2
            if (t < 1) return c / 2 * t * t + b
            t--
            return -c / 2 * (t * (t - 2) - 1) + b
        }

        const animateScroll = function () {
            currentTime += increment
            element.scrollTop = Math.easeInOutQuad(currentTime, start, change, duration)
            if (currentTime < duration) {
                setTimeout(animateScroll, increment)
            }
        }
        animateScroll()
    }

    render() {
        return (
            <button
                onClick={() => (this.scrollTo())}
                className={this.state.scrollV ? `scroll-to-top` : 'hide'}>
                <i className={`fa fa-angle-up`} aria-hidden="true"/>
            </button>
        )
    }
}