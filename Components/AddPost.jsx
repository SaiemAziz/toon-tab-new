import { View, Text, Modal, Button } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable } from 'react-native';

const AddPost = ({ showAdd, setShowAdd, setReCall }) => {
    let [title, setTitle] = useState('')
    let [details, setDetails] = useState('')
    let handlerAdd = () => {
        setShowAdd(false)
        setReCall(true)
    }

    return (
        <Modal visible={showAdd} animationType="slide">
            <LinearGradient className="flex-1" colors={["transparent", "purple"]}>
                <View className="p-5 flex-1 gap-5 w-full">
                    <Text className="text-center italic font-semibold w-full text-xl bg-purple-900 text-white p-3 rounded-bl-full rounded-tr-full">Add Post</Text>
                    <View className="flex-row w-full justify-between p-10 ">
                        <View className="rounded-full overflow-hidden bg-red-700">
                            <Pressable className="p-3 px-7 " android_ripple={{ color: "red" }} onPress={() => setShowAdd(false)}>
                                <Text className="text-xl text-red-200">CANCEL</Text>
                            </Pressable>
                        </View>
                        <View className="rounded-full overflow-hidden bg-green-900">
                            <Pressable className="p-3 px-7 " android_ripple={{ color: "green" }} onPress={handlerAdd}>
                                <Text className="text-xl text-green-200">ADD</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </Modal>
    )
}

export default AddPost