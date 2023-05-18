import { View, Text, Modal, Button } from 'react-native'
import React, { useContext, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable } from 'react-native';
import { TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { BACKEND_URI, UserContext, categories } from './Root';
import { ScrollView } from 'react-native';
import { uploadImage } from '../Pages/Register';
import { SelectList } from 'react-native-dropdown-select-list';
import { ActivityIndicator } from 'react-native';

const AddPost = ({ showAdd, setShowAdd, setReCall }) => {
    let { user } = useContext(UserContext)
    let [load, setLoad] = useState(false)
    let [err, setErr] = useState('')
    let [title, setTitle] = useState('')
    let [details, setDetails] = useState('')
    let [cat, setCat] = useState(categories[1])
    let allCategories = []
    categories.forEach(c => {
        if (c !== 'all') allCategories.push({ value: c })
    })
    let [selectedImage, setSelectedImage] = useState('')
    let handlerAdd = async () => {

        let formTitle = title
        let formDetails = details
        let formImage = selectedImage

        if (!formTitle || !formDetails || !formImage)
            return setErr("Provide all fields information")
        else if (formDetails.length < 50)
            return setErr("Write minimum 50 characters in details")
        setLoad(true)
        formImage = await uploadImage(`data:image/jpeg;base64,${formImage}`)
        if (!formImage) {
            setLoad(false)
            return setErr("Image couldnt be uploaded")
        }
        setErr("");
        let post = {
            time: new Date(),
            image: formImage,
            title: formTitle,
            details: formDetails,
            authorEmail: user?.email,
            category: cat
        }
        // console.log(post);
        let res = await fetch(BACKEND_URI + '/all-posts', {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(post)
        })
        let data = await res.json()
        setReCall()
        setShowAdd(false)
        setLoad(false)
    }
    const PickImage = async () => {
        setSelectedImage("")
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        // console.log(result);
        if (!result.canceled) {
            // setSelectedImage("image.jpg")
            const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            // const imageUrl = await uploadImage(`data:image/jpeg;base64,${base64}`);
            setSelectedImage(base64)
        }
    };
    return (
        <Modal visible={showAdd} animationType="slide">
            <LinearGradient className="flex-1 pb-5" colors={["transparent", "purple"]}>
                <ScrollView className="p-5 pr-3 flex-1 gap-3 w-full">
                    <View className="flex-row flex-1 justify-center">

                        <Text className="text-center w-[300px] italic font-semibold text-xl bg-purple-900 text-white p-3 rounded-bl-full rounded-tr-full">Add Post</Text>
                    </View>
                    {err && <Text className="font-semibold text-center text-red-600">{err}</Text>}
                    <View className="flex-row gap-2 items-center">
                        {/* <Text className="text-purple-800">Title: </Text> */}
                        <TextInput className="bg-purple-100 flex-1 p-2  border-purple-800 rounded-lg text-purple-800" onChangeText={(e) => setTitle(e)} cursorColor="purple" placeholder='Enter title' />
                    </View>
                    <View className="flex-row gap-2 items-center">
                        {/* <Text className="text-purple-800">Photo: </Text> */}
                        <TouchableOpacity className="flex-1" onPress={PickImage}>
                            <View className="bg-purple-100 rounded-xl p-3 flex-row justify-between items-center">
                                <Text className="  text-purple-900">{selectedImage ? "Photo selected" : "Upload Photo"}</Text>
                                {
                                    !selectedImage ?
                                        <Icon name="pluscircle" size={15} color="purple" /> :
                                        <Icon name="minuscircle" size={15} color="darkred" />
                                }
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View className="flex-row gap-2">
                        <Text className="text-purple-800 pt-3">Category: </Text>
                        <View className="flex-1 bg-purple-100 rounded-xl">
                            <SelectList
                                dropdownTextStyles={{ color: "purple" }}
                                inputStyles={{ color: "purple" }}
                                setSelected={(val) => setCat(val)}
                                data={allCategories}
                                save="value"
                            />
                        </View>
                    </View>
                    <View className="flex-row gap-2 items-center">
                        {/* <Text className="text-purple-800">Details: </Text> */}

                        <TextInput className="bg-purple-100  text-purple-800 flex-1 p-2  border-purple-800 rounded-lg" onChangeText={(e) => setDetails(e)} cursorColor="purple" multiline={true} placeholder='Enter details minimum 50 characters' />
                    </View>
                    {
                        load ? <View className="w-full justify-center my-10"><ActivityIndicator size={40} color="purple" /></View> :
                            <View className="flex-row w-full justify-between p-5 pl-0 gap-3">
                                <View className="rounded-xl overflow-hidden bg-red-400 flex-1">
                                    <Pressable className="p-3 " android_ripple={{ color: "red" }} onPress={() => setShowAdd(false)}>
                                        <Text className="text-xl text-center text-red-200">CANCEL</Text>
                                    </Pressable>
                                </View>
                                <View className="rounded-xl overflow-hidden bg-green-700  flex-1">
                                    <Pressable className="p-3 " android_ripple={{ color: "green" }} onPress={handlerAdd}>
                                        <Text className="text-xl text-center text-green-200">ADD</Text>
                                    </Pressable>
                                </View>
                            </View>
                    }
                </ScrollView>
            </LinearGradient>
        </Modal>
    )
}

export default AddPost