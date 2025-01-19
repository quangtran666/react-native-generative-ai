import { TouchableOpacity, Text } from 'react-native'
import React from 'react'

interface CustomButtonProps {
    titlle: string,
    handlePress: () => void,
    containerStyle?: string,
    textStyles?: string,
    isLoading?: boolean
}

const CustomButton = ({ titlle, handlePress, containerStyle, textStyles, isLoading }: CustomButtonProps) => {
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            className={`bg-secondary rounded-xl min-h-[62px] justify-center items-center ${containerStyle} ${isLoading ? 'opacity-50' : ''}`}
            disabled={isLoading}
        >
            <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>{titlle}</Text>
        </TouchableOpacity>
    )
}

export default CustomButton