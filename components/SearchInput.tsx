import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SignIn } from '@/app/(auth)/sign-in'
import { icons } from '@/constants'
import { router, usePathname } from 'expo-router'

interface SearchInputProps {
    initialQuery?: string
}

const SearchInput = ({initialQuery} : SearchInputProps) => {
    const pathName = usePathname()
    const [query, setQuery] = useState(initialQuery || '')

    return (
        <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary flex flex-row items-center mt-2 space-x-4">
            <TextInput
                className='text-base mt-0.5 text-white flex-1 font-pregular'
                value={query}
                placeholder="Search for a video topic"
                placeholderTextColor="#CDCDE0"
                onChangeText={(e) => setQuery(e)}
            />
            <TouchableOpacity
                onPress={() => {
                    if (!query) 
                        return Alert.alert("Missing Query", "Please input something to search results across database");

                    if (pathName.startsWith('/search')) {
                        router.setParams({ query })
                    } else {
                        router.push(`/search/${query}`)
                    }
                }}
            >
                <Image 
                    source={icons.search}
                    className='w-5 h-5'
                    resizeMode='contain'
                />
            </TouchableOpacity>
        </View>
    )
}

export default SearchInput