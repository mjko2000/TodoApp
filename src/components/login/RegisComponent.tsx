import React, { useState, useEffect } from 'react'
import { StatusBar, StyleSheet, View, ScrollView, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Dimensions } from 'react-native'
import size from '../../res/assert/size'
import auth from '@react-native-firebase/auth';
import { useSelector, useDispatch } from 'react-redux';
import {sendRegisAction} from '../../redux/actions/loginActions/login'
import Loading from '../custom/Loading'
const screen = Dimensions.get('screen')

const RegisComponent: React.FC = (props: any) => {
  const {navigation} = props
  const user = useSelector((state: any) => state.regisReducer.user);
  const loading = useSelector((state: any) => state.regisReducer.loading);
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch();
  const postRegis = () => {dispatch(sendRegisAction(username,email,password))}

  const onLogin = () => {
    if(!email || !password) return
    postRegis()
  }
  useEffect(() => {
    if(user)props.navigation.goBack()
  })
  return (
    <View style = {styles.content}>
      <StatusBar translucent = {true} barStyle = 'dark-content' backgroundColor = 'transparent' />
      {loading && <Loading />}
      <KeyboardAvoidingView style = {{flex: 1}} behavior = 'padding' keyboardVerticalOffset = {-size.s340}>
      <ScrollView contentContainerStyle = {{flex: 1}} >
          <View style = {styles.body}>
            <TextInput 
              style = {styles.input} placeholder = 'UserName' 
              onChangeText = {setUsername} placeholderTextColor = '#00000020' 
            />
            <TextInput 
              style = {styles.input} placeholder = 'Email' 
              onChangeText = {setEmail} placeholderTextColor = '#00000020' 
            />
            <TextInput 
              style = {styles.input} placeholderTextColor = '#00000020'
              placeholder = 'Password' onChangeText = {setPassword} secureTextEntry = {true}
            />
            <TouchableOpacity
              onPress = {onLogin}
              style = {styles.button}>
              <Text style = {[styles.text,{color: 'white'}]}>Đăng ký</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    height: screen.height,
    backgroundColor: '#dbdbdb',
  },
  body: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: size.s120,
  },
  input: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: size.s60,
    marginBottom: size.s40,
    textAlign: 'center',
    fontFamily: 'OpenSans-Bold',
    height: size.s100
  },
  button:{
    backgroundColor: '#03b1fc',
    width: '100%',
    borderRadius: size.s60,
    height: size.s100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'OpenSans-Regular'
  }
})
export default RegisComponent