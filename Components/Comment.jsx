import { View, Text, SafeAreaView, Pressable, ScrollView, Image, TextInput, FlatList, Modal, ActivityIndicator } from 'react-native'
import React, { useContext, useLayoutEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { UserContext } from './Root';

function Comment({ comment, load, handleDelete }) {
    let { user } = useContext(UserContext)
    let [author, setAuthor] = useState(comment?.author)
    // let [load, setLoad] = useState(true)
    let unix_timestamp = comment.time
    let time = new Date(unix_timestamp);
    let date = time.getDate();
    let month = time.getMonth() + 1;
    let year = time.getFullYear();
    // console.log(time.getDate() + '-' + (time.getMonth() + 1) + '-' + (time.getFullYear()))
    // if (load) {
    //     return <ActivityIndicator color="red" size="large" className="my-5" />
    // }
    // else
    return <View className="border-2 p-2 flex-row items-center border-white rounded-xl mt-3 bg-orange-200">
        <Image
            source={{
                uri: author?.photoURL || "https://media.istockphoto.com/id/526947869/vector/man-silhouette-profile-picture.jpg?s=612x612&w=0&k=20&c=5I7Vgx_U6UPJe9U2sA2_8JFF4grkP7bNmDnsLXTYlSc="
            }}
            fadeDuration={500}
            className="h-14 w-14 rounded-full mr-5"
        />
        <View className="flex-1">
            <View className="flex-row justify-between mb-2">
                <Text className="text-orange-700 font-bold italic text-xs">@{author?.userName}</Text>
                <Text className="text-xs" >{date < 10 ? '0' + date : date}-{month < 10 ? '0' + month : month}-{year}</Text>
            </View>
            <Text className="text-slate-500 text-justify" >{comment?.details}</Text>
        </View>
        {
            author?.email === user.email &&
            <View className="absolute -right-0 -top-3 bg-red-600 rounded-3xl p-1">
                <Pressable
                    className="bg-red"
                    android_ripple={{ color: 'orange' }}
                    onPress={() => handleDelete(comment._id)}>
                    <Icon
                        name="delete-outline"
                        size={18}
                        color="white"
                    />
                </Pressable>
            </View>
        }
    </View>
}

export default Comment