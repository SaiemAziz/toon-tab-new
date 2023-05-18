import { View, Text, Image } from 'react-native'
import { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Pressable } from 'react-native'
import Icon from 'react-native-vector-icons/Fontisto';
import { ActivityIndicator } from 'react-native';
import { FlatList } from 'react-native';
import AddPost from '../../Components/AddPost';
import { BACKEND_URI, UserContext, categories } from '../../Components/Root'

import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
const Posts = () => {
    let [showAdd, setShowAdd] = useState(false)
    let [cat, setCat] = useState(categories[0])
    let [loadPost, setLoadPost] = useState(false)
    // let [reCall, setReCall] = useState(false)
    let [posts, setPosts] = useState([])
    // useLayoutEffect(() => {
    //     func(reCall)
    // }, [reCall])
    // let func = async () => {
    //     setLoadPost(!reCall)
    //     let allPosts = await AsyncStorage.getItem('allPosts')
    //     if (!reCall && allPosts) {
    //         allPosts = JSON.parse(allPosts)
    //     }
    //     else {
    //         let res = await fetch(BACKEND_URI + '/all-posts')
    //         let data = await res.json()
    //         allPosts = data?.posts
    //         await AsyncStorage.setItem('allPosts', JSON.stringify(data?.posts))
    //         setReCall(false)
    //     }
    //     setPosts(allPosts)
    //     setLoadPost(false)
    // }
    let postQuery = useQuery({
        "queryKey": [BACKEND_URI + '/all-posts'],
        'queryFn': async () => {
            let res = await fetch(BACKEND_URI + '/all-posts')
            let data = await res.json()
            return data?.posts
        }
    })

    useLayoutEffect(() => {
        if (cat == 'all') setPosts(postQuery.data)
        else {
            let data = postQuery.data.filter(post => post.category === cat)
            setPosts(data)
        }
    }, [postQuery.data, cat])
    return (<View className="flex-1">
        <View className="flex-row gap-2 px-5 mb-2">
            {
                categories.map(category => <Pressable className={`rounded-lg py-2 border-purple-900 flex-1 ${cat === category ? "border-2" : "border"}`} key={category} onPress={() => setCat(category)}>
                    <Text className={`text-center text-purple-900 ${cat === category ? " font-extrabold" : "font-thin"}`}>{category.toUpperCase()}</Text>
                </Pressable>)
            }
        </View>
        {
            loadPost ? <View className="flex-1 justify-center items-center">
                <ActivityIndicator size={80} color="#150015" />
            </View> :
                <FlatList
                    className="p-5 pt-0"
                    data={posts}
                    renderItem={({ item, index }) => <SinglePost
                        item={item}
                        index={index}
                    />}
                    keyExtractor={(item, index) => index}
                />}
        <TouchableOpacity className="" onPress={() => setShowAdd(true)}>
            <LinearGradient colors={['#9d009f', '#150015']} className="p-3 rounded-full overflow-hidden absolute bottom-5 right-5">
                <Icon name="plus-a" size={25} color="white" />
            </LinearGradient>
        </TouchableOpacity>
        <AddPost showAdd={showAdd} setShowAdd={setShowAdd} setReCall={postQuery.refetch} />
    </View>
    )
}

export default Posts

