import React, { useState, useEffect, useMemo, memo } from 'react'
import { Easing, StyleSheet, View, Text, TextInput, TouchableOpacity, Animated } from 'react-native'
import size from '../../res/assert/size'
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons'
import {deleteTask, changeStatus} from '../../api/taskFirebase'
import {removeNotification} from '../../Notification'
const AnimatedTouch = Animated.createAnimatedComponent(TouchableOpacity)
const Task: React.FC = (props: any) => {
  const { title, id, fromTime, toTime, time, rate, note, status } = props
  const fromDate = new Date(fromTime?.seconds*1000)
  const toDate = new Date(toTime?.seconds*1000)
  const user = useSelector((state: any) => state.loginReducer.user);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false)
  // const animCard = new Animated.Value(1)
  const [animCard,] = useState(new Animated.Value(1))

  const bounce = () => {
    Animated.timing(animCard, {
      toValue: 0.85,
      easing: Easing.bounce,
      duration: 300,
      useNativeDriver: false
    }).start(() => {
      setShowModal(true)
      Animated.timing(animCard, {
        toValue: 1,
        easing: Easing.bounce,
        duration: 300,
        useNativeDriver: false
      }).start(() => {})
    })
  }

  return (
    <AnimatedTouch
      onPress = {() => bounce()}
      // onPressIn={() => bounce()}
      style={[styles.container, { transform: [{ scale: animCard }] }]}
    >
      <ModalCard 
        show={showModal} 
        onCancel = {() => {
          setShowModal(false)
        }}
        onEdit = {() => {
          setShowModal(false)
        }}
        onDelete = {() => {
          setShowModal(false)
          deleteTask(id)
          removeNotification(id)
        }}
        onActive = {() => {
          setShowModal(false)
          changeStatus(id,status)
        }}
        status = {status}
      />
      <View style = {{flex:1, flexDirection: 'row'}}>
        <View 
          style = {[styles.leftColor, {backgroundColor: rate == 0 ? '#3dc2ff' : rate == 1 ? '#ffa436' : 'red'}]}
        />
        <View style = {{flex:1, margin: size.s20}}>
          <Text style = {styles.text}>
            {fromDate.getHours()}:{fromDate.getMinutes()} - {toDate.getHours()}:{toDate.getMinutes()} {timeToText(fromDate)}
          </Text>
          <Text style = {styles.title}>{title}</Text>
          <View style = {{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style = {[styles.text, {maxWidth: '80%'}]} numberOfLines = {4}>{note}</Text>
            <Text style = {styles.statusText}>
              {status == 0 ? 'Idle' : status == 1 ? 'Doing' : 'Done'}
            </Text>
          </View>
        </View>
      </View>
    </AnimatedTouch>
  );
}

const ModalCard = (props: any) => {
  const { show, onDelete, onEdit, onActive, onCancel, status } = props
  return (
    show ? 
    <TouchableOpacity style = {styles.modalContent}>
      <TouchableOpacity onPress = {() => onCancel()} style = {styles.modalBtn}>
        <Icon name = 'cancel' size = {size.s100} color = '#bdbdbd' />
        <Text style = {styles.textModal}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity style = {styles.modalBtn} onPress = {() => onDelete()} >
        <Icon name = 'delete' size = {size.s100} color = '#ff3636' />
        <Text style = {styles.textModal}>Delete</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress = {() => onEdit()} style = {styles.modalBtn}>
        <Icon name = 'edit' size = {size.s100} color = '#ffff96' />
        <Text style = {styles.textModal}>Edit</Text>
      </TouchableOpacity>
      {status < 2 && 
        <TouchableOpacity onPress = {() => onActive(false)} style = {styles.modalBtn}>
          <Icon name = 'check' size = {size.s100} color = '#0dff29' />
          <Text style = {styles.textModal}>Active</Text>
        </TouchableOpacity>
      }
    </TouchableOpacity> : null
  )
}

const timeToText = (time: any) => {
  const fromTime = new Date(time);
  const nowDate = new Date();
  const timeTamp = fromTime.getTime() - nowDate.getTime()
  if (timeTamp / 1000 / 60 / 60 > 0 && timeTamp / 1000 / 60 / 60 < 24) return ('Today')
  if (timeTamp / 1000 / 60 / 60 > 0 && timeTamp / 1000 / 60 / 60 / 24 < 2) return ('Tomorow')
  var dd = String(fromTime.getDate()).padStart(2, '0');
  var mm = String(fromTime.getMonth() + 1).padStart(2, '0');
  var yyyy = fromTime.getFullYear();
  if (timeTamp / 1000 / 60 / 60 < 0) return ('Passed, day: ' + dd + '/' + mm + '/' + yyyy)
  return dd + '/' + mm + '/' + yyyy;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: size.s260,
    marginHorizontal: size.s20,
    marginBottom: size.s50,
    borderRadius: size.s40,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,

    elevation: 14,
  },
  modalContent: {
    width:'100%',
    height:'100%', 
    borderRadius: size.s40, 
    flexDirection: 'row', 
    justifyContent: 'space-evenly', 
    alignItems: 'center', 
    position: 'absolute', 
    zIndex: 1,
    backgroundColor: '#00000090'
  },
  text: {
    fontFamily: 'OpenSans-Regular',
    color: '#737373'
  },
  textModal:{
    fontFamily: 'OpenSans-Regular',
    color: 'white'
  },
  title: {
    fontFamily: 'OpenSans-Bold',
    color: '#242424'
  },
  modalBtn: {
    alignItems: 'center',
    padding: size.s20,
  },
  leftColor: {
    height: '100%',
    width: '7%', 
    backgroundColor: 'red',
    borderTopLeftRadius: size.s40,
    borderBottomLeftRadius: size.s40
  },
  statusText: {
    fontFamily: 'OpenSans-Bold',
    color: '#6e6e6e',
    alignSelf: 'flex-end'
  },
})
export default memo(Task)