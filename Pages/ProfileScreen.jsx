import { View, Text } from 'react-native'
import React, { useContext, useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native';
import { BACKEND_URI, UserContext } from '../Components/Root';
import { Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import About from './ProfileComp/About';
import MyPosts from './ProfileComp/MyPosts';
export const opt = ["Posts", "Comments", "About"]
const ProfileScreen = ({ route, navigation }) => {
    let { logoutUser, user, loading: loadUser } = useContext(UserContext)
    let time = new Date(user?.birthDate)
    let [tab, setTab] = useState(opt[0])
    let handlerBack = () => {
        navigation.navigate("AuthorisedScreen")
    }
    let handlerLogout = () => {
        logoutUser()
    }
    return (
        <LinearGradient colors={['white', 'green']} className="flex-1">
            <LinearGradient colors={['green', 'transparent']} className="flex-row justify-between items-center pt-5 px-5 pb-20 pr-2">
                <SafeAreaView className="flex-1 flex-row justify-between items-center mb-5">


                    <View className="rounded-3xl border-2 border-white overflow-hidden w-fit">
                        <Pressable className="justify-center items-center" android_ripple={{ color: "green" }} onPress={handlerBack}>
                            <Icon name="keyboard-backspace" size={35} color="white" />
                        </Pressable>
                    </View>
                    <Text className="text-white font-semibold text-2xl left-3">Profile</Text>
                    <View className="rounded-full overflow-hidden">
                        <Pressable className="flex-row p-1 gap-2 items-center" onPress={handlerLogout}>
                            <Text className="text-white text-sm">Logout</Text>
                            <Icon name="logout" size={30} color="white" />
                        </Pressable>
                    </View>
                </SafeAreaView>
            </LinearGradient>
            <SafeAreaView>
                {
                    loadUser ?
                        <View className="justify-center items-center h-[240px]">
                            <ActivityIndicator size={70} color="green" />
                        </View> :
                        <View className="-mt-32 flex-row items-center pl-5 mb-5">

                            <View className="mx-auto  overflow-hidden rounded-[200px] border-4 border-green-900 h-40 w-40">
                                <Image
                                    className="h-full w-full"
                                    source={{
                                        uri: `${user?.photoURL || "https://media.istockphoto.com/id/526947869/vector/man-silhouette-profile-picture.jpg?s=612x612&w=0&k=20&c=5I7Vgx_U6UPJe9U2sA2_8JFF4grkP7bNmDnsLXTYlSc="}`
                                    }}
                                    fadeDuration={1000}
                                />
                            </View>
                            <View className="flex-col p-2">
                                <Text className="w-[200px] text-center font-semibold text-xl text-blue-900">@{user?.userName || "No Name"}</Text>
                                <Text className="text-center italic text-xl mb-3">{time.toLocaleDateString() || "No Birthdate"}</Text>
                                <Text className="text-center">Country: {user?.address?.Country || "-----"}</Text>
                                <Text className="text-center">Division: {user?.address?.Division || "-----"}</Text>
                                <Text className="text-center">District: {user?.address?.District || "-----"}</Text>
                            </View>
                        </View>
                }
            </SafeAreaView>
            <View className="flex-1 ">
                <View className="flex-row">
                    {
                        opt.map(option => <View className="flex-1 border-2 border-b-transparent rounded-t-3xl border-green-900 overflow-hidden" key={option}>
                            <Pressable onPress={() => setTab(option)}>
                                <Text className={`text-center text-xl py-3 ${tab === option ? 'bg-green-900 text-green-200' : 'text-green-900'}`}>{option}</Text>
                            </Pressable>
                        </View>
                        )
                    }
                    {/* <View className="flex-1 border-t-4 rounded-t-3xl border-green-900 overflow-hidden">
                        <Pressable onPress={() => setTab('comments')}>
                            <Text className={`text-center text-xl py-3 ${tab === 'comments' ? 'bg-green-900 text-green-200' : 'text-green-900'}`}>Comments</Text>
                        </Pressable>
                    </View> */}
                </View>
                <View className="bg-green-900 p-2 flex-1">
                    {/* {tab === 'comments' && <MyComments />} */}
                    {tab === 'Posts' && <MyPosts />}

                    {tab === 'About' && <About />}
                </View>
            </View>

        </LinearGradient>
    )
}

export default ProfileScreen