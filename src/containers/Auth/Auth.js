import React, {Component} from 'react'
import './Auth.scss'
import {connect} from 'react-redux'

class Auth extends Component {
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

export default connect(mapStateToProps,mapDispatchToProps)(Auth)