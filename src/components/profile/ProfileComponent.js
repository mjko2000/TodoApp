import React, { useState, useEffect } from 'react'
import { StatusBar, StyleSheet, View, ScrollView, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Dimensions } from 'react-native'
import size from '../../res/assert/size'
import { useSelector, useDispatch } from 'react-redux';
import {sendLogout} from '../../redux/actions/loginActions/login'
import { Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons'

const screen = Dimensions.get('screen')

const Profile = (props) => {
  const {navigation} = props
  const user = useSelector((state) => state.loginReducer.user);

  const dispatch = useDispatch();
  const onLogout = () => dispatch(sendLogout())

  useEffect(() => {
    if(!user)props.navigation.navigate('Login')
  })
  return (
    <View style = {styles.content}>
      <View style = {styles.header}>
        <Avatar.Image size={size.s340} source={{uri: 'https://cdn1.tuoitre.vn/zoom/600_315/2019/5/8/avatar-publicitystill-h2019-1557284559744252594756-crop-15572850428231644565436.jpg'}} />
        <Text style = {styles.userText}>{user?.displayName}ss</Text>
      </View>
      <View style = {styles.row}>
        <Icon name = 'email' size = {size.s100} color = '#03b1fc' />
        <View style = {styles.rowRight}>
          <Text style = {[styles.text, {color: '#03b1fc'}]}>Email</Text>
          <Text>{user?.email}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress = {() => onLogout()}
        style = {styles.logout}>
        <Text style = {styles.userText}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    flex:1,
    backgroundColor: '#dbdbdb',
  },
  header: {
    paddingVertical: size.s20,
    backgroundColor: '#03b1fc',
    alignItems: 'center',
    paddingTop: size.s100
  },
  body: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: size.s120,
  },
  text: {
    fontFamily: 'OpenSans-Regular'
  },
  userText: {
    fontFamily: 'OpenSans-Regular',
    color: 'white'
  },
  row: {
    flexDirection: "row",
    alignItems: 'center',
    margin: size.s20,
  },
  rowRight: {marginLeft: size.s40, borderBottomWidth: 1, paddingVertical: size.s20, flex: 1},
  logout: {
    alignSelf: 'center',
    paddingVertical: size.s30,
    paddingHorizontal: size.s100,
    backgroundColor: '#ff1717',
    borderRadius: size.s50
  }
})
export default Profile