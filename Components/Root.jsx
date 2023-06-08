import { View, Text } from 'react-native'
import React, { createContext, useEffect, useLayoutEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, updateProfile, onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import app from '../firebase/firebase.config'
import { StackActions, useNavigation } from '@react-navigation/native'
import { ToastAndroid } from 'react-native';
export const BACKEND_URI = "https://toon-tab-server.vercel.app"
// export const BACKEND_URI = "http://192.168.1.102:8000"
export const categories = ['all', 'cartoon', 'anime']

export const UserContext = createContext(null)
const Root = ({ children }) => {
    let navigation = useNavigation()
    let [user, setUser] = useState(null)
    let [loading, setLoading] = useState(true)
    const [remember, setRemember] = useState(false);


    const auth = getAuth(app)


    // check existing user according to remember
    useLayoutEffect(() => {
        let funcUserCheck = async (localUser) => {
            // console.log(localUser);
            if (localUser) {
                localUser = JSON.parse(localUser)
                setUser(localUser)
                setLoading(false)
            }
            else onAuthStateChanged(auth, async (currentUser) => {
                // console.log(currentUser);
                if (currentUser?.uid) {
                    if (currentUser?.emailVerified) {
                        let res = await fetch(BACKEND_URI + `/user-info?email=${currentUser?.email}`)
                        let data = await res.json()
                        if (data) {
                            // console.log(data);
                            setUser(data)
                            setLoading(false)
                            await AsyncStorage.setItem('user', JSON.stringify(data))
                        } else {
                            setUser(null)
                            setLoading(false)
                            logoutUser()
                        }
                    }
                    else {
                        setUser(null)
                        setLoading(false)
                        logoutUser()
                    }
                }
                else {
                    setUser(null)
                    setLoading(false)
                }
            }
            )
        }
        let func = async () => {
            setLoading(true)
            let localUser = await AsyncStorage.getItem('user')
            let localRem = await AsyncStorage.getItem('remember')
            await AsyncStorage.clear()
            setRemember(localRem ? true : false)
            if (localRem)
                funcUserCheck(localUser)
            else {
                setUser(null)
                setLoading(false)
            }
        }
        func()
    }, [])



    // set user in local storage
    useEffect(() => {
        let func = async () => {
            if (user)
                await AsyncStorage.setItem('user', JSON.stringify(user))
            else
                await AsyncStorage.removeItem('user')
        }
        func()
    }, [user])


    // register new USER
    let registerUser = async (email, password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password)
    }
    let sendVerification = async () => {
        sendEmailVerification(auth.currentUser)
            .then(() => {
                ToastAndroid.show('A verification sent to your email', ToastAndroid.SHORT);
            })
    }
    let updateUser = async (profileInfo) => {
        setLoading(true)
        return updateProfile(auth.currentUser, profileInfo)
    }

    let loginUser = async (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }
    let logoutUser = async () => {
        setLoading(true)
        signOut(auth)
            .then(async () => {
                setUser(null)
                setLoading(false)
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                })
                await AsyncStorage.removeItem('user')
            })
            .catch(async () => {
                setUser(null)
                setLoading(false)
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                })
                await AsyncStorage.removeItem('user')
            })
    }


    let contextValue = {
        user, loading, setLoading, registerUser, loginUser, setUser, updateUser, logoutUser, sendVerification, remember, setRemember
    }
    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    )
}

export default Root