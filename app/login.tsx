import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import React, { useCallback, useState } from 'react'
import { defaultStyles } from '@/constants/Styles'
import Colors from '@/constants/Colors'
import { Link, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { isClerkAPIResponseError, useSignIn, useSSO } from '@clerk/clerk-expo'
import { useWarmUpBrowser } from '@/hooks/warmup'
import * as AuthSession from 'expo-auth-session'


enum SignInType {
    Phone, Email, Google, Apple
}

const Page = () => {
    useWarmUpBrowser()
    const [countryCode, setCountryCode] = useState('+44')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0
    const router = useRouter();
    const { signIn, isLoaded } = useSignIn();

    // Normalize phone number - remove spaces, dashes, etc.
    const normalizePhoneNumber = (number: string) => {
        return number.replace(/\D/g, '');
    };

    const { startSSOFlow } = useSSO()

    const onPress = useCallback(async () => {
        try {
            const { createdSessionId, setActive } = await startSSOFlow({
                strategy: 'oauth_google',
                redirectUrl: AuthSession.makeRedirectUri(),
            })

            if (createdSessionId) {
                setActive!({ session: createdSessionId })
            } else {
                // If there is no `createdSessionId`,
                // there are missing requirements, such as MFA
                // Use the `signIn` or `signUp` returned from `startSSOFlow`
                // to handle next steps
            }
        } catch (err) {
            console.error(JSON.stringify(err, null, 2))
        }
    }, [])

    const onSignIn = async (type: SignInType) => {

        if (type === SignInType.Phone) {
            if (!isLoaded) {
                return;
            }

            const normalizedPhone = normalizePhoneNumber(phoneNumber);

            if (normalizedPhone.length < 8) {
                Alert.alert('Invalid Phone Number', 'Please enter a valid phone number');
                return;
            }

            const fullPhoneNumber = `${countryCode}${normalizedPhone}`;
            console.log('Attempting sign in with phone number:', fullPhoneNumber);
            setIsLoading(true);

            try {
                console.log('Creating sign-in with Clerk...');
                const { supportedFirstFactors } = await signIn!.create({
                    identifier: fullPhoneNumber
                });
                console.log('Sign-in created, supported factors:', JSON.stringify(supportedFirstFactors, null, 2));

                if (!supportedFirstFactors) {
                    throw new Error('No authentication factors available');
                }

                console.log('Finding phone code authentication factor...');
                const firstPhoneFactor = supportedFirstFactors.find((factor: any) => {
                    return factor.strategy === 'phone_code';
                });

                if (!firstPhoneFactor) {
                    throw new Error('Phone authentication not supported');
                }

                console.log('Phone factor found:', JSON.stringify(firstPhoneFactor, null, 2));

                // Cast to any to access phoneNumberId property
                const { phoneNumberId } = firstPhoneFactor as any;
                console.log('Phone number ID:', phoneNumberId);

                console.log('Preparing verification code...');
                const prepareResponse = await signIn!.prepareFirstFactor({
                    strategy: 'phone_code',
                    phoneNumberId
                });
                console.log('Verification code prepared:', JSON.stringify(prepareResponse, null, 2));
                console.log('SMS verification code should be sent to:', fullPhoneNumber);

                router.push({
                    pathname: '/verify/[phone]',
                    params: {
                        phone: fullPhoneNumber,
                        signin: 'true'
                    }
                });
            } catch (err) {
                console.log('Sign-in error:', JSON.stringify(err, null, 2));
                if (isClerkAPIResponseError(err)) {
                    Alert.alert('Sign-in Error', err.errors[0].message);
                } else {
                    Alert.alert('Error', 'An error occurred during sign-in');
                }
            } finally {
                setIsLoading(false);
            }
        } else {
            // Handle other login types
            Alert.alert('Coming soon', 'This login method is not yet implemented');
        }
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' keyboardVerticalOffset={keyboardVerticalOffset}>
            <View style={defaultStyles.container}>
                <Text style={defaultStyles.header}>Welcome back</Text>
                <Text style={defaultStyles.descriptionText}>
                    Enter the phone number associated with your account
                </Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder='Country code'
                        placeholderTextColor={Colors.gray}
                        value={countryCode}
                        onChangeText={setCountryCode}
                        keyboardType="phone-pad" />
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder='Mobile number'
                        placeholderTextColor={Colors.gray}
                        keyboardType='numeric'
                        value={phoneNumber}
                        onChangeText={setPhoneNumber} />
                </View>

                <TouchableOpacity
                    style={[
                        defaultStyles.pillButton,
                        phoneNumber !== '' ? styles.enabled : styles.disabled,
                        { marginBottom: 20 }
                    ]}
                    disabled={isLoading || phoneNumber === ''}
                    onPress={() => onSignIn(SignInType.Phone)}>
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={defaultStyles.buttonText}>Continue</Text>
                    )}
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    <View style={{ flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: Colors.gray }} />
                    <Text style={{ color: Colors.gray, fontSize: 20, fontWeight: '500' }}>or</Text>
                    <View style={{ flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: Colors.gray }} />
                </View>

                <TouchableOpacity
                    onPress={() => onSignIn(SignInType.Email)}
                    style={[defaultStyles.pillButton, {
                        flexDirection: 'row',
                        gap: 16,
                        marginTop: 20,
                        backgroundColor: '#fff'
                    }]}>
                    <Ionicons name='mail' size={24} color={'#000'} />
                    <Text style={[defaultStyles.buttonText, { color: '#000' }]}>Continue with email</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onPress}
                    style={[defaultStyles.pillButton, {
                        flexDirection: 'row',
                        gap: 16,
                        marginTop: 20,
                        backgroundColor: '#fff'
                    }]}>
                    <Ionicons name='logo-google' size={24} color={'#000'} />
                    <Text style={[defaultStyles.buttonText, { color: '#000' }]}>Continue with Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => onSignIn(SignInType.Apple)}
                    style={[defaultStyles.pillButton, {
                        flexDirection: 'row',
                        gap: 16,
                        marginTop: 20,
                        backgroundColor: '#fff'
                    }]}>
                    <Ionicons name='logo-apple' size={24} color={'#000'} />
                    <Text style={[defaultStyles.buttonText, { color: '#000' }]}>Continue with Apple</Text>
                </TouchableOpacity>

                <Link href={'/signup'} replace asChild>
                    <TouchableOpacity style={{ marginTop: 20 }}>
                        <Text style={defaultStyles.textLink}>Don't have an account? Sign up</Text>
                    </TouchableOpacity>
                </Link>
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