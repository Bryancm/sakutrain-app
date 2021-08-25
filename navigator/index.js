import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {HomeScreen} from '../screens/home';
import {QuizScreen} from '../screens/quiz';
import {EndGameScreen} from '../screens/endGame';
import {ScoreHistoryScreen} from '../screens/scoreHistory';
import {SettingsScreen} from '../screens/settings';
import {AboutScreen} from '../screens/about';

const forFade = ({current}) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const Stack = createStackNavigator();

export const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator headerMode={false} mode="card" initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="Quiz"
        component={QuizScreen}
        options={{cardStyleInterpolator: forFade, gestureEnabled: false}}
      />
      <Stack.Screen
        name="EndGame"
        component={EndGameScreen}
        options={{cardStyleInterpolator: forFade, gestureEnabled: false}}
      />
      <Stack.Screen name="ScoreHistory" component={ScoreHistoryScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);
