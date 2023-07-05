import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React, { useContext, useLayoutEffect, useState } from 'react'
import { BACKEND_URI, UserContext } from '../../Components/Root'
import { ScrollView } from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list'
import { ActivityIndicator } from 'react-native'
import { useQuery } from '@tanstack/react-query'
// import { allCountries } from '../../Components/allCountries'

const About = () => {
    let { user, setUser } = useContext(UserContext)
    const [allCountries, setAllCountries] = useState([])
    const [countries, setCountries] = useState([])
    const [divisions, setDivisions] = useState([])
    const [districts, setDistricts] = useState([])

    const [address, setAddress] = useState({})
    const [phone, setPhone] = useState(user?.phone || "")
    const [err, setErr] = useState("")

    let countryQuery = useQuery({
        "queryKey": [BACKEND_URI + "/graphql"],
        'queryFn': async () => {
            let res = await fetch(BACKEND_URI + "/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    query: `
                    query {
                        getAllCountries {
                          name
                          divisions {
                            name
                            districts {
                              name
                            }
                          }
                        }
                      }
                    `
                })
            })
            let data = await res.json()
            setAllCountries(data?.data?.getAllCountries)
            return data?.data?.getAllCountries
        }
    })

    useLayoutEffect(() => {
        setCountries([])
        setDivisions([])
        setDistricts([])
        let data = []
        allCountries?.forEach((country, i) => data.push({
            value: country.name
        }))
        setCountries(data)
    }, [allCountries])

    useLayoutEffect(() => {
        setDivisions([])
        setDistricts([])
        let data = []
        setTimeout(() => {
            let selectedCountry = allCountries?.find(country => country.name === address?.Country)

            if (selectedCountry)
                selectedCountry?.divisions?.forEach(div => data.push({ value: div.name }))
            setDivisions(data)
        }, 500);
    }, [address?.Country])

    useLayoutEffect(() => {
        setDistricts([])
        let data = []
        setTimeout(() => {
            let selectedCountry = allCountries?.find(country => country.name === address?.Country)
            let selectedDivision = selectedCountry?.divisions?.find(div => div.name === address?.Division)

            if (selectedDivision)
                selectedDivision?.districts?.forEach(dis => data.push({ value: dis.name }))
            setDistricts(data)
        }, 500);
    }, [address?.Division])


    let handleUpdate = async () => {
        if (phone && !/^(\+88)?[0-0]{1}[1-1]{1}[0-9]{3}[-]?[0-9]{6}$/.test(phone)) {
            setErr("Invalid phone number")
            return
        }
        setErr("")
        let updateDoc = {}

        if (Object.keys(address).length)
            updateDoc = { address: address, phone: phone }
        else
            updateDoc = { phone: phone }
        // console.log(BACKEND_URI + '/update-user?email=' + user?.email);
        let res = await fetch(BACKEND_URI + '/update-user?email=' + user?.email, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ ...updateDoc })
        })
        let data = await res.json()
        // console.log(data);
        setUser(prev => {
            return { ...prev, ...updateDoc }
        })
    }


    if (countryQuery?.isLoading) return <View className="flex-1 justify-center items-center">
        <ActivityIndicator size={80} color="green" />
    </View>

    return (
        <ScrollView className="relative px-3">
            <Text className="text-white border-b-2 font-bold text-right pb-2 border-white">Personal</Text>
            <View className="flex-row gap-5 mb-4 mt-1 items-center">
                <Text className="text-green-200">Phone:</Text>
                <TextInput className="flex-1 p-2 border rounded-xl border-red-100  text-white"
                    inputMode="tel"
                    onChangeText={(e) => setPhone(e)}
                    value={phone}
                />
            </View>
            {err && <Text className="text-red-500 text-center my-1">{err}</Text>}
            <Text className="text-white border-b-2 font-bold text-right pb-2 border-white">Address</Text>
            <View className="flex-row gap-5 mt-1 items-center">
                <Text className="text-green-200">Country:</Text>
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
                    <Text className="text-green-200">Division:</Text>
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
                    <Text className="text-green-200">District:</Text>
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