import {AUTH_ERROR, AUTH_LOGOUT, AUTH_OK, AUTH_SUCCESS} from './actionTypes'
import {fetchUserInfo} from './userInformation'
import {authWithFirebase, dataBase} from '../../firebase/firebase'
import {dispatchAction} from './universalFunctions'

export function auth(email, password, isLogin, collectionType) {
    return async dispatch => {
        try {
            if(isLogin)
                await authWithFirebase.signInWithEmailAndPassword(email, password)
            else
                await authWithFirebase.createUserWithEmailAndPassword(email, password)

            authWithFirebase.onAuthStateChanged(async (user) => {
                if (user) {
                    const collection = dataBase.collection(collectionType)
                    if(isLogin){
                        const answer = await collection.doc(user.uid).get()
                        const data = answer.data()

                        if(data === undefined){
                            dispatch(dispatchAction(AUTH_ERROR, null))
                            return
                        }
                    }
                    else {
                        const info = {
                            name: '',
                            numberPhone: '',
                            address: '',
                            email: email,
                            role: 'user',
                            listOfDeliveredOrders: [],
                            listOfCurrentOrders: [],
                        }
                        await collection.doc(user.uid).set(info)
                        dispatch(fetchUserInfo())
                    }

                    const path = collectionType === 'users' ? '/user-account/' : '/courier-account/'

                    dispatch(dispatchAction(AUTH_SUCCESS, {id: user.uid, path}))
                    localStorage.setItem('id', JSON.stringify(user.uid))
                    localStorage.setItem('path', JSON.stringify(path))
                    dispatch(fetchUserInfo())
                } else {
                    new Error('Карамба, что-то пошло не так!')
                }
            })
        } catch (e) {
            console.log(e)
            dispatch(dispatchAction(AUTH_ERROR, null))
        }

    }
}

export function removeError() {
    return {
        type: AUTH_OK,
    }
}

export function logout() {
    localStorage.clear()
    return {
        type: AUTH_LOGOUT,
    }
}

/*const authData = {
                email, password,
                returnSecureToken: true,
            }
            let url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${config.apiKey}`

            if (isLogin)
                url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${config.apiKey}`
            const response = await axios.post(url, authData)*/