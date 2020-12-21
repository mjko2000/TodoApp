//Linhtn23

import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs'
import LoginComponent from './components/login/LoginComponent'
import RegisComponent from './components/login/RegisComponent'
import ProfileComponent from './components/profile/ProfileComponent'
import TaskComponent from './components/task/TaskComponent'
import Icon from 'react-native-vector-icons/FontAwesome5';
import size from './res/assert/size';

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();
const App: React.FC = (props) => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName = "Login" headerMode = 'none' >
        <Stack.Screen name="Login" children={(props: any) => <LoginComponent {...props} />}/>
        <Stack.Screen name="Regis" children={(props: any) => <RegisComponent {...props} />}/>
        <Stack.Screen name="Route" children = {props => 
          <Tab.Navigator sceneAnimationEnabled = {true} shifting = {true}>
            <Tab.Screen name="Task" options = {{tabBarIcon:({color}) => <Icon name="tasks" size={size.s50} color={color} />}}
              children={(props: any) => <TaskComponent {...props} />} />
            <Tab.Screen name="Profile" options = {{tabBarIcon:({color}) => <Icon name="user-circle" size={size.s50} color={color} />}}
              children={(props: any) => <ProfileComponent {...props} />} />
          </Tab.Navigator>}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App