import Colors from '@/constants/Colors';
import { ClerkLoaded, ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Link, Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SecureStore from 'expo-secure-store';
const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
import { Text } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(error);
      return;

    }
  }
}


export {
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const router = useRouter()
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    console.log('isSignedIn', isSignedIn)
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === '(authenticated)';

    if (isSignedIn && !inAuthGroup) {
      // Add a slight delay to ensure layout is mounted
      setTimeout(() => {
        router.replace('/(authenticated)/(tabs)/home');
      }, 1000);
    } else if (!isSignedIn && inAuthGroup) {
      setTimeout(() => {
        router.replace('/');
      }, 1000);
    }
  }, [isSignedIn, isLoaded]);



  if (!loaded || !isLoaded) {
    return <Text>Loading...</Text>;
  }

  return <Stack>
    <Stack.Screen name="index" options={{ headerShown: false }} />
    <Stack.Screen name="signup" options={{
      title: '', headerBackTitle: '', headerShadowVisible: false, headerStyle: {
        backgroundColor: Colors.background
      },
      headerLeft: () => (
        <TouchableOpacity onPress={router.back}>
          <Ionicons name='arrow-back' size={34} color={Colors.dark} />
        </TouchableOpacity>
      )
    }} />
    <Stack.Screen name="login" options={{
      title: '', headerBackTitle: '', headerShadowVisible: false, headerStyle: {
        backgroundColor: Colors.background
      },
      headerLeft: () => (
        <TouchableOpacity onPress={router.back}>
          <Ionicons name='arrow-back' size={34} color={Colors.dark} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <Link href={'/help'} asChild>
          <TouchableOpacity>
            <Ionicons name='help-circle-outline' size={34} color={Colors.dark} />
          </TouchableOpacity>
        </Link>
      )
    }} />
    <Stack.Screen name='help' options={{ title: 'Help', presentation: 'modal' }} />
    <Stack.Screen name="verify/[phone]" options={{
      title: '', headerBackTitle: '', headerShadowVisible: false, headerStyle: {
        backgroundColor: Colors.background
      },
      headerLeft: () => (
        <TouchableOpacity onPress={router.back}>
          <Ionicons name='arrow-back' size={34} color={Colors.dark} />
        </TouchableOpacity>
      )
    }} />
    <Stack.Screen name='(authenticated)/(tabs)' options={{ headerShown: false }} />
    <Stack.Screen name='(authenticated)/crypto/[id]' options={{
      title: '', headerBackTitle: '', headerShadowVisible: false, headerStyle: {
        backgroundColor: Colors.background
      },
      headerLeft: () => (
        <TouchableOpacity onPress={router.back}>
          <Ionicons name='arrow-back' size={34} color={Colors.dark} />
        </TouchableOpacity>
      ),
      headerLargeTitle: true,
      headerTransparent: true,
      headerRight: () => {
        return (
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity>
              <Ionicons name='notifications-outline' size={30} color={Colors.dark} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name='star-outline' size={30} color={Colors.dark} />
            </TouchableOpacity>
          </View>
        )
      }

    }} />
  </Stack>;
}

const RootLayoutNav = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY!} tokenCache={tokenCache}>
        <ClerkLoaded>

          <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar style='light' />
            <InitialLayout />
          </GestureHandlerRootView>
        </ClerkLoaded>
      </ClerkProvider>
    </QueryClientProvider>
  )
}

export default RootLayoutNav;
