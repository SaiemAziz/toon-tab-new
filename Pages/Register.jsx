import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import { ImageBackground } from 'react-native'
import { Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign';
import { ActivityIndicator } from 'react-native'
import { ScrollView } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
// import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import DateTimePicker from '@react-native-community/datetimepicker';
import { BACKEND_URI, UserContext } from '../Components/Root'


import { ToastAndroid } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Register = () => {
    let navigation = useNavigation()
    let { registerUser, user, loading, setLoading, setUser, updateUser, logoutUser, sendVerification } = useContext(UserContext)
    let [email, setEmail] = useState('')
    let [selectedImage, setSelectedImage] = useState('')
    let [userName, setUserName] = useState('')
    let [userNames, setUserNames] = useState('')
    let [available, setAvailable] = useState('')
    let [pass, setPass] = useState('')
    let [con, setCon] = useState('')
    let [passShow, setPassShow] = useState(false)
    let [conShow, setConShow] = useState(false)
    let [err, setErr] = useState('')
    const [date, setDate] = useState(new Date());
    const [birthDate, setBirthDate] = useState(null);
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    let inputDesign = "p-3 text-green-900 text-lg bg-[#ffffffB3] border-y border-green-500 flex-1"

    let handlerRegister = async () => {
        let formDate = birthDate ? date : null;
        let formName = userName;
        let formEmail = email;
        let formPass = pass;
        let formCon = con;
        let formImage = selectedImage

        if (!formDate || !formName || !formEmail.includes('@') || !formPass || !formCon || !formImage) {
            setErr("Please enter all valid information");
            return;
        }
        formImage = await uploadImage(`data:image/jpeg;base64,${formImage}`)
        // console.log(formImage);
        if (!formImage)
            return setErr("Photo upload failed, try again");
        setErr("")

        let userInfo = {
            email: formEmail,
            rating: 0,
            birthDate: formDate,
            password: formPass,
            photoURL: formImage,
            role: "user",
            userName: formName,
        }

        registerUser(email, pass)
            .then((userCredential) => {
                sendVerification()
                mongoDBUserEntry(userInfo)
            })
            .catch((error) => {
                setErr(error.code.split('/')[1].split('-').join(' ').toUpperCase())
                setLoading(false)
                return
            });
        // setUserName('')
        // setErr('')
        // setEmail('')
        // setPass('')
        // setCon('')
        // setBirthDate(null)
    }

    let mongoDBUserEntry = (userInfo) => {
        fetch(BACKEND_URI + '/insert-user', {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(userInfo)
        }).then(res => res.json())
            .then(data => {
                // setUser(data)
                setLoading(false)
                ToastAndroid.show('Registration Successful, Please Login', ToastAndroid.SHORT);
                logoutUser()
            })
    }
    const handleDatePicker = (event, selectedDate) => {
        setShow(false);
        if (event.type === "set") {
            const currentDate = selectedDate;
            setDate(currentDate);
            setBirthDate(currentDate.toString().split(' ').slice(1, 4).join('-'));
        } else if (event.type === "dismissed") {
            setBirthDate(null)
        }
    };
    const PickImage = async () => {
        setSelectedImage("")
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        console.log(result);
        if (!result.canceled) {
            // setSelectedImage("image.jpg")
            const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            // const imageUrl = await uploadImage(`data:image/jpeg;base64,${base64}`);
            setSelectedImage(base64)
        }
    };
    const uploadImage = async (uri) => {
        try {
            const formData = new FormData();
            formData.append('image', {
                uri,
                type: 'image/jpeg',
                name: 'upload.jpg',
            });
            const response = await fetch('https://api.imgbb.com/1/upload?key=a9952d5dc535d9f1c2680526d288c8dc', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            return data.data.url;
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <ImageBackground
            source={require('../assets/images/tom_and_jerry_PNG66.png')}
            imageStyle={{ opacity: 0.2, left: 30 }}
            className="flex-1 justify-center"
            resizeMode="contain"
        >
            <SafeAreaView className="flex-1 justify-center p-10">


                <Text className="border-b-4 border-green-800 text-3xl text-center text-green-700 font-bold pb-5">Register</Text>
                <View className=" mb-5 border-b-4 border-green-800">
                    <ScrollView className="">
                        <View
                            className={inputDesign + " flex-row justify-between items-center "}>
                            <TextInput
                                placeholder="User Name"
                                className="text-lg text-green-900 flex-1"
                                value={userName}
                                onChangeText={(text) => setUserName(text)}
                                onBlur={() => setAvailable(x => x === "available" ? '' : x)}
                            />
                            {
                                available && <View className="bg-[#ffffffB3] h-full pl-2">
                                    {available === "taken" && <Icon name="exclamationcircle" size={25} color="red" />}
                                    {available === "available" && <Icon name="checkcircle" size={25} color="green" />}
                                </View>
                            }
                        </View>
                        <TextInput
                            className={inputDesign}
                            placeholder="Email"
                            inputMode="email"
                            kerBoardType="email-address"
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                        />
                        <TouchableOpacity onPress={PickImage}>
                            <View className="bg-green-100 p-3 flex-row justify-between">
                                <Text className=" text-lg text-green-900">{selectedImage ? "Photo selected" : "Upload Photo"}</Text>
                                {
                                    !selectedImage ?
                                        <Icon name="pluscircle" size={25} color="darkgreen" /> :
                                        <Icon name="minuscircle" size={25} color="darkred" />
                                }
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity className={inputDesign + " flex-row justify-between"} onPress={() => setShow(true)}>
                            {
                                birthDate ?
                                    <Text className="text-green-900 text-lg">{birthDate}</Text>
                                    :
                                    <Text className="text-gray-600 text-lg">Choose Birthdate</Text>
                            }
                            <Icon name="pluscircle" size={25} color="#9ca3af" />
                            {show && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={date}
                                    mode={mode}
                                    is24Hour={true}
                                    onChange={handleDatePicker}
                                />
                            )}
                        </TouchableOpacity>
                        <View
                            className={inputDesign + " flex-row justify-between items-center "}>
                            <TextInput
                                className="text-lg text-green-900 flex-1"
                                placeholder="Password"
                                secureTextEntry={!passShow}
                                value={pass}
                                onChangeText={(text) => setPass(text)}
                            />
                            <View className="bg-[#ffffffB3] h-full pl-2">
                                <Pressable onPress={() => { setPassShow(x => !x) }}>
                                    {passShow ? <Icon name="eye" size={25} color="green" /> : <Icon name="eyeo" size={25} color="green" />}
                                </Pressable>
                            </View>
                        </View>

                        <View
                            className={inputDesign + " flex-row justify-between items-center "}>
                            <TextInput
                                className="text-lg text-green-900 flex-1"
                                placeholder="Confirm Password"
                                secureTextEntry={!conShow}
                                value={con}
                                onChangeText={(text) => setCon(text)}
                            />
                            <View className="bg-[#ffffffB3] h-full pl-2">
                                <Pressable onPress={() => { setConShow(x => !x) }}>
                                    {conShow ? <Icon name="eye" size={25} color="green" /> : <Icon name="eyeo" size={25} color="green" />}
                                </Pressable>
                            </View>
                        </View>



                    </ScrollView>
                </View>
                {err && <Text className="mb-5 font-semibold text-center text-red-500">{err}</Text>}
                <View className="items-center gap-5">
                    {
                        loading ?
                            <ActivityIndicator size={40} />
                            : <View className="w-full rounded-full overflow-hidden">
                                <Pressable className="p-3 w-full  bg-green-900" android_ripple={{ color: "green" }} onPress={handlerRegister}
                                ><Text className="text-center text-lg text-green-200">
                                        REGISTER
                                    </Text>
                                </Pressable>
                            </View>
                    }
                    <Pressable onPress={() => navigation.navigate('Login')}
                    ><Text className="text-green-900 text-lg">

                            Old Member?
                        </Text>
                    </Pressable>
                </View>


            </SafeAreaView>
        </ImageBackground>
    )
}

export default Register