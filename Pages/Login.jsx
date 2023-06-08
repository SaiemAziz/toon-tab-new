import { View, Text } from 'react-native'
import React, { useContext, useState } from 'react'
import { ImageBackground } from 'react-native'
import { Pressable } from 'react-native'
import { StackActions, useNavigation } from '@react-navigation/native'
import { TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign';
import { ActivityIndicator } from 'react-native'
import { ScrollView } from 'react-native'
// import { BACKEND_URI, UserContext } from '../Components/Root'

import { BACKEND_URI, UserContext } from '../Components/Root'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ToastAndroid } from 'react-native'
import { TouchableOpacity } from 'react-native'

const Login = () => {
    let navigation = useNavigation()
    let { loginUser, user, loading, setLoading, setUser, updateUser, sendVerification, logoutUser, remember, setRemember } = useContext(UserContext)
    let [email, setEmail] = useState('')
    let [verifyBtn, setVerifyBtn] = useState(false)
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
    let handlerLogin = async () => {
        let formEmail = email
        let formPass = pass
        if (!formEmail.includes('@') || !formPass) {
            setErr("Please enter all valid information")
            return;
        }

        setErr("")

        loginUser(formEmail, formPass)
            .then(async res => {
                // console.log(BACKEND_URI + `/user-info?email=${res?.user?.email}`);
                // console.log(res?.user?.emailVerified);
                if (!res?.user?.emailVerified) {
                    ToastAndroid.show('Email is not verifed yet.', ToastAndroid.SHORT);
                    setVerifyBtn(true)
                    setLoading(false)
                }
                else if (res?.user?.email) {
                    setVerifyBtn(false)
                    let res2 = await fetch(BACKEND_URI + `/user-info?email=${res?.user?.email}`)
                    let data = await res2.json()
                    // console.log(data);
                    if (data) {
                        setUser(data)
                        navigation.dispatch(
                            StackActions.replace('AuthorisedScreen')
                        );
                        await AsyncStorage.setItem('user', JSON.stringify(data))
                        setLoading(false)
                    } else {
                        setUser(null)
                        setLoading(false)
                        setErr("User not found with this email");
                        return
                    }
                }
            })
            .catch((error) => {
                setLoading(false)
                setErr(error.code.split('/')[1].split('-').join(' ').toUpperCase())
                return;
            });
        // setEmail('')
        // setPass('')
    }


    // send email verification
    let verifyHandler = () => {
        if (email) {
            sendVerification();
        }
        setVerifyBtn(false)
    }

    // set remember me to local storage
    let remSetToLocal = async (rem) => {
        if (rem)
            await AsyncStorage.setItem("remember", JSON.stringify(1))
        else
            await AsyncStorage.removeItem("remember")
    }
    return (
        <ImageBackground
            source={require('../assets/images/tom_and_jerry_PNG66.png')}
            imageStyle={{ opacity: 0.2, left: 30 }}
            className="flex-1 "
            resizeMode="contain"
        >
            <SafeAreaView className="flex-1 justify-center p-10">



                <Text className="border-b-4 border-green-800 text-3xl text-center text-green-700 font-bold pb-5">Login</Text>
                <View className=" mb-5 border-b-4 border-green-800">
                    <ScrollView className="">
                        {/* <View
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
                    </View> */}
                        <TextInput
                            className={inputDesign}
                            placeholder="Email"
                            inputMode="email"
                            kerBoardType="email-address"
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                        />
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
                        {/* <View
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
                    </View> */}


                        {/* <Pressable className={inputDesign + " flex-row justify-between"} onPress={() => setShow(true)}>
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
                    </Pressable> */}
                    </ScrollView>
                </View>
                <View className="flex-row gap-5 mb-5 items-center">
                    <TouchableOpacity onPress={() => {
                        setRemember(prev => {
                            remSetToLocal(!prev)
                            return !prev
                        })
                    }}>
                        <View className={`border-2 border-green-600 rounded-2xl `}>
                            <View className={`m-0.5 p-2 rounded-2xl ${remember ? "bg-green-600" : ""}`}></View>
                        </View>
                    </TouchableOpacity>
                    <Text className="text-green-700">Remember Me</Text>
                </View>
                {err && <Text className="mb-5 font-semibold text-center text-red-500">{err}</Text>}
                <View className="items-center gap-5">
                    {
                        loading ?
                            <ActivityIndicator size={40} color="darkgreen" />
                            : <View className="w-full rounded-full overflow-hidden">
                                <Pressable className="p-3 w-full  bg-green-900" android_ripple={{ color: "green" }} onPress={handlerLogin}
                                ><Text className="text-center text-lg text-green-200">
                                        LOGIN
                                    </Text>
                                </Pressable>
                            </View>
                    }
                    <Pressable onPress={() => navigation.navigate('Register')}
                    ><Text className="text-green-900 text-lg">
                            New Member?
                        </Text>
                    </Pressable>
                    {
                        verifyBtn &&
                        <TouchableOpacity className="border border-blue-900 p-3 rounded-xl" onPress={verifyHandler}
                        ><Text className="text-blue-900 text-lg">
                                Send Verification
                            </Text>
                        </TouchableOpacity>
                    }
                </View>


            </SafeAreaView>
        </ImageBackground>
    )
}

export default Login