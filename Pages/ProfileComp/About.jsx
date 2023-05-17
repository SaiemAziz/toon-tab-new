import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext, useLayoutEffect, useState } from 'react'
import { BACKEND_URI, UserContext } from '../../Components/Root'
import { ScrollView } from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list'
import { allCountries } from '../../Components/allCountries'

const About = () => {
    let { user, setUser } = useContext(UserContext)

    const [countries, setCountries] = useState([])
    const [divisions, setDivisions] = useState([])
    const [districts, setDistricts] = useState([])


    const [address, setAddress] = useState({})
    // useLayoutEffect(() => {
    //     console.log(user);
    //     setAddress(user?.address || {})
    // }, [user])
    useLayoutEffect(() => {
        setCountries([])
        setDivisions([])
        setDistricts([])
        let data = []
        allCountries.forEach((country, i) => data.push({
            value: country.name
        }))
        setCountries(data)
    }, [])
    useLayoutEffect(() => {
        setDivisions([])
        setDistricts([])
        let data = []
        setTimeout(() => {
            let selectedCountry = allCountries.find(country => country.name === address?.Country)

            if (selectedCountry)
                selectedCountry?.divisions?.forEach(div => data.push({ value: div.name }))
            setDivisions(data)
        }, 500);
    }, [address?.Country])
    useLayoutEffect(() => {
        setDistricts([])
        let data = []
        setTimeout(() => {
            let selectedCountry = allCountries.find(country => country.name === address?.Country)
            let selectedDivision = selectedCountry?.divisions?.find(div => div.name === address?.Division)

            if (selectedDivision)
                selectedDivision?.districts?.forEach(dis => data.push({ value: dis.name }))
            setDistricts(data)
        }, 500);
    }, [address?.Division])


    let handleUpdate = async () => {
        if (Object.keys(address).length) {
            // console.log(BACKEND_URI + '/update-user?email=' + user?.email);
            let res = await fetch(BACKEND_URI + '/update-user?email=' + user?.email, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ address: address })
            })
            let data = await res.json()
            console.log(data);
            setUser(prev => {
                return { ...prev, address: address }
            })
        }
    }
    return (
        <ScrollView className="relative px-3">
            <Text className="text-white border-b-2 font-bold text-right pb-2 border-white">Address</Text>
            <View className="flex-row gap-5 mt-1 items-center">
                <Text className="text-red-200">Country:</Text>
                <View className="flex-1">
                    <SelectList
                        dropdownTextStyles={{ color: "#ffffff" }}
                        inputStyles={{ color: "#ffffff" }}
                        setSelected={(val) => setAddress(prev => {
                            return { Country: val }
                        })}
                        data={countries}
                        save="value"
                    />
                </View>
            </View>
            {
                divisions.length > 0 && <View className="flex-row gap-5 mt-1 items-center">
                    <Text className="text-red-200">Division:</Text>
                    <View className="flex-1">
                        <SelectList
                            dropdownTextStyles={{ color: "#ffffff" }}
                            inputStyles={{ color: "#ffffff" }}
                            setSelected={(val) => setAddress(prev => {
                                return { Country: prev.Country, Division: val }
                            })}
                            data={divisions}
                            save="value"
                        />
                    </View>
                </View>
            }
            {
                districts.length > 0 && <View className="flex-row gap-5 mt-1 items-center">
                    <Text className="text-red-200">District:</Text>
                    <View className="flex-1">
                        <SelectList
                            dropdownTextStyles={{ color: "#ffffff" }} inputStyles={{ color: "#ffffff" }}
                            setSelected={(val) => setAddress(prev => {
                                return { ...address, District: val }
                            })}
                            data={districts}
                            save="value"
                        />
                    </View>
                </View>
            }

            <TouchableOpacity className="bg-green-100 rounded-lg p-3 my-8 " onPress={handleUpdate}>
                <Text className="text-green-900 text-xl font-bold text-center">
                    UPDATE
                </Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

export default About