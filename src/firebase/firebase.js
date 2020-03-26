import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import {config} from './config'

export const f = firebase.initializeApp(config)
export const dataBase = firebase.firestore()
export const authWithFirebase = firebase.auth()