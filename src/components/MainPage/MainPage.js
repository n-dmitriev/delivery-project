import React, {Component} from 'react'
import './MainPage.scss'
import Footer from '../UI/Footer/Footer'
import InputPosition from '../InputInformation/InputPosition'
import basket from '../../img/basket.jpg'
import expert from '../../img/expert.jpg'
import bags from '../../img/bags.jpg'

export default class MainPage extends Component {
    constructor(props) {
        super(props)
        document.title = 'EasyWays | Сервис доставки еды по г. Вологда'
    }


    render() {
        return (
            <div className={'main-page'}>
                <div className={'main-page__title'}/>

                <div className={'main-page__qualities'}>
                    <div className="row">
                        <div className="col-6 col-sm-6 col-md-4 main-page__quality">
                            <div className={'main-page__five-star fa-animate'}>
                                <i className="fa fa-star-o" aria-hidden="true"/><i className="fa fa-star-o"
                                                                                   aria-hidden="true"/>
                                <i className="fa fa-star-o" aria-hidden="true"/><i className="fa fa-star-o"
                                                                                   aria-hidden="true"/>
                                <i className="fa fa-star-o" aria-hidden="true"/>
                            </div>
                            <span>Удобство</span>
                        </div>
                        <div className="col-6 col-sm-6 col-md-4 main-page__quality">
                            <i className="fa fa-thumbs-o-up fa-animate" aria-hidden="true"/>
                            <span>Качество</span>
                        </div>
                        <div className="col-12 col-sm-12 col-md-4 main-page__quality">
                            <i className="fa fa-bolt fa-animate" aria-hidden="true"/>
                            <span>Скорость</span>
                        </div>
                    </div>
                </div>

                <div className={'main-page__container text-center'}>
                    Мы уникальный онлайн сервис доставки продуктов питания из любых продовольственных
                    магазинов города Вологды. Для заказа Вам необходимо лишь заполнить удобную форму на сайте, всё
                    остальное
                    сделаем мы.
                    <hr/>
                </div>

                <figure className="fixed-wrap"/>

                <h1 className={'text-center mb-30'}>Почему именно мы?</h1>
                <div className={'main-page__container text-center'}>
                    Наша команда организует быструю доставку продуктов питания по многим районам города Вологда.
                    Доставка осуществляется в указанное время в указанное место с интервалом в 1 час. Мы доставим заказ
                    день
                    в день или, в удобное время в течение недели.
                </div>
                <InputPosition options={{isEdit: false, type: 'landing'}}/>

                <div className={'main-page__container text-center mt-30 mb-30'}>
                    Удобная <i>форма заказа</i> на сайте позволит вам без лишних усилий составить уникальный список
                    покупок.
                    <hr/>
                </div>

                <div className={'main-page__container'}>
                    <div className="row">
                        <div className="col-xs-12 col-md-6 col-xl-4 main-page__container-img text-center">
                            Продукты отбирают специально обученные эксперты для того, чтобы Вы могли не задумываться о
                            качестве
                            заказанных товаров.
                            <img className={'mt-30'} src={expert} alt=""/>
                        </div>
                        <div className="col-xs-12 col-md-6 col-xl-4 main-page__container-img text-center">
                            <img className={'mb-1'} src={basket} alt=""/>
                            Эксперты знают, как быстро найти лучшие фрукты и овощи, проверить сроки годности
                            и правильно упаковать заказ, чтобы продукты приехали к Вам так, как будто Вы только что
                            взяли их с
                            полки магазина.
                        </div>
                        <div className="col-xs-12 col-md-12 col-xl-4 main-page__container-img text-center">
                            Поможем с тяжёлыми сумками
                            С EasyWays Вам не придётся задумываться о тяжёлых сумках, наши курьеры донесут заказ до
                            двери.
                            <img className={'mt-30'} src={bags} alt=""/>
                        </div>
                    </div>
                    <hr/>
                </div>


                <figure className="fixed-wrap"/>

                <Footer/>
            </div>
        )
    }
}