import React, { useState, useEffect } from 'react'
import { StatusBar, StyleSheet, View, ScrollView, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Dimensions } from 'react-native'
import size from '../../res/assert/size'
import { useSelector, useDispatch } from 'react-redux';
import {sendRegisAction} from '../../redux/actions/loginActions/login'
import { Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons'

const screen = Dimensions.get('screen')

const Task: React.FC = (props: any) => {
  const {navigation} = props
  const user = useSelector((state: any) => state.loginReducer.user);

  const dispatch = useDispatch();

  useEffect(() => {
    // if(user)props.navigation.navigate('Route')
  })
  return (
    <View style = {styles.content}>
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    flex:1,
    backgroundColor: '#dbdbdb',
  },
})
export default Task