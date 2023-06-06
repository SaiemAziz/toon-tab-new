import { View, Text, Image, ScrollView, Alert, ToastAndroid } from 'react-native'
import { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Pressable } from 'react-native'
import Icon from 'react-native-vector-icons/Fontisto';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActivityIndicator } from 'react-native';
import { FlatList } from 'react-native';
// import AddPost from '../../Components/AddPost';
import { BACKEND_URI, UserContext, categories } from '../../Components/Root'

import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { SinglePost } from '../TabScreens/Posts';


const MyPosts = () => {
    let [showAdd, setShowAdd] = useState(false)
    let { user } = useContext(UserContext)
    let [cat, setCat] = useState(categories[0])
    let [loadPost, setLoadPost] = useState(false)
    let [posts, setPosts] = useState([])
    let [pages, setPages] = useState([])
    let [pageNumber, setPageNumber] = useState(0)
    let postQuery = useQuery({
        "queryKey": [BACKEND_URI + '/all-posts?email=' + user?.email],
        'queryFn': async () => {
            let res = await fetch(BACKEND_URI + '/all-posts?email=' + user?.email)
            let data = await res.json()
            return data?.posts
        }
    })
    useEffect(() => {
        // let myPosts = postQuery.data.filter(p => p.authorEmail === user?.email)
        let n = []
        let len = postQuery.data?.length
        for (let i = 0; i < len / 2; i++)
            n.push(i)
        setPages(n)
    }, [postQuery.data])
    useLayoutEffect(() => {
        // let myPosts = postQuery.data.filter(p => p.authorEmail === user?.email)
        if (cat == 'all') setPosts(postQuery.data?.slice(pageNumber * 2, pageNumber * 2 + 2))
        else {
            let data = postQuery.data?.filter(post => post.category === cat)
            setPosts(data.slice(pageNumber * 2, pageNumber * 2 + 2))
        }
    }, [postQuery.data, cat, pageNumber])

    let handleDeletePost = async (id) => {
        // console.log(id);
        Alert.alert("Confirmation", "Are you sure you want to delete this post?",
            [
                {
                    "text": "Cancel",
                    style: 'cancel',
                },
                {
                    "text": "OK",
                    onPress: async () => {
                        let res = await fetch(BACKEND_URI + '/all-posts?id=' + id, { method: 'DELETE' })
                        let data = await res.json()
                        postQuery.refetch()
                        ToastAndroid.show("Post deleted successfully", ToastAndroid.SHORT)
                    },
                    style: 'default',
                }
            ]
        )

    }
    return (<View className="flex-1 pt-2">
        {
            postQuery.isLoading ? <View className="flex-1 justify-center items-center">
                <ActivityIndicator size={80} color="green" />
            </View> :
                <FlatList
                    className="p-1 pt-0"
                    data={posts}
                    renderItem={({ item, index }) =>
                        <View className="relative">
                            <View className="absolute -right-0 rounded-3xl p-1 z-40">
                                <TouchableOpacity
                                    className="bg-red-600 p-2 rounded-full"
                                    onPress={() => handleDeletePost(item?._id)}
                                >
                                    <Icon3
                                        name="delete-outline"
                                        size={18}
                                        color="white"
                                    />
                                </TouchableOpacity>
                            </View>
                            <SinglePost
                                item={item}
                                index={index}
                                color="green"
                            />
                        </View>
                    }
                    keyExtractor={(item, index) => index}
                />}
        {/* <TouchableOpacity className="" onPress={() => setShowAdd(true)}>
            <LinearGradient colors={['#9d009f', '#150015']} className="p-3 rounded-full overflow-hidden absolute bottom-5 right-5">
                <Icon name="plus-a" size={25} color="white" />
            </LinearGradient>
        </TouchableOpacity> */}
        {/* <AddPost showAdd={showAdd} setShowAdd={setShowAdd} setReCall={postQuery.refetch} /> */}
        <View className="flex-row justify-center absolute bottom-5 w-full">
            {
                pages.length > 1 &&
                <TouchableOpacity
                    className={`rounded-r-xl rounded-l-[50px] border-2 border-green-200 bg-green-200 mr-2 `}
                    disabled={pageNumber === 0 ? true : false}
                    onPress={() => setPageNumber(p => p > 0 ? p - 1 : p)}
                >
                    <Icon2 name="navigate-before" size={35} color="darkgreen" />
                </TouchableOpacity>
            }
            <View className=" max-w-[133px]">
                <ScrollView horizontal={true} className="flex-row">
                    {
                        pages.map(p => <TouchableOpacity
                            key={p}
                            className={`rounded-xl p-2 px-4 border-2 ${p !== pageNumber ? "border-green-200 bg-green-200" : "border-green-200"}`}
                            onPress={() => setPageNumber(p)}
                        >
                            <Text className={`${p !== pageNumber ? "text-green-900" : "text-green-200"}`}>{p + 1}</Text>
                        </TouchableOpacity>)
                    }
                </ScrollView>
            </View>
            {
                pages.length > 1 &&
                <TouchableOpacity
                    className={`rounded-l-xl rounded-r-[50px] border-2 border-green-200 bg-green-200 ml-2`}
                    disabled={pageNumber === pages.length - 1 ? true : false}
                    onPress={() => setPageNumber(p => p < pages.length - 1 ? p + 1 : p)}
                >
                    <Icon2 name="navigate-next" size={35} color="darkgreen" />
                </TouchableOpacity>
            }
        </View>
    </View>
    )
}

export default MyPosts