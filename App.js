import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
// import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import StartScreen from './Pages/StartScreen';
import WelcomeScreen from './Pages/WelcomeScreen';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Root from './Components/Root';
import AuthorisedScreen from './Pages/AuthorisedScreen';
import ProfileScreen from './Pages/ProfileScreen';
import { useLayoutEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageScreen from './Pages/ImageScreen';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Details from './Pages/Details';
import CommentScreen from './Pages/CommentScreen';

// Create a client
const queryClient = new QueryClient()
// Create a stack
const Stack = createStackNavigator();
export default function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <View className={`flex-1`}>
        <NavigationContainer>
          <Root>
            <Stack.Navigator screenOptions={{ headerShown: false }} >
              <Stack.Screen name="StartScreen" component={StartScreen} />
              <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Register" component={Register} options={{ presentation: 'modal' }} />
              <Stack.Screen name="AuthorisedScreen" component={AuthorisedScreen} />
              <Stack.Screen name="ImageScreen" component={ImageScreen} options={{ presentation: 'modal' }} />
              <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
              <Stack.Screen name="Details" component={Details} />
              <Stack.Screen name="CommentScreen" component={CommentScreen} />
              {/* <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Settings" component={Settings} /> */}
            </Stack.Navigator>
          </Root>
        </NavigationContainer>
        <StatusBar style="auto" />
      </View>
    </QueryClientProvider>
  );
}