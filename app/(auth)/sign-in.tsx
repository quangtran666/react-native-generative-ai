import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import images from '@/constants/images'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import { createUser, getCurrentUser, signIn } from '@/lib/appwrite'
import { useGlobalContext } from '@/contexts/GlobalProvider'

export interface SignIn {
    email: string,
    password: string
}

const SignIn = () => {
    const {setIsLoggedIn, setUser } = useGlobalContext()
    const [form, setForm] = useState<SignIn>({
        email: '',
        password: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSignIn = async () => {
          if (!form.email || !form.password) {
            Alert.alert('Error', 'Please fill in all fields')
          };
    
          setIsSubmitting(true);
    
          try {
            await signIn({
              email: form.email,
              password: form.password,
            });

            const result = await getCurrentUser()

            setUser(result)
            setIsLoggedIn(true)
    
            router.replace('/home');
          } catch (error) {
            Alert.alert('Error', error.message)
          } finally {
            setIsSubmitting(false)
          }
        }

    return (
        <SafeAreaView className='bg-primary h-full'>
            <ScrollView>
                <View className='w-full justify-center min-h-[85vh] px-4 my-6'>
                    <Image
                        source={images.logo}
                        resizeMode='contain'
                        className='w-[115px] h-[35px]'
                    />

                    <Text className='2xl text-white text-semibold mt-10 font-psemibold'>Log in to Aora</Text>

                    <FormField
                        title='Email'
                        value={form.email}
                        handleChangeText={(value) => setForm({ ...form, email: value })}
                        otherStyles='mt-7'
                        keyboardTypes='email-address'
                    />

                    <FormField
                        title='Password'
                        value={form.password}
                        handleChangeText={(value) => setForm({ ...form, password: value })}
                        otherStyles='mt-7'
                    />

                    <CustomButton
                        titlle={'Sign In'}
                        handlePress={handleSignIn}
                        containerStyle='mt-7'
                        isLoading={isSubmitting}
                    />

                    <View className='justify-center pt-5 flex-row gap-2'>
                        <Text className='text-lg text-gray-100 font-pregular'>
                            Don't have an account?
                        </Text>
                        <Link className='text-lg font-psemibold text-secondary' href="/sign-up">Sign Up</Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SignIn