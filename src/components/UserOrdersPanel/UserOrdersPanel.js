import React, {Component} from 'react'
import './UserOrdersPanel.scss'
import List from '../RenderOrderList/List'
import TabPanel from '../UI/TabPanel/TabPanel'
import MiniPreloader from '../UI/Preloaders/MiniPrleloader'

export default class UserOrdersPanel extends Component {
    state = {
        activeTab: '',
    }

    clickItemHandler = (event) => {
        let type, statusList = []
        const activeTab = event.target.id === this.state.activeTab ? '' : event.target.id
        this.setState({
            activeTab: activeTab,
        })

        if (activeTab === 'current-tab') {
            type = 'active'
            statusList = [-1, 0, 1, 2]
        } else if (activeTab === 'finish-tab') {
            type = 'finish'
            statusList = [3, 4]
        } else
            type = event.target.id === 'current-tab' ? 'active' : 'finish'

        if (activeTab !== '') {
            this.props.fetchOrderList(type, 'userId', null, statusList)
        }
        this.props.subscribe(activeTab !== '', type, 'userId', null, statusList)
    }

    render() {
        return (
            <div className={'user-panel'}>
                <TabPanel
                    clickItemHandler={this.clickItemHandler}
                    activeTab={this.state.activeTab}
                    tabList={[{
                        title: 'Активные',
                        id: 'current-tab',
                    }, {
                        title: 'Завершённые',
                        id: 'finish-tab',
                    }]}
                />

                <div className={'user-panel__body'}>
                    {
                        this.props.loading ?
                            <MiniPreloader/>
                            :
                            this.state.activeTab === 'current-tab'
                                ? <List
                                    orderList={this.props.arrOfLists[0].orderList}
                                    type={this.props.arrOfLists[0].type}
                                    soughtId={this.props.arrOfLists[0].soughtId}
                                    cancelOrder={this.props.cancelOrder}
                                    setEditItem={this.props.setEditItem}
                                    remove={this.props.remove}
                                    changeOrderData={this.props.changeOrderData}
                                    reOrder={this.props.reOrder}
                                />
                                : this.state.activeTab === 'finish-tab'
                                ? <List
                                    orderList={this.props.arrOfLists[1].orderList}
                                    type={this.props.arrOfLists[1].type}
                                    soughtId={this.props.arrOfLists[1].soughtId}
                                    cancelOrder={this.props.cancelOrder}
                                    setEditItem={this.props.setEditItem}
                                    remove={this.props.remove}
                                    changeOrderData={this.props.changeOrderData}
                                    reOrder={this.props.reOrder}
                                />
                                : <p className={'placeholder'}>Ничего не выбрано!</p>
                    }
                </div>
            </div>
        )
    }
}