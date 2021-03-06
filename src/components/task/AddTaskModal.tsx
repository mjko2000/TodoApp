import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity, StyleSheet, Text, ScrollView,Switch } from 'react-native'
import BottomSheet from '../custom/BottomSheet'
import size from '../../res/assert/size'
import { addTaskDone, editTask } from '../../api/taskFirebase'
import { TextInput, RadioButton, Button } from 'react-native-paper'
import TimePicker from '../custom/TimePicker'
import Icon from 'react-native-vector-icons/FontAwesome5'
import DatePicker from '../custom/DatePicker'
import AlertModal from '../custom/AlertModal'
import {addNotification} from '../../Notification'
import { storeTaskUndoneLocal , editLocalTask} from '../../api/getTaskLocal'
import { connect } from '../../config/setting'

const AddTaskModal: React.FC = (props: any) => {
  const { show, onClose, data, onRefresh } = props
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [fromTime, setFromTime] = useState(new Date().getTime())
  const [toTime, setToTime] = useState(new Date().getTime())
  const [rate, setRate] = useState(0)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isAlert, setAlert] = useState(false)
  const [id, setID] = useState()
  const [time, setTime] = useState()
  useEffect(() => {
    if(data){
      setTitle(data.title)
      setNote(data.note)
      setFromTime(data.fromTime)
      setToTime(data.toTime)
      setRate(data.rate)
      setAlert(data.isAlert)
      setID(data.id)
      setTime(data.time)
    }else{
      setTitle('')
      setNote('')
      setFromTime(new Date().getTime())
      setToTime(new Date().getTime())
    }
  },[data])
  const onAddTask = async () => {
    setLoading(true)
    if(!title || !note){
      setMessage("Please fill the form!")
      setLoading(false)
      return
    }
    try{
      const data = {
        id: new Date().getTime()+'',
        title: title,
        note: note,
        time: new Date().getTime(),
        fromTime: fromTime.getTime ? fromTime.getTime() : fromTime,
        toTime: toTime.getTime ? toTime.getTime() : toTime,
        rate: rate,
        status: 0,
        isAlert: isAlert
      }
      if(connect.type == 'local'){
        await storeTaskUndoneLocal(data)
        onRefresh()
      }else{
        await addTaskDone(data)
      }
      isAlert && addNotification(data.id,new Date(fromTime - 1000*60*30),"Your task "+data.title+" is coming time!")
      setNote('')
      setTitle('')
      onClose()
    }catch(err){
      console.log(err)
    }
    setLoading(false)
  }
  const onEditTask = async () => {
    setLoading(true)
    try{
      const data = {
        id: id,
        title: title,
        note: note,
        time: time.getTime ? time.getTime() : time,
        fromTime: fromTime.getTime ? fromTime.getTime() : fromTime,
        toTime: toTime.getTime ? toTime.getTime() : toTime,
        rate: rate,
        status: 0,
        isAlert: isAlert
      }
      if(connect.type == 'local'){
        await editLocalTask(data)
        onRefresh()
      }else{
        await editTask(data)
      }
      setNote('')
      setTitle('')
      setFromTime(new Date().getTime())
      setToTime(new Date().getTime())
      onClose()
    }catch(err){
      console.log(err)
    }
    setLoading(false)
  }
  return (
    <BottomSheet
      show={show}
      height = {size.s340*3.4}
      disableHeader={true}
      onCancel={() => onClose()}
      placeHolder={<View />}
      children={
        <ScrollView style={styles.content}>
          <AlertModal 
            show = {message ? true : false}
            message = {message}
            type = 'alert'
            title = 'Alert'
            onClose = {() => setMessage(null)}
          />
          <Text style={styles.headerText}>Add task</Text>
          <TextInput
            value = {title}
            style={styles.inputField} mode='flat'
            label="Title" onChangeText={setTitle}
          />
          <TextInput
            value = {note}
            style={styles.inputField} mode='flat'
            label="Note" onChangeText={setNote}
          />
          <Text style = {styles.titleText}>From time:</Text>
          <TimeSelector time = {fromTime} setTime = {setFromTime} />

          <Text style = {styles.titleText}>To time:</Text>
          <TimeSelector time = {toTime} setTime = {setToTime} />

          <Text style = {styles.titleText}>Rate:</Text>
          <SelectRate rate = {rate} setRate = {setRate} />
          <View style = {{flexDirection: 'row', alignItems: 'center', marginBottom: size.s30, alignSelf: 'flex-end'}}>
            <Text style = {styles.titleText}>Turn on notification:</Text>
            <Switch
              style = {{alignSelf: 'flex-start'}}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isAlert ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={setAlert}
              value={isAlert}
            />
          </View>
          <Button 
            icon="check" mode="contained" 
            onPress={() => data ? onEditTask() : onAddTask()}
            loading = {loading}
            disabled = {loading}
          >
            Done
          </Button>
        </ScrollView>
      }
    />
  )
}

