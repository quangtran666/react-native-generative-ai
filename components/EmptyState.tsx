import { View, Text, Image } from 'react-native'
import React from 'react'
import { images } from '@/constants'
import CustomButton from './CustomButton'
import { router } from 'expo-router'

interface EmptyStateProps {
    title: string,
    subtitle: string
}

const EmptyState = ({ title, subtitle }: EmptyStateProps) => {
    return (
        <View className='items-center justify-center px-4'>
            <Image
                source={images.empty}
                className='w=[270px] h-[215px]'
                resizeMode='contain'
            />
            <Text className='font-pmedium text-sm text-gray-100'>
                {subtitle}
            </Text>
            <Text className='text-2xl font-psemibold text-white'>
                {title}
            </Text>

            <CustomButton
                titlle="Create video"
                handlePress={() => {
                    router.push('/create')
                }}
                containerStyle='w-full my-5'
            />
        </View>
    )
}

export default EmptyState