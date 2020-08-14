import React from 'react'
import './MiniTabPanel.scss'

const MiniTabPanel = props => {
    const type = props.type ? `-${props.type}` : ''
    return (
        <div className={`tab-panel${type}`}>
            {
                props.tabList.map((tab) => (
                    <div
                        id={tab.id}
                        className={props.activeTab === tab.id
                            ? 'tab-panel__tab tab-panel__tab_active'
                            : 'tab-panel__tab'}
                        key={tab.id}
                        onClick={props.clickItemHandler}>
                        <span className={'non-click'}>{tab.title}</span>
                    </div>
                ))
            }
        </div>
    )
}

export default MiniTabPanel