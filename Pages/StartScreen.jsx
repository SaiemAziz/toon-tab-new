import { View, Text } from 'react-native'
import React, { useContext, useLayoutEffect } from 'react'
import Lottie from 'lottie-react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { StackActions } from '@react-navigation/native'
import { BACKEND_URI, UserContext } from '../Components/Root'

const StartScreen = ({ navigation, route }) => {
    let { user, loading } = useContext(UserContext)
    useLayoutEffect(() => {
        let func = async () => {
            navigation.dispatch(
                StackActions.replace(user ? 'AuthorisedScreen' : 'WelcomeScreen')
            );
        }
        if (!loading)
            setTimeout(() => {
                func();
            }, 5000);
    }, [loading])
    return (
        <LinearGradient colors={["lightblue", "darkblue"]} className="flex-1 bg-blue-400">
            <Lottie
                autoPlay
                loop
                className="opacity-90 left-2"
                // Find more Lottie files at https://lottiefiles.com/featured
                source={require('../assets/images/106889-earkick-welcome-animation.json')}
            />
        </LinearGradient>
    )
}

export default StartScreen