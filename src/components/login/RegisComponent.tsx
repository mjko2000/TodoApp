import React, { useState, useEffect } from 'react'
import { StatusBar, StyleSheet, View, ScrollView, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Dimensions } from 'react-native'
import size from '../../res/assert/size'
import auth from '@react-native-firebase/auth';
import { useSelector, useDispatch } from 'react-redux';
import {sendRegisAction, sendRegisResetAction} from '../../redux/actions/loginActions/login'
import Loading from '../custom/Loading'
import AlertModal from '../custom/AlertModal'
import Icon from 'react-native-vector-icons/MaterialIcons'
const screen = Dimensions.get('screen')

const RegisComponent: React.FC = (props: any) => {
  const {navigation} = props
  const status = useSelector((state: any) => state.regisReducer.status);
  const messageReducer = useSelector((state: any) => state.regisReducer.message);
  const loading = useSelector((state: any) => state.regisReducer.loading);
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const dispatch = useDispatch();
  const postRegis = () => {dispatch(sendRegisAction(username,email,password))}
  const resetRegis = () => {dispatch(sendRegisResetAction())}
  const onLogin = () => {
    if(!email || !password || !username){
      setMessage('Please fill the form!')
      return
    }
    postRegis()
  }
  useEffect(() => {
    if(status == 'SUCCESS'){
      resetRegis()
      props.navigation.goBack()
    }
    if(status == 'FAIL'){
      setMessage(messageReducer)
    }
  })
  return (
    <View style = {styles.content}>
      <StatusBar translucent = {true} barStyle = 'dark-content' backgroundColor = 'transparent' />
      {loading && <Loading />}
      <AlertModal
        type = 'alert'
        show = {message ? true : false}
        message = {message}
        onClose = {() => {resetRegis(); setMessage('')}}
      />
      <KeyboardAvoidingView style = {{flex: 1}} behavior = 'padding' keyboardVerticalOffset = {-size.s340}>
      <TouchableOpacity style = {styles.backBtn} onPress = {() => navigation.goBack()}>
        <Icon name = 'arrow-back' size = {size.s60} color = 'grey' />
      </TouchableOpacity>
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
  },
  backBtn: {
    position: 'absolute',
    top: size.s100,
    left: size.s40,
    padding: size.s10,
    zIndex: 1
  }
})
export default RegisComponent