import { View, Text, SafeAreaView, Pressable, ScrollView, Image, TextInput, FlatList, Modal, ActivityIndicator } from 'react-native'
import React, { useContext, useLayoutEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
// import { Colors } from '../utilities/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { BACKEND_URI, UserContext } from '../Components/Root';
// import Comment from './TabScreens/Comments';
const Details = ({ navigation, route }) => {
    let { user } = useContext(UserContext)
    let item = route?.params
    let { image, details, authorEmail, time, title, _id } = item
    time = new Date(time)
    let modifiedDetails = details.split(". ")
    let [postAuthor, setPostAuthor] = useState(null)
    let [comments, setComments] = useState([])
    let [myComment, setMyComment] = useState('')
    let [load, setLoad] = useState(false)
    useLayoutEffect(() => {
        setLoad(true)
        fetch(BACKEND_URI + `/my-user?email=${authorEmail}`)
            .then(res => res.json())
            .then(data => {
                setPostAuthor(data)
                setLoad(false)
            })
    }, [])

    let handlerBack = () => {
        navigation.navigate("AuthorisedScreen")
    }

    let handlerComment = () => {
        navigation.navigate("CommentScreen", { postID: _id, item })
    }



    return (
        <LinearGradient className="flex-1 pt-7" colors={['white', 'orange']}>

            <View className="flex-row justify-between p-5 ">
                <View className="rounded-full overflow-hidden w-fit">
                    <Pressable className="justify-center items-center" android_ripple={{ color: "darkorange" }} onPress={handlerBack}>
                        <Icon name="arrow-back-circle" size={45} color="orange" />
                    </Pressable>
                </View>
                <Text className="text-center text-xl bg-orange-400 text-white p-3 rounded-tl-full rounded-br-full flex-1 mx-5">
                    DETAILS
                </Text>
                <View className="rounded-full overflow-hidden w-fit">
                    <Pressable className="justify-center items-center" android_ripple={{ color: "darkorange" }} onPress={handlerComment}>
                        <Icon name="chatbox-ellipses" size={45} color="orange" />
                    </Pressable>
                </View>
            </View>
            <ScrollView className="mb-7 px-5">
                <Text className="text-center mb-5 text-3xl font-bold text-orange-900">
                    {title}
                </Text>
                <Image
                    source={{
                        uri: image
                    }}
                    className="w-full h-56 rounded-2xl"
                    resizeMode="contain"
                />
                <View className="my-5 flex-row justify-between items-center">
                    {
                        load ?
                            <View className="justify-center items-center flex-1">
                                <ActivityIndicator size={50} color="darkorange" />
                            </View> :
                            <View className="flex-row gap-2 items-center">
                                <Image
                                    source={{
                                        uri: postAuthor?.photoURL
                                    }}
                                    className="h-16 w-16 rounded-full"
                                />
                                <Text className="text-sm font-bold text-white bg-orange-500 rounded-full px-3 py-2">@{postAuthor?.userName}</Text>
                            </View>
                    }
                    <View>

                        <Text className="text-orange-900 italic font-semibold">{time.toLocaleDateString()} </Text>
                        <Text className="text-orange-900 italic font-semibold">{time.toLocaleTimeString('en-US')}</Text>
                    </View>
                </View>
                <Text className="mb-5 text-justify text-lg text-slate-700 ">
                    {modifiedDetails}
                </Text>
                {/* <Text className="mb-5 text-justify text-lg text-slate-700 ">
                    {modifiedDetails.slice(1, 2)}
                </Text> */}

            </ScrollView>

            {/* <Modal visible={showComment} animationType="slide">
               

            </Modal> */}


        </LinearGradient>
    )
}

export default Details
