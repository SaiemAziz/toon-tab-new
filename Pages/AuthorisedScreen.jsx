import { View, Text, StatusBar, useWindowDimensions, Image } from 'react-native'
import React, { useContext, useLayoutEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import Icon from 'react-native-vector-icons/AntDesign';
import { Pressable } from 'react-native'
import Videos from './TabScreens/Videos';
import Posts from './TabScreens/Posts';
import About from './TabScreens/About';
import { BACKEND_URI, UserContext } from '../Components/Root';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthorisedScreen = ({ route, navigation }) => {
    // let dimention = useWindowDimensions();
    // console.log(dimention);
    let { user } = useContext(UserContext)
    // if (!user) {
    //     navigation.navigate('Login')
    // }
    let tabs = [
        {
            name: "Posts",
            icon: "filetext1"
        },
        {
            name: "Videos",
            icon: "youtube"
        },
        {
            name: "About",
            icon: "enviromento"
        }
    ]
    let [tab, setTab] = useState(tabs[0].name)

    let handlerProfile = () => {
        navigation.navigate('ProfileScreen')
    }
    let handlerCamera = () => {
        navigation.navigate('ImageScreen')
    }

    return (
        <LinearGradient colors={["white", "purple"]} className="flex-1">
            <SafeAreaView className="flex-1  justify-center items-center">

                <View className="flex-1 w-full">
                    <View className={`flex-row justify-between p-5 w-full fixed z-50`}>
                        <View className="rounded-full overflow-hidden w-fit">
                            <Pressable className="justify-center items-center" onPress={handlerCamera}>
                                <Icon name="camera" size={45} color="purple" />
                            </Pressable>
                        </View>
                        <Text className="text-center text-xl bg-purple-900 text-purple-100 p-3 rounded-tl-full rounded-br-full flex-1 mx-5 font-semibold italic">
                            {tab === 'Videos' && 'Youtube Videos'}
                            {tab === 'Posts' && 'Posts'}
                            {tab === 'About' && 'About Us'}
                        </Text>
                        <View className="rounded-full overflow-hidden scale-90">
                            <TouchableOpacity className="justify-center p-3 bg-purple-800 items-center" onPress={handlerProfile}>
                                <Icon name="user" size={28} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View className="flex-1">
                        {tab === 'Videos' && <Videos />}
                        {tab === 'Posts' && <Posts />}
                        {tab === 'About' && <About />}
                    </View>
                </View>
                <View className="w-full flex-row gap-0">
                    {
                        tabs.map(i => (
                            <View key={i.name} className=" flex-1 ">
                                <Pressable className={` flex-row  justify-center items-center p-3 pb-5 ${tab === i.name && "bg-purple-950 scale-125 rounded-t-xl"}`} onPress={() => setTab(i.name)}>
                                    <Icon name={i.icon} size={15} color="white" />
                                    <Text className="text-white ml-2">{i.name}</Text>
                                </Pressable>
                            </View>
                        ))
                    }
                </View>
            </SafeAreaView>
        </LinearGradient>
    )
}

export default AuthorisedScreen