import React, {Component} from 'react'
import './Header.scss'

class Header extends Component{
   render() {
       return (
           <header className={'header'}>
               <div className={'header__logo'}>
                   <span className={'header__title'}>Delivery Project</span>
               </div>
               <div className={'header__btn-section'}>
                   <button className={'main-item-style'} onClick={this.props.openOrderForm}>
                       Сделать заказ
                   </button>
                   {
                       this.props.isAuth === true
                           ? <div className={'header__user'}>
                               <i className="fa fa-user-circle-o" aria-hidden="true"></i>
                               <span className={'name'}>Никита</span>
                               <button className={'main-item-style'} onClick={this.props.logout}>Выйти</button>
                           </div>
                           : <button className={'main-item-style'} onClick={this.props.openAuthForm}>
                               Войти или создать аккаунт
                           </button>
                   }
               </div>
           </header>
       )
   }
}

export default Header