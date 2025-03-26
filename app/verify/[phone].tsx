import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Fragment, useEffect, useState } from 'react'
import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import { isClerkAPIResponseError, useSignIn, useSignUp } from '@clerk/clerk-expo';
import { defaultStyles } from '@/constants/Styles';
import {
    CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell
} from 'react-native-confirmation-code-field';
import Colors from '@/constants/Colors';
const CELL_COUNT = 6;

const Page = () => {
    const { phone, signin } = useLocalSearchParams<{ phone: string, signin: string }>();
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useSignIn();
    const { signUp, setActive } = useSignUp();
    const router = useRouter();

    const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value: code,
        setValue: setCode,
    });

    useEffect(() => {
        console.log('Phone verification page loaded for number:', phone);
        console.log('Is this a sign-in?', signin === 'true' ? 'Yes' : 'No');

        if (code.length === 6) {
            console.log('6-digit code entered:', code);
            if (signin === 'true') {
                verifySignIn();
            } else {
                verifyCode();
            }
        }
    }, [code]);

    const verifyCode = async () => {
        if (loading) return;

        try {
            console.log('Attempting to verify code for signup:', code);
            setLoading(true);
            const verificationResponse = await signUp!.attemptPhoneNumberVerification({
                code,
            });
            console.log('Verification response:', JSON.stringify(verificationResponse, null, 2));

            // Create session and activate user
            console.log('Creating user session, sessionId:', signUp!.createdSessionId);
            const sessionResponse = await setActive!({ session: signUp!.createdSessionId });
            console.log('Session created:', JSON.stringify(sessionResponse, null, 2));

            console.log('Signup verification successful!');

            // Uncomment this to redirect to home/dashboard
            // router.push('/');
        } catch (err) {
            console.log('Verification error:', JSON.stringify(err, null, 2));
            if (isClerkAPIResponseError(err)) {
                Alert.alert('Verification Error', err.errors[0].message);
            } else {
                Alert.alert('Error', 'An error occurred during verification');
            }
            setCode(''); // Clear the code on error
        } finally {
            setLoading(false);
        }
    };

    const verifySignIn = async () => {
        if (loading) return;

        try {
            console.log('Attempting to verify code for signin:', code);
            setLoading(true);
            const signInResponse = await signIn!.attemptFirstFactor({
                strategy: 'phone_code',
                code,
            });
            console.log('SignIn response:', JSON.stringify(signInResponse, null, 2));

            console.log('Creating session, sessionId:', signIn!.createdSessionId);
            const sessionResponse = await setActive!({ session: signIn!.createdSessionId });
            console.log('Session created:', JSON.stringify(sessionResponse, null, 2));

            console.log('SignIn verification successful!');

            // Redirect to home/dashboard after successful sign-in
            router.push('/');
        } catch (err) {
            console.log('SignIn verification error:', JSON.stringify(err, null, 2));
            if (isClerkAPIResponseError(err)) {
                Alert.alert('Sign-in Error', err.errors[0].message);
            } else {
                Alert.alert('Error', 'An error occurred during sign-in');
            }
            setCode(''); // Clear the code on error
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={defaultStyles.container}>
            <Text style={defaultStyles.header}>6-digit code</Text>
            <Text style={defaultStyles.descriptionText}>
                Code sent to your {phone} number
            </Text>
            <CodeField
                ref={ref}
                {...props}
                value={code}
                onChangeText={setCode}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                testID="my-code-input"
                renderCell={({ index, symbol, isFocused }) => (
                    <Fragment key={index}>
                        <View
                            onLayout={getCellOnLayoutHandler(index)}
                            key={index}
                            style={[styles.cellRoot, isFocused && styles.focusCell]}>
                            <Text style={styles.cellText}>{symbol || (isFocused ? <Cursor /> : null)}</Text>
                        </View>
                        {index === 2 ? <View key={`separator-${index}`} style={styles.separator} /> : null}
                    </Fragment>
                )}
            />

            {loading && <Text style={styles.statusText}>Verifying code...</Text>}

            <Link href={'/login'} replace asChild>
                <TouchableOpacity>
                    <Text style={defaultStyles.textLink}>Already have an account? Log in</Text>
                </TouchableOpacity>
            </Link>
        </View>
    )
}

export default Page

const styles = StyleSheet.create({
    codeFieldRoot: {
        marginVertical: 20,
        marginLeft: 'auto',
        marginRight: 'auto',
        gap: 12,
    },
    cellRoot: {
        width: 45,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.lightGray,
        borderRadius: 8,
    },
    cellText: {
        color: '#000',
        fontSize: 36,
        textAlign: 'center',
    },
    focusCell: {
        paddingBottom: 8,
    },
    separator: {
        height: 2,
        width: 10,
        backgroundColor: Colors.gray,
        alignSelf: 'center',
    },
    statusText: {
        textAlign: 'center',
        marginVertical: 10,
        color: Colors.primary,
        fontSize: 16,
    }
});