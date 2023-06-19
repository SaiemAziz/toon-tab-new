import { View, Text, ImageBackground, ScrollView, ToastAndroid } from 'react-native'
import React, { useContext, useLayoutEffect, useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { BACKEND_URI, UserContext } from '../../Components/Root'
import { useQuery } from '@tanstack/react-query';
// import MapView from 'react-native-maps';
import { gsap, Back, Elastic } from 'gsap-rn';


const About = () => {
    let titleRef = useRef(null);
    let rateTitleRef = useRef(null);
    let ratingRef = useRef(null);
    let countRef = useRef(null);
    let mapRef = useRef(null);
    let mapTitleRef = useRef(null);
    let { user, setUser, loading } = useContext(UserContext)

    let [rating, setRating] = useState(user?.rating || 0)
    let reactQuery = useQuery({
        'queryKey': [BACKEND_URI + "/average-rating"],
        'queryFn': async () => {
            let res = await fetch(BACKEND_URI + "/average-rating")
            let data = await res.json()
            return data
        }
    })
    // console.log(reactQuery.data?);

    useLayoutEffect(() => {
        let func = async () => {
            gsap.set(titleRef, { style: { left: 0, top: 0, opacity: 0 }, transform: { x: 300 } });
            gsap.to(titleRef, { duration: 1, style: { left: 0, top: 0, opacity: 1 }, transform: { x: 0 }, ease: Elastic.easeOut, stagger: { amount: 0.3 } });
            gsap.set(rateTitleRef, { style: { left: 0, top: 0, opacity: 0 }, transform: { x: 300 } });
            gsap.to(rateTitleRef, { duration: 1.5, style: { left: 0, top: 0, opacity: 1 }, transform: { x: 0 }, ease: Elastic.easeOut, stagger: { amount: 0.3 } });
            gsap.set(ratingRef, { style: { left: 0, top: 0, opacity: 0 }, transform: { x: 300 } });
            gsap.to(ratingRef, { duration: 2, style: { left: 0, top: 0, opacity: 1 }, transform: { x: 0 }, ease: Elastic.easeOut, stagger: { amount: 0.3 } });
            gsap.set(countRef, { style: { left: 0, top: 0, opacity: 0 }, transform: { x: 300 } });
            gsap.to(countRef, { duration: 2.5, style: { left: 0, top: 0, opacity: 1 }, transform: { x: 0 }, ease: Elastic.easeOut, stagger: { amount: 0.3 } });
            gsap.set(mapTitleRef, { style: { left: 0, top: 0, opacity: 0 }, transform: { x: -300 } });
            gsap.to(mapTitleRef, { duration: 3, style: { left: 0, top: 0, opacity: 1 }, transform: { x: 0 }, ease: Elastic.easeOut, stagger: { amount: 0.3 } });
            gsap.set(mapRef, { style: { left: 0, top: 0, opacity: 0 }, transform: { scale: 0.001 } });
            gsap.to(mapRef, { duration: 3, style: { left: 0, top: 0, opacity: 1 }, transform: { scale: 1 }, ease: Back.easeInOut });
        }
        func()
    }, [])

    let handlerRate = (rate) => {
        if (rate === rating) {
            setRating(0)
            postRating(0)
        }
        else {
            setRating(rate)
            postRating(rate)
        }
    }

    let postRating = (rate) => {
        setUser(x => {
            return {
                ...x,
                rating: rate
            }
        })
        fetch(`${BACKEND_URI}/update-ratings?email=${user.email}`, {
            method: 'PUT',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ rate })
        })
            .then(res => res.json())
            .then(data => {
                if (rate > 0)
                    ToastAndroid.show('Thank You For Rating Us', ToastAndroid.SHORT);
                reactQuery.refetch()
            })
    }

    return (
        <ImageBackground
            source={require('../../assets/images/naruto_sasuke.png')}
            imageStyle={{ opacity: 0.7, width: '60%', top: "-45%", left: "45%" }}
            resizeMode="contain"
            className="flex-1 p-5 w-full"
        >

            <ScrollView>
                <View>
                    <View className="flex-1  rounded-2xl border-y-white mb-7" ref={ref => titleRef = ref}>
                        <Text className="text-4xl text-purple-900  font-bold">Your Opinion</Text>
                        <Text className="text-4xl text-purple-900  font-bold">Matters</Text>
                        <Text className="text-4xl text-purple-900  font-bold">To Us</Text>
                    </View>
                    <Text className="text-xl text-white bg-purple-700 w-1/2 rounded-r-3xl mb-3 text-center p-2" ref={ref => rateTitleRef = ref}>Please Rate</Text>
                    {/* <Text className="text-center italic text-lg border-4 p-5 my-5 rounded-2xl border-purple-700 font-extrabold">We work hard to serve you better and would love to know how would you rate our app?</Text> */}
                    <View className="flex-row justify-center gap-2 ml-3 w-1/2 scale-105" ref={ref => ratingRef = ref}>{
                        [1, 2, 3, 4, 5].map(i => (
                            <Pressable key={i} onPress={() => handlerRate(i)}>
                                <Icon name={`star${rating >= i ? '-sharp' : '-outline'}`} size={33} color="#9d009f" />
                            </Pressable>
                        ))
                    }
                    </View>
                    <View className="w-[200px] bg-orange-300 p-2 mb-10 mt-3 rounded-r-3xl" ref={ref => countRef = ref}>
                        <Text className="text-orange-900 text-xl text-center">{reactQuery.data?.count || 0} user rated {reactQuery.data?.avgRating.toFixed(2) || 0}</Text>
                    </View>
                </View>
                <Text className="text-4xl my-5 text-purple-900 text-right font-bold" ref={ref => mapTitleRef = ref}>Our Location</Text>
                <View className="flex-1  rounded-2xl border-y-white overflow-hidden shadow-2xl" ref={ref => mapRef = ref}>
                    <MapView
                        region={{
                            latitude: 22.4716,
                            longitude: 91.7877,
                            latitudeDelta: .005,
                            longitudeDelta: .005,
                        }}
                        className="w-full h-96"
                        provider={PROVIDER_GOOGLE}
                    >
                        <Marker coordinate={{
                            latitude: 22.4716,
                            longitude: 91.7877,
                            latitudeDelta: .005,
                            longitudeDelta: .005,
                        }}
                            title="Toon Tab"
                            provider={PROVIDER_GOOGLE}
                        />
                    </MapView>
                </View>
            </ScrollView>
        </ImageBackground>
    )
}

export default About