import React, {Component} from 'react'
import './AdminPanelWithOrders.scss'
import List from '../RenderOrderList/List'

export default class AdminPanelWithOrders extends Component {
    constructor(props) {
        super(props)
        this.findOrder = React.createRef()
        this.selectId = React.createRef()
        this.selectSort = React.createRef()
    }

    state = {
        menuIsOpen: false,
        filters: []
    }

    interactWithMenu = () => {
        this.setState({
            menuIsOpen: !this.state.menuIsOpen
        })
    }

    find = () => {
        this.props.fetchOrderList('sample', this.selectId.current.value, this.findOrder.current.value, [-1, 0, 1, 2, 3, 4])
    }

    onChecked = (e) => {
        const filters = this.state.filters
        if(e.target.checked) {
            filters.push(parseInt(e.target.id))
        }
        else {
            const index = filters.indexOf(0)
            filters.splice(index, 1)
        }
        this.setState({
            filters
        })
        if (filters.length > 0)
            this.props.fetchOrderList('sample', 'all', null, filters, 0)
    }

    increaseNumberElements = async () => {
        const orderList = this.selectSort.current && this.selectSort.current.value === 'ascendingOrder' ? this.props.orderList : this.props.orderList.reverse()
        if (!this.props.isEnd) {
            await this.props.fetchOrderList('sample', 'all', null, this.state.filters,
                orderList.length !== 0 ? orderList[orderList.length - 1].id : 0)
        }
    }

    renderOrderList = () => {
        const orderList = this.selectSort.current && this.selectSort.current.value === 'ascendingOrder' ? this.props.orderList : this.props.orderList.reverse()
        return (
            <List
                orderList={orderList}
                type={'admin'}
                cancelOrder={this.props.cancelOrder}
                setEditItem={this.props.setEditItem}
                remove={this.props.remove}
                changeOrderData={this.props.changeOrderData}
                increaseNumberElements={this.increaseNumberElements}
                loading={this.props.loading}
            />
        )
    }

    renderFilters = () => {
        return (
            <div className={'admin-panel__panel'}>
                <div className={'admin-panel__filters'}>
                    <div className={'admin-panel__filters-title admin-panel__filters-title_h'}>
                    <span>
                        Фильтры
                    </span>
                    </div>
                    <div className={'select'}>
                        <select ref={this.selectSort} className="select__content">
                            <option value={'ascendingOrder'}>Сначала новые</option>
                            <option value={'descendingOrder'}>Сначала старые</option>
                        </select>
                    </div>

                    <div className={'checkbox mb-15'}>
                        <input id={0}
                               onClick={this.onChecked}
                               type="checkbox" name="todo" defaultValue={'true'}/>
                        <label className={'checkbox__label_mini'} htmlFor="todo">
                            В ожидании
                        </label>
                    </div>
                    <div className={'checkbox mb-15'}>
                        <input id={1}
                               onClick={this.onChecked}
                               type="checkbox" name="todo"/>
                        <label className={'checkbox__label_mini'} htmlFor="todo">
                            Закупка
                        </label>
                    </div>
                    <div className={'checkbox mb-15'}>
                        <input id={2}
                               onClick={this.onChecked}
                               type="checkbox" name="todo"/>
                        <label className={'checkbox__label_mini'} htmlFor="todo">
                            Доставка
                        </label>
                    </div>
                    <div className={'checkbox mb-15'}>
                        <input id={3}
                               onClick={this.onChecked}
                               type="checkbox" name="todo"/>
                        <label className={'checkbox__label_mini'} htmlFor="todo">
                            Завершённые
                        </label>
                    </div>
                    <div className={'checkbox mb-15'}>
                        <input id={4}
                               onClick={this.onChecked}
                               type="checkbox" name="todo"/>
                        <label className={'checkbox__label_mini'} htmlFor="todo">
                            Отменённые
                        </label>
                    </div>
                    <div className={'checkbox mb-15'}>
                        <input id={5}
                               onClick={this.onChecked}
                               type="checkbox" name="todo"/>
                        <label className={'checkbox__label_mini'} htmlFor="todo">
                            Троллинг
                        </label>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className={'admin-panel'}>
                <div className={'admin-panel__main'}>
                    <div className={'admin-panel__search'}>
                        <div className={'admin-panel__search-string'}>
                            <input ref={this.findOrder} placeholder={'Поиск заказа по id'} type="text"/>
                            <i className="fa fa-search fa-animate" aria-hidden="true" onClick={this.find}></i>
                        </div>
                        <div className={'admin-panel__search-select'}>
                            <div className={'select'}>
                                <select ref={this.selectId} className="select__content">
                                    <option value={'orderId'}>заказа</option>
                                    <option value={'courierId'}>курьера</option>
                                    <option value={'userId'}>пользователя</option>
                                </select>
                            </div>
                            <div
                                onClick={this.interactWithMenu}
                                className="toggle-menu d-block d-sm-none">
                                ☰
                            </div>
                        </div>
                    </div>
                    <div className={'d-block d-sm-none'}>
                        <div className={this.state.menuIsOpen ? 'admin-panel__menu-mobile' : 'd-none'}>
                            {
                                this.renderFilters()
                            }
                        </div>
                        {
                            this.state.menuIsOpen
                                ? null
                                : <div className={'admin-panel__content'}>
                                    {
                                        this.renderOrderList()
                                    }
                                </div>
                        }
                    </div>
                    <div className={'d-none d-sm-block'}>
                        <div className={'admin-panel__content'}>
                            {
                                this.renderOrderList()
                            }
                        </div>
                    </div>
                </div>

                <div className={'admin-panel__menu d-none d-sm-block'}>
                    {
                        this.renderFilters()
                    }
                </div>
            </div>
        )
    }
}
