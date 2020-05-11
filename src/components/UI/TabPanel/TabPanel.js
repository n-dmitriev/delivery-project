import React, {Component} from 'react'

export default class TabPanel extends Component {


    render(){
        return(
            <div className={'selector'}>
                <div
                    id={'active-tab'}
                    className={this.state.activeTab === 'active-tab'
                        ? 'select select_active'
                        : 'select'}
                    onClick={this.clickItemHandler}>
                    <span className={'non-click'}>Активные</span>
                </div>
                <div
                    id={'finish-tab'}
                    className={this.state.activeTab === 'finish-tab'
                        ? 'select select_active'
                        : 'select'}
                    onClick={this.clickItemHandler}>
                    <span className={'non-click'}>Завершённые</span>
                </div>
                <div className={''}>

                </div>
            </div>
        )
    }
}