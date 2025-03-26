import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
} from 'react-native';


const Page = () => {
    const [countryCode, setCountryCode] = useState('+44');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0;
    const router = useRouter();
    const { signUp, isLoaded } = useSignUp();

    // Normalize phone number - remove spaces, dashes, etc.
    const normalizePhoneNumber = (number: string) => {
        return number.replace(/\D/g, '');
    };

    const onSignup = async () => {
        if (!isLoaded) {
            return;
        }

        const normalizedPhone = normalizePhoneNumber(phoneNumber);

        if (normalizedPhone.length < 8) {
            Alert.alert('Invalid Phone Number', 'Please enter a valid phone number');
            return;
        }

        const fullPhoneNumber = `${countryCode}${normalizedPhone}`;
        setIsLoading(true);

        try {
            await signUp.create({
                phoneNumber: fullPhoneNumber,
            });

            await signUp.preparePhoneNumberVerification();

            router.push({
                pathname: '/verify/[phone]',
                params: {
                    phone: fullPhoneNumber,
                    signin: 'false'
                }
            });
        } catch (error) {
            console.error('Error signing up:', error);
            Alert.alert('Signup Error', 'There was a problem with your signup. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="padding"
            keyboardVerticalOffset={keyboardVerticalOffset}>
            <View style={defaultStyles.container}>
                <Text style={defaultStyles.header}>Let's get started!</Text>
                <Text style={defaultStyles.descriptionText}>
                    Enter your phone number. We will send you a confirmation code there
                </Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Country code"
                        placeholderTextColor={Colors.gray}
                        value={countryCode}
                        onChangeText={setCountryCode}
                        keyboardType="phone-pad"
                    />
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="Mobile number"
                        placeholderTextColor={Colors.gray}
                        keyboardType="numeric"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                    />
                </View>

                <Link href={'/login'} replace asChild>
                    <TouchableOpacity>
                        <Text style={defaultStyles.textLink}>Already have an account? Log in</Text>
                    </TouchableOpacity>
                </Link>

                <View style={{ flex: 1 }} />

                <TouchableOpacity
                    style={[
                        defaultStyles.pillButton,
                        phoneNumber !== '' ? styles.enabled : styles.disabled,
                        { marginBottom: 20 },
                    ]}
                    disabled={isLoading || phoneNumber === ''}
                    onPress={onSignup}>
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={defaultStyles.buttonText}>Sign up</Text>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        marginVertical: 40,
        flexDirection: 'row',
    },
    input: {
        backgroundColor: Colors.lightGray,
        padding: 20,
        borderRadius: 16,
        fontSize: 20,
        marginRight: 10,
    },
    enabled: {
        backgroundColor: Colors.primary,
    },
    disabled: {
        backgroundColor: Colors.primaryMuted,
    },
});

export default Page;