export function SinglePost({ item, index }) {
    let { user } = useContext(UserContext)
    let { image, details, authorEmail, time, title, _id } = item
    let [react, setReact] = useState('none')
    let [reCall, setReCall] = useState(false)
    let [loadReact, setLoadReact] = useState(false)
    let [likeCount, setLikeCount] = useState(0)
    let [disLikeCount, setDisLikeCount] = useState(0)
    let navigation = useNavigation()
    const reactQuery = useQuery({
        queryKey: [BACKEND_URI + `/react-check?email=${user?.email}&postID=${_id}`],
        queryFn: async () => {
            let res = await fetch(BACKEND_URI + `/react-check?email=${user?.email}&postID=${_id}`)
            myReactData = await res.json()
            return myReactData
        }
    })
    useEffect(() => {
        setReact(reactQuery?.data?.react)
        setLikeCount(reactQuery?.data?.liked)
        setDisLikeCount(reactQuery?.data?.disliked)
    }, [reactQuery.data])

    // useLayoutEffect(() => {
    //     let func = async () => {
    //         setLoadReact(true)
    //         let myReactData = await AsyncStorage.getItem(`react-${user?.email}-${_id}`)
    //         if (!reCall && myReactData) {
    //             myReactData = JSON.parse(myReactData)
    //         } else {
    //             let res = await fetch(BACKEND_URI + `/react-check?email=${user?.email}&postID=${_id}`)
    //             myReactData = await res.json()
    //             await AsyncStorage.setItem(`react-${user?.email}-${_id}`, JSON.stringify(myReactData))
    //         }
    //         setReact(myReactData.react)
    //         setLikeCount(myReactData.liked)
    //         setDisLikeCount(myReactData.disliked)
    //         setLoadReact(false)
    //         setReCall(false)
    //     }
    //     if (user?.email)
    //         func()
    // }, [user, reCall])

    let handlerReact = (reaction) => {
        // if (reaction === 'liked') setLikeCount(x => x + 1)
        // if (reaction === 'disliked') setDisLikeCount(x => x + 1)
        // setLoadReact(true)
        if (react === reaction) {

            deleteReact(reaction)
        } else {

            updateReact(reaction)
        }
    }

    let deleteReact = (reaction) => {

        fetch(BACKEND_URI + `/react-delete?email=${user?.email}&postID=${_id}`, {
            method: 'DELETE'
        })
            .then((res) => res.json())
            .then(() => {
                reactQuery.refetch()
                // if (reaction === 'liked')
                //     setLikeCount(x => x - 1)
                // if (reaction === 'disliked')
                //     setDisLikeCount(x => x - 1)
                // setReact('none')
                // setLoadReact(false)
            })
    }

    let updateReact = (reaction) => {
        fetch(BACKEND_URI + `/react-update?email=${user?.email}&postID=${_id}`, {
            method: "PUT",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ reaction })
        })
            .then((res) => res.json())
            .then(() => {
                reactQuery.refetch()
                // if (react === 'none') {
                //     if (reaction === 'liked')
                //         setLikeCount(x => x + 1)
                //     if (reaction === 'disliked')
                //         setDisLikeCount(x => x + 1)
                // } else {
                //     if (reaction === 'liked') {
                //         setLikeCount(x => x + 1)
                //         setDisLikeCount(x => x - 1)
                //     }
                //     if (reaction === 'disliked') {
                //         setLikeCount(x => x - 1)
                //         setDisLikeCount(x => x + 1)
                //     }
                // }
                // setReact(reaction)
                // setLoadReact(false)
            })
    }


    let handlerSeeMore = () => {
        // console.log("clicked");
        // setLikeCount(x => x + 1)
        navigation.navigate('Details', item)
    }

    return <Pressable onPress={handlerSeeMore}>
        <View className="border-4 rounded-2xl overflow-hidden border-white mb-5 bg-purple-200 flex-row items-center">

            <Image
                source={{
                    uri: image
                }}
                fadeDuration={1000}
                resizeMode="cover"
                className="h-full w-1/3 rounded-l-xl bg-purple-900"

            />
            <View className="flex-1 p-3">
                <Text className="text-lg font-bold text-left" numberOfLines={2}>{title}...</Text>

                <Text className="text-orange-700 text-xs mb-2" numberOfLines={1}>@{authorEmail}</Text>
                {/* <Text className="italic">{time}</Text> */}

                <Text className="text-gray-500" numberOfLines={2}>{details}...</Text>

                {/* <Text className=" text-blue-500 text-right right-0">See More</Text> */}
                {
                    reactQuery.isLoading ?
                        <View className="justify-center items-center pt-2">
                            <ActivityIndicator size={25} color="purple" />
                        </View> :
                        <View className="flex-row gap-5 pt-2 justify-between ">
                            <Pressable className="flex-row gap-2 items-center" onPress={() => handlerReact('liked')}>
                                <Icon name="like" size={25} color={react === 'liked' ? 'blue' : "gray"} />
                                <Text className={react === 'liked' ? 'text-blue-700' : 'text-gray-500'}>{likeCount}</Text>
                            </Pressable>
                            {/* <Text>{reactQuery.isLoading ? "true" : "false"}</Text> */}
                            <Pressable className="flex-row gap-2 items-center" onPress={() => handlerReact('disliked')}>
                                <Icon name="dislike" size={25} color={react === 'disliked' ? 'crimson' : "gray"} />
                                <Text className={react === 'disliked' ? 'text-red-700' : 'text-gray-500'}>{disLikeCount}</Text>
                            </Pressable>
                        </View>
                }
            </View>
        </View>
    </Pressable>
}