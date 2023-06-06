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
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
const ImageScreen = () => {
    let navigation = useNavigation()
    const [image, setImage] = useState(null)
    const [imageUri, setImageUri] = useState("")
    const [load, setLoad] = useState(false)
    const [pred, setPred] = useState([])
    const [err, setErr] = useState(null)
    const html = `<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  </head>
  <body style="text-align: center;">
    <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
      The result of given Image
    </h1>
    <img
      src="${imageUri}"
      style="width: 50vw; margin-horizontal: auto" />
    <div style="">
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; margin-bottom: 5px">
            <p>${pred[0]?.class?.toUpperCase()}</p>
            <p>${(pred[0]?.score * 100).toFixed(2)}%</p>
        </div>
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; margin-bottom: 5px">
            <p>${pred[1]?.class?.toUpperCase()}</p>
            <p>${(pred[1]?.score * 100).toFixed(2)}%</p>
        </div>
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; margin-bottom: 5px">
            <p>${pred[2]?.class?.toUpperCase()}</p>
            <p>${(pred[2]?.score * 100).toFixed(2)}%</p>
        </div>
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; margin-bottom: 5px">
            <p>${pred[3]?.class?.toUpperCase()}</p>
            <p>${(pred[3]?.score * 100).toFixed(2)}%</p>
        </div>
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; margin-bottom: 5px">
            <p>${pred[4]?.class?.toUpperCase()}</p>
            <p>${(pred[4]?.score * 100).toFixed(2)}%</p>
        </div>
    </div>
  </body>
</html>
`;
    // const print = async () => {
    //     await Print.printAsync({
    //       html
    //     });
    //   };

    const printToFile = async () => {
        const { uri } = await Print.printToFileAsync({ html });
        // console.log('File has been saved to:', uri);
        await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    };
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
    let handlerBack = () => {
        navigation.goBack()
    }
    const PickImage = async () => {
        setImage(null)
        setPred([])
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
            setImageUri(formImage);
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
                <TouchableOpacity className="absolute top-10 left-5 rounded-[100px] border-2 border-green-900 overflow-hidden w-fit z-50" onPress={handlerBack}>
                    <View className="justify-center items-center p-2">
                        <Icon name="keyboard-backspace" size={35} color="darkgreen" />
                    </View>
                </TouchableOpacity>
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
                            {pred.length > 0 && <View>
                                <View className="justify-center items-center">
                                    <TouchableOpacity className="flex-row gap-2" onPress={printToFile}>
                                        <Text className="text-center text-3xl italic text-blue-700 font-bold">Results</Text>
                                        <Icon name="file-download" size={35} color="darkblue" />
                                    </TouchableOpacity>
                                </View>
                                <FlatList
                                    className="p-2 border-0 border-green-950"
                                    data={pred}
                                    renderItem={({ item, index }) => (
                                        <View className={`rounded-xl flex-row justify-between p-3 w-full my-1 border-green-600 border-2 items-center`}>
                                            <Text className=" text-green-600 text-lg">{item?.class?.toUpperCase()}</Text>
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