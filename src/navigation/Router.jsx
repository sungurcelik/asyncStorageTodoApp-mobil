import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import HomeScreen from '../screens/HomeScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import TodoScreen from '../screens/TodoScreen';
import {getItem} from '../utils/asyncStorage';

const Stack = createNativeStackNavigator();

const Router = () => {
  const [showOnboarding, setShowOnboarding] = useState(null);

  const checkIfAllreadyOnboarding = async () => {
    let onboarded = await getItem('onboarded');
    if (onboarded == 1) {
      setShowOnboarding(false);
    } else {
      setShowOnboarding(true);
    }
  };

  useEffect(() => {
    checkIfAllreadyOnboarding();
  }, []);

  if (showOnboarding == null) {
    return null;
  }

  if (showOnboarding) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Onboarding">
          <Stack.Screen
            name="Onboarding"
            options={{headerShown: false}}
            component={OnboardingScreen}
          />
          <Stack.Screen
            name="Home"
            options={{headerShown: false}}
            component={HomeScreen}
          />
          <Stack.Screen
            name="Todo"
            options={{headerShown: false}}
            component={TodoScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Onboarding"
          options={{headerShown: false}}
          component={OnboardingScreen}
        />
        <Stack.Screen
          name="Home"
          options={{headerShown: false}}
          component={HomeScreen}
        />
        <Stack.Screen
          name="Todo"
          options={{headerShown: false}}
          component={TodoScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>;
  }
};

export default Router;

const styles = StyleSheet.create({});
