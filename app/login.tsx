import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { defaultStyles } from '@/constants/Styles'
import Colors from '@/constants/Colors'
import { Link } from 'expo-router'

const Page = () => {
    const [countryCode, setCountryCode] = useState('+91')
    const [phoneNumber, setPhoneNumber] = useState('')
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0


    const onSignup = async () => { }
    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' keyboardVerticalOffset={keyboardVerticalOffset}>
            <View style={defaultStyles.container}>

                <Text style={defaultStyles.header}>Let's get started</Text>
                <Text style={defaultStyles.descriptionText}>
                    Enter your phone number. We will dend you a confirmation code there
                </Text>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.input}
                        placeholder='Country code'
                        placeholderTextColor={Colors.gray}
                        value={countryCode} />
                    <TextInput style={[styles.input, { flex: 1 }]} placeholder='Mobile number' placeholderTextColor={Colors.gray} keyboardType='numeric' value={phoneNumber} onChangeText={setPhoneNumber} />

                </View>
                <Link href={'/login'} replace asChild>
                    <TouchableOpacity>
                        <Text style={defaultStyles.textLink}>Already have an account? Log in</Text>
                    </TouchableOpacity>
                </Link>
                <View style={{ flex: 1 }} />
                <TouchableOpacity style={[defaultStyles.pillButton, phoneNumber !== '' ? styles.enabled : styles.disabled, { marginBottom: 20 }]} onPress={onSignup}>
                    <Text style={defaultStyles.buttonText}>Signup</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export default Page

const styles = StyleSheet.create({
    inputContainer: {
        marginVertical: 40,
        flexDirection: 'row',
    },
    input: {
        backgroundColor: Colors.lightGray,
        borderRadius: 16,
        padding: 20,
        fontSize: 20,
        marginRight: 10,



    },
    enabled: {
        backgroundColor: Colors.primary,
    },
    disabled: {
        backgroundColor: Colors.primaryMuted,
    }
})