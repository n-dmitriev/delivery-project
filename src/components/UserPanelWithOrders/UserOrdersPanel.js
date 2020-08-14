import React, {Component} from 'react'
import './UserOrdersPanel.scss'
import List from '../RenderOrderList/List'
import MiniTabPanel from '../UI/MiniTabPanel/MiniTabPanel'

export default class UserOrdersPanel extends Component {
    state = {
        activeTab: ''
    }

    getActiveTabData = (activeTab = '') => {
        let type = '', statusList = [], num
        if (this.state.activeTab === 'current-tab') {
            type = 'active'
            statusList = [-1, 0, 1, 2]
            num = 0
        } else if (this.state.activeTab === 'finish-tab') {
            type = 'finish'
            statusList = [3, 4]
            num = 1
        } else
            type = activeTab === 'current-tab' ? 'active' : 'finish'

        return {type, statusList, num}
    }

    clickItemHandler = async (event) => {
        const activeTab = event.target.id === this.state.activeTab ? '' : event.target.id
        await this.setState({
            activeTab: activeTab
        })

        const data = this.getActiveTabData(activeTab)

        if (activeTab !== '') {
            this.props.fetchOrderList(data.type, 'userId', null, data.statusList, 0)
        }
        //this.props.subscribe(activeTab !== '', data.type, 'userId', null, data.statusList)
    }

    increaseNumberElements = async () => {
        const data = this.getActiveTabData()
        if(!this.props.arrOfLists[data.num].isEnd) {
            const list = this.props.arrOfLists[data.num].orderList
            await this.props.fetchOrderList(data.type, 'userId', null, data.statusList,
                list.length !== 0 ? list[list.length-1].id : 0)
        }
    }

    render() {
        return (
            <div className={'user-panel'}>
                <MiniTabPanel
                    clickItemHandler={this.clickItemHandler}
                    activeTab={this.state.activeTab}
                    tabList={[{
                        title: 'Активные',
                        id: 'current-tab'
                    }, {
                        title: 'Завершённые',
                        id: 'finish-tab'
                    }]}
                />

                <div className={'user-panel__body'}>
                    {
                        this.state.activeTab === 'current-tab'
                            ? <List
                                orderList={this.props.arrOfLists[0].orderList}
                                type={this.props.arrOfLists[0].type}
                                increaseNumberElements={this.increaseNumberElements}
                                loading={this.props.loading}
                            />
                            : this.state.activeTab === 'finish-tab'
                            ? <List
                                orderList={this.props.arrOfLists[1].orderList}
                                type={this.props.arrOfLists[1].type}
                                reOrder={this.props.reOrder}
                                increaseNumberElements={this.increaseNumberElements}
                                loading={this.props.loading}
                            />
                            : <p className={'placeholder'}>Ничего не выбрано!</p>
                    }
                </div>
            </div>
        )
    }
}