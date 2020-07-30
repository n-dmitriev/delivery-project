import React from 'react'
import {Progress} from 'react-sweet-progress'

const ProgressBar = props =>{
    let percent, status, theme

    switch (props.status) {
        case -1:
            percent = 100
            status = 'error'
            theme = {
                error: {
                    symbol: '🤔',
                    color: '#fbc630'
                }
            }
            break
        case 0:
            percent = 10
            status = ''
            theme = {}
            break
        case 1:
            percent = 30
            status = ''
            theme = {}
            break
        case 2:
            percent = 70
            status = ''
            theme = {}
            break
        case 3:
            percent = 100
            status = 'success'
            theme = {}
            break
        case 4:
            percent = 100
            status = 'error'
            theme = {}
            break
        case 5:
            percent = 100
            status = 'error'
            theme = {}
            break
        default:
            percent = 0
            status = ''
            theme = {}
            break
    }

    return (
        <Progress percent={percent} status={status} theme={theme}/>
    )
}

export default ProgressBar