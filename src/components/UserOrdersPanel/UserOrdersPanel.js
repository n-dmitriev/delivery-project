import React, {Component} from 'react'
import './UserOrdersPanel.scss'
import List from '../RenderOrderList/List'
import TabPanel from '../UI/TabPanel/TabPanel'

export default class UserOrdersPanel extends Component {
    state = {
        activeTab: 'active-tab'
    }

    clickItemHandler = (event) => {
        this.setState({
            activeTab: event.target.id,
        })
    }



    render() {
        return (
            <div className={'user-panel'}>
               <TabPanel

               />
            </div>
        )
    }
}