import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alert } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BACKEND_URI } from '../Components/Root'
import { uploadImage } from './Register';
import { ActivityIndicator } from 'react-native';
import { FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
const ImageScreen = () => {
    const [image, setImage] = useState(null)
    const [load, setLoad] = useState(false)
    const [pred, setPred] = useState(null)
    const [err, setErr] = useState(null)
    useEffect(() => {
        (
            async () => {
                // let permission = await AsyncStorage.getItem('image-library-permission')
                // permission = JSON.parse(permission)
                // if (permission !== 'granted') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
                if (status !== 'granted')
                    Alert.alert("Permission denied")
                // else
                //     await AsyncStorage.setItem('image-library-permission', 'granted')
                // }
            }
        )()
    }, [])

    const PickImage = async () => {
        setImage(null)
        setPred(null)
        setErr(null)
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        })
        // console.log(result);
        if (!result.canceled) {
            setLoad(true)
            let imageUri = result.assets[0].uri
            setImage(imageUri)
            // console.log(imageUri);
            const base64Image = await FileSystem.readAsStringAsync(imageUri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            let formImage = await uploadImage(`data:image/jpeg;base64,${base64Image}`, 300)
            // console.log(formImage);
            // setImage(base64)
            let res = await fetch(BACKEND_URI + "/classification", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ url: formImage })
            })

            let data = await res.json()
            // console.log(data);
            if (data.status !== 500)
                setPred(data)
            else setErr("Something went wrong")
            setLoad(false)
        }
    }


    // console.log(image);
    return (
        <LinearGradient colors={["white", "lightgreen"]} className="flex-1">

            <SafeAreaView className="flex-1 pt-7 justify-center gap-5 items-center">
                <View className="flex-1 justify-center items-center">
                    <TouchableOpacity className="p-5 mb-5 rounded-full bg-green-700" onPress={PickImage}>
                        <Text className="text-center text-lg font-bold text-green-200">{image ? "Another Image" : "Upload Image"}</Text>
                    </TouchableOpacity>
                    {
                        image &&
                        <Image
                            source={{
                                uri: image
                            }}
                            className="w-80 h-80 rounded-xl"
                        />
                    }
                </View>
                {
                    load ? <View className="flex-1">
                        <ActivityIndicator color="green" size={40} />
                    </View> :
                        <View className="flex-1 px-5 w-full">
                            {pred && <View>
                                <Text className="text-center text-3xl italic text-blue-700 font-bold">Results</Text>
                                <FlatList
                                    className="p-2 border-0 border-green-950"
                                    data={pred}
                                    renderItem={({ item, index }) => (
                                        <View className={`rounded-xl flex-row justify-between p-3 w-full my-1 border-green-600 border-2 items-center`}>
                                            <Text className=" text-green-600 text-lg">{item?.class.toUpperCase()}</Text>
                                            <Text className="text-lg text-blue-800">{(item?.score * 100).toFixed(2)}%</Text>
                                        </View>
                                    )}
                                    keyExtractor={(item, index) => index}
                                />
                            </View>
                            }
                            {
                                err && <Text className="text-center my-5 font-bold text-xl text-red-500">{err}</Text>
                            }
                        </View>
                }
            </SafeAreaView>
        </LinearGradient>
    )
}

export default ImageScreen