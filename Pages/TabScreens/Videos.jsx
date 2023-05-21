import { useState } from 'react';
import { Pressable } from 'react-native';
import { View, Text, ScrollView, Alert, Button, FlatList, Image } from 'react-native'
import YoutubePlayer from "react-native-youtube-iframe";
const Videos = () => {
    let videos = [
        {
            showName: "NARUTO",
            title: "Top 10 Strongest Naruto Characters",
            id: "5hbzEFLTjHY"
        },
        {
            showName: "TOM & JERRY",
            title: "Tom & Jerry | Jerry's Funniest Moments! 🐭 | WB Kids",
            id: "0uQwp2qn9cQ"
        },
        {
            showName: "ATTACK ON TITAN",
            title: "Attack On Titan - Heart Attack [Edit/AMV]!",
            id: "l2VTzluCh24"
        },
        {
            showName: "DEMON SLAYER",
            title: "D E M O N S - [Demon Slayer 4k edit]",
            id: "k_CxMefC7mA"
        },
        {
            showName: "FAMILY GUY",
            title: "Family Guy Compilation Funny Moments",
            id: "P2T5lCzoRTI"
        },
        {
            showName: "NARUTO",
            title: "MINATO RAP | Yellow Flash | RUSTAGE [Naruto Rap]",
            id: "YTYMyRRlM_I"
        },
    ]
    let [selected, setSeletected] = useState(videos[0])
    // const [playing, setPlaying] = useState(false);

    // const onStateChange = (state) => {
    //     if (state === "ended") {
    //         setPlaying(false);
    //     }
    // };

    // const togglePlaying = () => {
    //     setPlaying((prev) => !prev);
    // };
    return (
        <View className="flex-1 pb-3">
            <View>
                <SingleVideo item={selected} />

            </View>
            <FlatList
                className="p-2 border-0 border-purple-950 bg-black"
                data={videos}
                renderItem={({ item, index }) => (
                    <View className={`flex-1 m-2 ${item.id === selected.id ? "  bg-gray-500" : ""} border-purple-950 overflow-hidden`}>
                        <Pressable onPress={() => setSeletected(item)}>
                            <Image
                                source={{ uri: `https://img.youtube.com/vi/${item.id}/0.jpg` }}
                                fadeDuration={1000}
                                className="h-24"
                                resizeMode="cover"
                            />
                            <Text className="text-center my-2 text-lg text-white">{item.showName}</Text>
                        </Pressable>
                    </View>
                )}
                numColumns={2}
                keyExtractor={(item, index) => index}
            />
        </View>
    )
}

export default Videos

export function SingleVideo({ item }) {

    return <View className=" bg-black overflow-hidden">
        <YoutubePlayer
            height={230}
            // play={playing}
            videoId={item.id}
        // onChangeState={onStateChange}
        />
        <Text className="text-right text-purple-500 font-bold p-5 pb-0">{item.showName}</Text>
        <Text className="text-xl text-purple-100 p-5 pt-0" numberOfLines={1} ellipsizeMode='tail'>{item.title}</Text>
        <Text className="text-2xl font-bold mt-2 mb-2 text-white text-center">More Videos</Text>
    </View>
} 