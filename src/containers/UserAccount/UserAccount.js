import React, {Component} from 'react'
import './PersonalAccount.scss'
import {connect} from 'react-redux'

class PersonalAccount extends Component {
    render(){
        return(
            <div className={''}>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return{

    }
}

function mapDispatchToProps(dispatch) {
    return{

    }
}

export default connect(mapStateToProps,mapDispatchToProps)(PersonalAccount)