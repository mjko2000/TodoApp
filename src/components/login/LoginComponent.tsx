import React, { useState, useEffect } from 'react'
import { StatusBar, StyleSheet, View, ScrollView, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Dimensions } from 'react-native'
import size from '../../res/assert/size'
import auth from '@react-native-firebase/auth';
import { useSelector, useDispatch } from 'react-redux';
import {sendLoginAction, resetLoginAction} from '../../redux/actions/loginActions/login'
import AlertModal from '../custom/AlertModal'
import Loading from '../custom/Loading'
const screen = Dimensions.get('screen')

const LoginComponent: React.FC = (props: any) => {
  const {navigation} = props
  const user = useSelector((state: any) => state.loginReducer.user)
  const message = useSelector((state: any) => state.loginReducer.error)
  const loading = useSelector((state: any) => state.loginReducer.loading)
  const [email, setEmail] = useState('one.evething@gmail.com')
  const [password, setPassword] = useState('123123')

  const dispatch = useDispatch();
  const postLogin = () => {dispatch(sendLoginAction(email,password)); console.log('sss')}
  const resetLogin = () => {dispatch(resetLoginAction()); console.log('sss')}

  const onLogin = () => {
    if(!email || !password) return
    postLogin()
  }
  useEffect(() => {
    // navigation.navigate('Route')
    if(user)navigation.replace('Route')
    // setUser(null)
  })
  return (
    <View style = {styles.content}>
      <StatusBar translucent = {true} barStyle = 'dark-content' backgroundColor = 'transparent' />
      <AlertModal
        type = 'alert'
        show = {message ? true : false}
        message = {message}
        onClose = {resetLogin}
      />
      {loading && <Loading />}
      <KeyboardAvoidingView style = {{flex: 1}} behavior = 'padding' keyboardVerticalOffset = {-size.s340}>
      <ScrollView contentContainerStyle = {{flex: 1}} >
          <View style = {styles.body}>
            <TextInput
              value = {email}
              style = {styles.input} placeholder = 'Email' 
              onChangeText = {setEmail} placeholderTextColor = '#00000020' 
            />
            <TextInput
              value = {password}
              style = {styles.input} placeholderTextColor = '#00000020'
              placeholder = 'Password' onChangeText = {setPassword} secureTextEntry = {true}
            />
            <TouchableOpacity
              onPress = {onLogin}
              style = {styles.button}>
              <Text style = {[styles.text,{color: 'white'}]}>Đăng nhập</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress = {() => navigation.navigate('Regis')}
            >
              <Text style = {styles.text}>Đăng ký</Text>
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
    height: size.s100,
  },
  button:{
    backgroundColor: '#03b1fc',
    width: '100%',
    borderRadius: size.s60,
    height: size.s100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: size.s40
  },
  text: {
    fontFamily: 'OpenSans-Regular',
  }
})
export default LoginComponent