import React, {Component} from 'react'

export default class Item extends Component {
    state={
        itemListIsOpen: false
    }

    openListHandler = () => {
        this.setState({
            itemListIsOpen: !this.state.itemListIsOpen
        })
    }

    render(){
        const product = this.props.product
        return(
            <div className={'list__unwrapping-item'}>
                <ul className={!this.state.itemListIsOpen ? 'list__product-list' : 'hide'}>
                    <li>{product.name}</li>
                    <li>{product.quantity}</li>
                    <i className="fa fa-caret-down fa-animate" aria-hidden="true" onClick={this.openListHandler}/>
                </ul>

                <ul className={this.state.itemListIsOpen ? 'list__product-list_g' : 'hide'}>
                    <li>{product.name}</li>
                    {
                        product.brand !== undefined ? <li>{product.brand}</li> : ''
                    }
                    <li>{product.quantity}</li>
                    <li>{product.price}</li>
                    <li>{product.description}</li>
                    <i className="fa fa-caret-up fa-animate" aria-hidden="true" onClick={this.openListHandler}/>
                </ul>

                <div className={'list__checkbox'}>
                    {
                        this.props.status !== 0
                            ?
                            product.purchased
                                ? <i className="fa fa-check-square-o" aria-hidden="true"/>
                                : <i className="fa fa-times" aria-hidden="true"/>
                            :
                            <i className="fa fa-square-o" aria-hidden="true"/>
                    }
                </div>
            </div>
        )
    }
}