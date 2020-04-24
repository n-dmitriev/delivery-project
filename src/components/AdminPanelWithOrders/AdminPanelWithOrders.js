import React, {Component} from 'react'
import './AdminPanelWithOrders.scss'
import List from '../RenderOrderList/List'

export default class AdminPanelWithOrders extends Component {
    constructor(props) {
        super(props)
        this.findOrder = React.createRef()
        this.selectId = React.createRef()
        this.selectSort = React.createRef()
        this.statusZero = React.createRef()
        this.statusOne = React.createRef()
        this.statusTwo = React.createRef()
        this.statusThree = React.createRef()
        this.statusFour = React.createRef()
        this.statusTroll = React.createRef()
    }

    state = {
    }

    find = () => {
        this.props.fetchOrderList('sample', this.selectId.current.value, this.findOrder.current.value, [-1, 0, 1, 2, 3, 4])
    }

    sort = () => {
        const filters = []

        if(this.statusTroll.current.checked)
            filters.push(-1, 5)
        if(this.statusZero.current.checked)
            filters.push(0)
        if(this.statusOne.current.checked)
            filters.push(1)
        if(this.statusTwo.current.checked)
            filters.push(2)
        if(this.statusThree.current.checked)
            filters.push(3)
        if(this.statusFour.current.checked)
            filters.push(4)

        this.props.fetchOrderList('sample', 'all', null, filters)
    }

    renderOrderList = () => {
        const orderList = this.selectSort.current && this.selectSort.current.value === 'ascendingOrder' ? this.props.orderList : this.props.orderList.reverse()
        return (
            <List
                orderList={orderList}
                soughtId={'courierId'}
                type={'all'}
                cancelOrder={this.props.cancelOrder}
                setEditItem={this.props.setEditItem}
                remove={this.props.remove}
                changeOrderData={this.props.changeOrderData}
            />
        )
    }

    render() {
        return (
            <div className={'admin-panel'}>
                <div className={'admin-panel__main'}>
                    <div className={'admin-panel__search'}>
                        <input ref={this.findOrder} placeholder={'Поиск заказа по id'} type="text"/>
                        <i className="fa fa-search fa-animate" aria-hidden="true" onClick={this.find}></i>
                        <div className={'select mb-30'}>
                            <select ref={this.selectId} className="select__content">
                                <option value={'orderId'}>заказа</option>
                                <option value={'courierId'}>курьера</option>
                                <option value={'userId'}>пользователя</option>
                            </select>
                        </div>
                    </div>
                    <div className={'admin-panel__content'}>
                        {
                            this.renderOrderList()
                        }
                    </div>
                </div>
                <div className={'admin-panel__menu'}>
                    <div className={'admin-panel__filters'}>
                        <div className={'admin-panel__filters-title admin-panel__filters-title_h'}>
                    <span>
                        Фильтры
                    </span>
                        </div>
                        <div className={'select mb-30'}>
                            <select ref={this.selectSort} className="select__content">
                                <option value={'ascendingOrder'}>Сначала новые</option>
                                <option value={'descendingOrder'}>Сначала старые</option>
                            </select>
                        </div>

                        <div className={'checkbox mb-15'}>
                            <input ref={this.statusZero}
                                   type="checkbox" name="todo" defaultValue={'true'}/>
                            <label className={'checkbox__label_mini'} htmlFor="todo">
                                В ожидании
                            </label>
                        </div>
                        <div className={'checkbox mb-15'}>
                            <input ref={this.statusOne}
                                   type="checkbox" name="todo"/>
                            <label className={'checkbox__label_mini'} htmlFor="todo">
                                Закупка
                            </label>
                        </div>
                        <div className={'checkbox mb-15'}>
                            <input ref={this.statusTwo}
                                   type="checkbox" name="todo"/>
                            <label className={'checkbox__label_mini'} htmlFor="todo">
                                Доставка
                            </label>
                        </div>
                        <div className={'checkbox mb-15'}>
                            <input ref={this.statusThree}
                                   type="checkbox" name="todo"/>
                            <label className={'checkbox__label_mini'} htmlFor="todo">
                                Завершённые
                            </label>
                        </div>
                        <div className={'checkbox mb-15'}>
                            <input ref={this.statusFour}
                                   type="checkbox" name="todo"/>
                            <label className={'checkbox__label_mini'} htmlFor="todo">
                                Отменённые
                            </label>
                        </div>
                        <div className={'checkbox mb-15'}>
                            <input ref={this.statusTroll}
                                   type="checkbox" name="todo"/>
                            <label className={'checkbox__label_mini'} htmlFor="todo">
                                Троллинг
                            </label>
                        </div>
                    </div>
                    <div onClick={this.sort} className={'admin-panel__button'}>
                        Поиск
                    </div>
                </div>
            </div>
        )
    }
}
