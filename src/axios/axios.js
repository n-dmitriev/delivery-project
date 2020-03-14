import axios from 'axios'

export default axios.create({
    baseURL: 'https://delivery-project-f94f6.firebaseio.com/'
})