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

const Stack = createStackNavigator();

export default function App() {

  // clear localStorage
  useLayoutEffect(() => {
    let func = async () => {
      let myUser = await AsyncStorage.getItem('user')
      await AsyncStorage.clear()
      if (myUser)
        await AsyncStorage.setItem('user', myUser)
    }
    func()
  })

  return (
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
            {/* <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Settings" component={Settings} /> */}
          </Stack.Navigator>
        </Root>
      </NavigationContainer>
      <StatusBar style="auto" />
    </View>
  );
}