import React from 'react'

const TabPanel = props =>{
    return (
        <div className={'selector'}>
            {
                props.tabList.map((tab) => (
                    <div
                        id={tab.id}
                        className={props.activeTab === tab.id
                            ? 'select select_active'
                            : 'select'}
                        key={tab.id}
                        onClick={props.clickItemHandler}>
                        <span className={'non-click'}>{tab.title}</span>
                    </div>
                ))
            }
        </div>
    )
}

export default TabPanel