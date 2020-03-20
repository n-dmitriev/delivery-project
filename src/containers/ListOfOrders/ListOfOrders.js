import React, {Component} from 'react'
import './ListOfOrders.scss'
import {connect} from 'react-redux'
import {fetchList} from '../../store/actions/orders'

//Данный компонент должен отвечать за рендеринг списка товаров, но поскольку такового нет, он не использутеся
class ListOfOrders extends Component {
    componentDidMount() {
        this.props.fetchList()
    }

    renderList(){
        console.log(this.props)
    }

    render(){
        return(
            <div className={''}>
                {this.renderList()}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return{
        productList: state.products.productList,
        load: state.products.loading
    }
}

function mapDispatchToProps(dispatch) {
    return{
        fetchList: () => dispatch(fetchList())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ListOfOrders)