import React from 'react'
import './preloaders.scss'

const MiniPreloader = () =>{
    return (
        <div className={'lds-ellipsis'}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}

export default MiniPreloader