import { View, Text, SafeAreaView, Pressable, ScrollView, Image, TextInput, FlatList, Modal, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URI, UserContext } from '../Components/Root';
import Comment from '../Components/Comment';
import { useQuery } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { ToastAndroid } from 'react-native';

const CommentScreen = ({ navigation, route }) => {
    let { user } = useContext(UserContext)
    let [comments, setComments] = useState([])
    let [myComment, setMyComment] = useState('')
    // let [load, setLoad] = useState(false)
    let [loadSubmit, setLoadSubmit] = useState(false)
    let { postID, item } = route?.params

    let commentQuery = useQuery({
        'queryKey': [BACKEND_URI + `/all-comments?postID=${postID}`],
        'queryFn': async () => {
            let res = await fetch(BACKEND_URI + `/all-comments?postID=${postID}`)
            let data = await res.json()
            setLoadSubmit(false)
            return data?.comments
        }
    })
    useEffect(() => {
        setComments(commentQuery.data)
    }, [commentQuery.data])

    let handlerComment = (e) => {
        setMyComment(e)
    }
    let handlerCancel = () => {
        navigation.navigate("Details", item)
    }
    let handlerSubmit = () => {
        if (myComment !== '') {
            // setLoad(true)
            setLoadSubmit(true)
            let comm = {
                details: myComment,
                postID: postID,
                authorEmail: user?.email,
                time: Date.now()
            }
            fetch(BACKEND_URI + '/submit-comment', {
                method: 'POST',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(comm)
            }).then(res => res.json())
                .then(data => {
                    commentQuery.refetch()
                    setMyComment('')
                    // if (data?.acknowledged) {
                    //     comm = { ...comm, author: user, _id: data?.insertedId }
                    //     setComments([comm, ...comments])
                    //     // setLoad(false)
                    //     setLoadSubmit(false)
                    // }
                })
        }
    }

    let handleDelete = (commentID) => {
        Alert.alert('Confirmation', 'Are you sure to delete this comment?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Ok',
                style: 'default',
                onPress: () => {
                    setLoadSubmit(true)
                    fetch(BACKEND_URI + `/delete-comment?commentID=${commentID}`, {
                        method: 'delete'
                    }).then(res => res.json())
                        .then(data => {
                            ToastAndroid.show('Comment deleted successfully!', ToastAndroid.SHORT);
                            commentQuery.refetch()
                            // let remaining = comments.filter(comment => comment._id !== commentID)
                            // setComments(remaining)
                        })
                }
            }
        ])

        // console.log(surity);
    }
    return (
        <LinearGradient className="flex-1 p-5 pt-10" colors={['white', 'orange']}>
            {
                commentQuery.isLoading ?
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator color="red" size={80} />
                    </View> :
                    <View className="flex-1">
                        <FlatList
                            data={comments}
                            renderItem={({ item, index }) => <Comment comment={item} handleDelete={handleDelete} />}
                            keyExtractor={(item, index) => item._id}
                        />
                    </View>
            }
            {/* <ScrollView>
            {
                comments.map((item, index) => <Comment
                    key={index}
                    comment={item}
                />)
            }
        </ScrollView> */}
            <View className=" flex-row justify-between gap-5">
                <TextInput
                    onChangeText={handlerComment}
                    className="border-2 px-3 text-orange-900 bg-orange-200 font-semibold text-lg border-orange-900 flex-1 h-16 rounded-2xl"
                    maxLength={50}
                    value={myComment}
                    placeholder="Please enter a comment"
                />
                {
                    (loadSubmit || commentQuery.isLoading) ? <ActivityIndicator size="large" color="red" />
                        :
                        <View className="justify-between">
                            <View className="overflow-hidden rounded-xl">
                                <Pressable android_ripple={{ color: 'orange' }} className="bg-orange-900 px-4 py-1" onPress={handlerSubmit}>
                                    <Text className="text-white text-sm">SUBMIT</Text>
                                </Pressable>
                            </View>
                            <View className="overflow-hidden rounded-xl">
                                <Pressable android_ripple={{ color: 'red' }} className="bg-red-700 px-4 py-1" onPress={handlerCancel}>
                                    <Text className="text-white text-sm">CANCEL</Text>
                                </Pressable>
                            </View>
                        </View>
                }
            </View>
        </LinearGradient>
    )
}

export default CommentScreen