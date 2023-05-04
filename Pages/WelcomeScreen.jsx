import { View, Text, Pressable } from 'react-native'
import React, { useContext, useLayoutEffect } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Image } from 'react-native'
import { StackActions } from '@react-navigation/native'
import { BACKEND_URI, UserContext } from '../Components/Root'
import { SafeAreaView } from 'react-native-safe-area-context'

const WelcomeScreen = ({ navigation, router }) => {
    let { user } = useContext(UserContext)
    // console.log(user);
    // useLayoutEffect(() => {
    //     if (user)
    //         navigation.dispatch(
    //             StackActions.replace('AuthorisedScreen')
    //         );
    // }, [user])
    let handleLogin = () => {
        navigation.dispatch(
            StackActions.replace('Login')
        );
    }
    let handleRegister = () => {
        navigation.dispatch(
            StackActions.replace('Register')
        );
    }
    return (
        <LinearGradient colors={["white", "#366e46"]} className="flex-1 bg-blue-400 ">
            <SafeAreaView className="flex-1 justify-center items-center gap-10 p-20">

                <View className="border-4 p-5 px-10 rounded-full border-green-700 justify-center items-center">
                    <Text className="text-green-900 text-xl font-semibold">Welcome to</Text>
                    <Text className="text-green-900 text-3xl font-semibold">Toon Tab</Text>
                </View>
                <Image
                    source={require('../assets/images/kungfu_panda_2.png')}
                    fadeDuration={1000}
                    className="h-80"
                    resizeMode="contain"
                />

                <View className="flex-row w-full justify-between">
                    <View className="rounded-full overflow-hidden bg-green-900">
                        <Pressable className="p-3 px-7 " android_ripple={{ color: "green" }} onPress={handleLogin}>
                            <Text className="text-xl text-green-200">Login</Text>
                        </Pressable>
                    </View>
                    <View className="rounded-full overflow-hidden bg-green-900">
                        <Pressable className="p-3 px-7 " android_ripple={{ color: "green" }} onPress={handleRegister}>
                            <Text className="text-xl text-green-200">Register</Text>
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    )
}

export default WelcomeScreen