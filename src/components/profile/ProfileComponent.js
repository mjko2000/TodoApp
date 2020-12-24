import React, { useState, useEffect } from 'react'
import { StatusBar, StyleSheet, View, ScrollView, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Dimensions, Alert } from 'react-native'
import size from '../../res/assert/size'
import { useSelector, useDispatch } from 'react-redux';
import {sendLogout} from '../../redux/actions/loginActions/login'
import { Avatar, ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons'
import {uploadAvatar, getDownloadURL} from '../../api/userFirebase'
import ImagePicker from '../custom/ImagePickerCustom'

const screen = Dimensions.get('screen')

const Profile = (props) => {
  const {navigation} = props
  const user = useSelector((state) => state.loginReducer.user);
  const [avatar, setAvatar] = useState(user?.photoURL)
  const [process, setProcess] = useState()

  const dispatch = useDispatch();
  const onLogout = () => dispatch(sendLogout())

  useEffect(() => {
    if(!user)props.navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  })
  return (
    <View style = {styles.content}>
      <View style = {styles.header}>
        <ImagePicker
          base64 = {false}
          quality = {70}
          placeHolderComponent = {<Avatar.Image size={size.s340} source={{uri: avatar}} style = {{backgroundColor: '#d6d6d6'}}  />}
          onSelected = {(res) => {
            const task = uploadAvatar(res.uri, res.filename)
            task.on('state_changed', snapshot => {
              setProcess(snapshot.bytesTransferred / snapshot.totalBytes)
            });
            task.then(async() => {
              const url = await getDownloadURL(res.filename)
              await user?.updateProfile({photoURL: url})
              setAvatar(url)
              Alert.alert('Success','Your avatar has changed!')
              setProcess()
            }).catch(err => {
              setProcess()
              Alert.alert('Fail', 'Erorr when upload your avatar')
            })
          }}
        />
        <Text style = {styles.userText}>{user?.displayName}</Text>
      </View>
      {process > 0 && <ProgressBar progress={process} color={'#0095ff'} />}
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
    backgroundColor: 'white',
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
    fontFamily: 'OpenSans-Bold',
    color: 'white',
    fontSize: size.h32
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
  },
  editBtn: {
    position: 'absolute',
    top: size.s100,
    right: size.s30
  }
})
export default Profile