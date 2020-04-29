import React, {Component} from 'react'
import './Checkbox.scss'

export default class Checkbox extends Component {
    render(){
        console.log(this.props.ref)
        return(
            <div className={'checkbox mb-15'} id={this.props.id}>
                <input ref={this.props.ref}
                       type="checkbox"
                       name="todo"
                       defaultChecked={this.props.defaultChecked}
                       onClick={this.props.onClick}
                />
                <label className={'checkbox__label_mini'} htmlFor="todo"  data-content={this.props.cross ? this.props.label : null}>
                    {
                        this.props.label
                    }
                </label>
                {
                    this.props.isRequired
                    ?
                        <>
                            <br/>
                            <small
                                className={this.props.checkIsValid ? 'hide' : 'error'}>
                                Это обязательно!
                            </small>
                        </>
                        : null
                }
            </div>
        )
    }
}