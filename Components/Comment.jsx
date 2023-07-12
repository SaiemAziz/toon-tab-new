import { View, Text, SafeAreaView, Pressable, ScrollView, Image, TextInput, FlatList, Modal, ActivityIndicator } from 'react-native'
import React, { useContext, useLayoutEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { UserContext } from './Root';
import CommentStyles from './Comment.scss'
function Comment({ comment,  handleDelete }) {
    let { user } = useContext(UserContext)
    // console.log(CommentStyles);
    let [author, setAuthor] = useState(comment?.author)
    // let [load, setLoad] = useState(true)
    let unix_timestamp = comment.time
    let time = new Date(unix_timestamp);
    // let date = time.getDate();
    // let month = time.getMonth() + 1;
    // let year = time.getFullYear();
    // console.log(time.getDate() + '-' + (time.getMonth() + 1) + '-' + (time.getFullYear()))
    // if (load) {
    //     return <ActivityIndicator color="red" size="large" className="my-5" />
    // }
    // else
    return <View style={CommentStyles.commentContainer}>
        <Image
            source={{
                uri: author?.photoURL || "https://media.istockphoto.com/id/526947869/vector/man-silhouette-profile-picture.jpg?s=612x612&w=0&k=20&c=5I7Vgx_U6UPJe9U2sA2_8JFF4grkP7bNmDnsLXTYlSc="
            }}
            fadeDuration={500}
            style={CommentStyles.commentImage}
        />
        <View className="flex-1">
            <View style={CommentStyles.commentInfo}>
                <Text style={CommentStyles.author}>@{author?.userName}</Text>
                <Text style={CommentStyles.time} >{time.toISOString().toString().slice(0,10)}</Text>
            </View>
            <Text style={CommentStyles.commentText} >{comment?.details}</Text>
        </View>
        {
            author?.email === user.email &&
            <View style={CommentStyles.deleteButtonContainer}>
                <Pressable
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