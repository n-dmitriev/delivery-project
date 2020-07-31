import {dataBase} from '../../firebase/firebase'

export const accessCheck = async (adminId = null, userId = null, path = '', number = '', type = '') => {
    let access = false
    const shortType = type.split('-')[1]

    if (adminId !== null && type === 'admin') {
        const docRef = dataBase.collection('appData').doc(this.props.adminId)
        const answer = await docRef.get()
        const data = answer.data()

        if (data !== undefined && data.role === 'admin') {
            access = true
        }
    } else if (path === '/user-account/' && shortType === 'user' && userId) {
        const userOrders = dataBase.collection('user-orders')
        const answer = await userOrders.where('userId', '==', userId)
            .where('orderId', '==', number).get()
        answer.forEach((doc) => {
            const data = doc.data()
            if (data !== undefined)
                access = true
        })
    } else if (path === '/courier-account/' && shortType === 'courier' && userId) {
        const userOrders = dataBase.collection('courier-orders')
        const answer = await userOrders.where('courierId', '==', userId)
            .where('orderId', '==', number).get()
        answer.forEach((doc) => {
            const data = doc.data()
            if (data !== undefined)
                access = true
        })
    }

    return access
}

export const subscribe = (id, updateOrderInfo) => {
    return dataBase.collection('orders').doc(id)
        .onSnapshot((change) => {
            const data = change.data()
            updateOrderInfo(data)
        })
}