const TimeSelector = (props: any) => {
  const {setTime} = props
  const time = new Date(props.time)
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: size.s20 }}>
      <DatePicker
        placeHolder={
          <View style={styles.timePicker}>
            <View>
              <Text style = {[styles.titleText, {color:'#999999'}]}>Date:</Text>
              <Text style = {styles.titleText}>
                {time.getDate()}/{time.getMonth() + 1}/{time.getFullYear()}</Text>
            </View>
            <Icon name='calendar-alt' size={size.s50} style={{ marginLeft: size.s20 }} />
          </View>
        }
        onSelect = {res => {
          const newDate = new Date(time)
          newDate.setDate(res?.date)
          newDate.setMonth(res?.month-1)
          newDate.setFullYear(res?.year)
          setTime(newDate)
        }}
      />
      <TimePicker
        placeHolder={
          <View style={styles.timePicker}>
            <View>
              <Text style = {[styles.titleText, {color:'#999999'}]}>Time:</Text>
              <Text style = {styles.titleText}>
                {time.getHours() <= 12 ? time.getHours(): time.getHours() - 12}:{time.getMinutes()} {time.getHours()>12 ? 'PM':'AM'}
              </Text>
            </View>
            <Icon name='calendar-alt' size={size.s50} style={{ marginLeft: size.s20 }} />
          </View>
        }
        onSelect = {res => {
          const newDate = new Date(time)
          newDate.setMilliseconds(new Date().getMilliseconds())
          newDate.setSeconds(new Date().getSeconds())
          newDate.setHours(res?.hour)
          newDate.setMinutes(res?.min)
          setTime(newDate)
          console.log(newDate.getMilliseconds(), newDate.getSeconds())
        }}
      />
    </View>
  )
}

const SelectRate = (props:any) => {
  const {rate, setRate} = props

  return (
    <RadioButton.Group onValueChange={newValue => setRate(newValue)} value={rate}>
      <View style = {{flexDirection: 'row', justifyContent: 'space-between', marginBottom: size.s20}}>
        <View style = {{flexDirection: 'row', alignItems: 'center'}}>
          <Text style = {styles.text}>Low</Text>
          <RadioButton value={0} color = '#00aaff' />
        </View>
        <View style = {{flexDirection: 'row', alignItems: 'center'}}>
          <Text style = {styles.text}>Medium</Text>
          <RadioButton value={1} color = '#00aaff' />
        </View>
        <View style = {{flexDirection: 'row', alignItems: 'center'}}>
          <Text style = {styles.text}>High</Text>
          <RadioButton value={2} color = '#00aaff' />
        </View>
      </View>
    </RadioButton.Group>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: size.s10,
  },
  inputField: {
    fontFamily: 'OpenSans-Bold',
    marginBottom: size.s20,
    height: size.s120,
  },
  headerText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: size.h36,
    alignSelf: 'center',
    paddingVertical: size.s20,
    color: '#00aaff',
  },
  timePicker: {
    width: size.s340,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: size.s10,
    paddingHorizontal: size.s40,
    borderWidth: 1,
    borderRadius: size.s30,
    borderColor: '#00000075',
  },
  titleText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: size.h30,
    color: '#383838',
  },
  text:{
    fontFamily: 'OpenSans-Regular',
    color: '#383838',
  }
})

export default AddTaskModal