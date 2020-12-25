import React, { useState, useEffect } from 'react'
import { StatusBar, StyleSheet, View, ScrollView, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Dimensions } from 'react-native'
import size from '../../res/assert/size'
import auth from '@react-native-firebase/auth';
import { useSelector, useDispatch } from 'react-redux';
import {sendLoginAction, resetLoginAction} from '../../redux/actions/loginActions/login'
import AlertModal from '../custom/AlertModal'
import Loading from '../custom/Loading'
import { connect } from '../../config/setting';
import * as Keychain from 'react-native-keychain';
import { Checkbox } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screen = Dimensions.get('screen')

const LoginComponent: React.FC = (props: any) => {
  const {navigation} = props
  const user = useSelector((state: any) => state.loginReducer.user)
  const message = useSelector((state: any) => state.loginReducer.error)
  const loading = useSelector((state: any) => state.loginReducer.loading)
  const [loadingLocal, setLoadingLocal] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [checked, setChecked] = useState(false)
  const dispatch = useDispatch();
  const postLogin = (emaill:any,passwordd:any) => {dispatch(sendLoginAction(emaill,passwordd)); console.log('sss')}
  const resetLogin = () => {dispatch(resetLoginAction()); console.log('sss')}

  const onLogin = () => {
    if(!email || !password) return
    postLogin(email,password)
  }
  useEffect(() => {
    didmountAsysn()
  },[])
  useEffect(() => {
    checkLogin()
  })
  const didmountAsysn = async () => {
    setLoadingLocal(true)
    const isCheck = await AsyncStorage.getItem('remember')
    if(!isCheck){
      setLoadingLocal(false)
      return
    }
    if(isCheck == 'true'){
      setChecked(true)
      Keychain.getGenericPassword().then(result => {
        setLoadingLocal(false)
        if(!result) return
        setEmail(result.username)
        setPassword(result.password)
        postLogin(result.username, result.password)
      })
    }
  }
  const checkLogin = async () => {
    if(user){
      connect.type = 'online'
      if(checked){
        await AsyncStorage.setItem('remember','true')
        await Keychain.setGenericPassword(email, password);
      }else{
        await Keychain.resetGenericPassword();
      }
      navigation.replace('Route')
    }
  }
  return (
    <View style = {styles.content}>
      <StatusBar translucent = {true} barStyle = 'dark-content' backgroundColor = 'transparent' />
      <AlertModal
        type = 'alert'
        show = {message ? true : false}
        message = {message}
        onClose = {resetLogin}
      />
      {(loading || loadingLocal) && <Loading />}
      <KeyboardAvoidingView style = {{flex: 1}} behavior = 'padding' keyboardVerticalOffset = {-size.s340}>
      <ScrollView contentContainerStyle = {{flex: 1}} keyboardShouldPersistTaps = 'handled' >
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
              <Text style = {[styles.text,{color: 'white'}]}>Sign In</Text>
            </TouchableOpacity>
            <View style = {{flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start'}}>
              <Checkbox
                color = '#03b1fc'
                status={checked ? 'checked' : 'unchecked'}
                onPress={() => {
                  setChecked(!checked);
                }}
              />
              <Text style = {[styles.text, {color: '#00000050'}]}>Remember</Text>
            </View>
            <TouchableOpacity
              style = {{marginBottom: size.s20}}
              onPress = {() => {
                connect.type = 'local'
                navigation.navigate('Route')
              }}
            >
              <Text style = {styles.text}>Guest (Offline Mode)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress = {() => navigation.navigate('Regis')}
            >
              <Text style = {styles.text}>Sign Up</Text>
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
    marginBottom: size.s20
  },
  text: {
    fontFamily: 'OpenSans-Regular',
  }
})
export default LoginComponent