import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alert } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
const ImageScreen = () => {
    const [image, setImage] = useState(null)

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
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        })
        // console.log(result);
        if (!result.canceled)
            setImage(result.assets[0].uri)
    }
    // console.log(image);
    return (
        <SafeAreaView className="flex-1 justify-center gap-5 items-center">
            <TouchableOpacity className="p-5 rounded-full bg-green-950" onPress={PickImage}>
                <Text className="text-center font-bold text-green-200">Press</Text>
            </TouchableOpacity>
            {
                image &&
                <Image
                    source={{
                        uri: image
                    }}
                    className="w-80 h-80"
                />
            }
        </SafeAreaView>
    )
}

export default ImageScreen