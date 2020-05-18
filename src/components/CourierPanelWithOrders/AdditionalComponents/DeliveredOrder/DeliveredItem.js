import React, {Component} from 'react'

export default class DeliveredItem extends Component {
    state={
        itemListIsOpen: false
    }

    openListHandler = () => {
        this.setState({
            itemListIsOpen: !this.state.itemListIsOpen
        })
    }

    interactWithCheckBox = (e) => {
        this.props.interactWithPurchased(e.target.id, e.target.checked)
    }

    render(){
        const product = this.props.product
        const shortItem = `${product.name} ${product.quantity}`
        return (
            <div className="courier-panel__item">
                <div className={'checkbox'}>
                    <input
                        onClick={this.interactWithCheckBox}
                        defaultChecked={product.purchased === true ? 'checked' : ''}
                        type="checkbox" id={product.id} name="todo"/>
                    <label htmlFor="todo" data-content={shortItem} className={!this.state.itemListIsOpen ? '' : 'hide'}>
                        {shortItem}
                    </label>
                    <label htmlFor="todo" className={this.state.itemListIsOpen ? 'g' : 'hide'}>
                        <ul>
                            <li>{product.name}</li>
                            <li>{product.brand !== undefined ? product.brand : ''}</li>
                            <li>{product.quantity}</li>
                            <li>{product.price}</li>
                            <li>{product.description}</li>
                        </ul>
                    </label>
                    <i className={`fa fa-caret-${!this.state.itemListIsOpen ? 'down' : 'up fa_down'}`}
                       aria-hidden="true" onClick={this.openListHandler}/>
                </div>
            </div>
        )
    }
}