import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Home, Login , AddPass, PassScreen, EditPass } from './app/screens';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { registerRootComponent } from 'expo';
import { enableScreens } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

enableScreens();
const Stack = createStackNavigator();

export default function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await AsyncStorage.getItem('isAuth');
        if (isAuth === 'true') {
          setIsAuthenticated(true)
          console.log('User is authenticated');


        } else {
          console.log('User is not authenticated');
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('Error fetching authentication status:', error);
      }
    };
    checkAuth();
  }, []);
  const onLogout = async () => {
    setIsAuthenticated(false)
    await AsyncStorage.setItem('isAuth', 'false');

  }
  const handleLogin = async()=>{
    await AsyncStorage.setItem('isAuth','true')
    setIsAuthenticated(true)
  }
  return (
    <SafeAreaProvider >
      <NavigationContainer>
        <StatusBar style='dark' />
        <Stack.Navigator initialRouteName={Login} screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <>
              <Stack.Screen name="Home" options={{ headerShown: false }}>
                {(props) => <Home {...props} onLogOut={onLogout} />}
              </Stack.Screen>
              <Stack.Screen name='AddPass' component={AddPass}/>
              <Stack.Screen name='PassScreen' component={PassScreen}/>
              <Stack.Screen name='EditPass' component={EditPass}/>
            </>
          ) : (
            <>
            <Stack.Screen name="Login" options={{ headerShown: false }}>
                {(props) => <Login {...props} onLogIn={handleLogin} />}
              </Stack.Screen>
             
            </>
          )}

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

