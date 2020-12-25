import React, { useState, useEffect } from 'react'
import { StatusBar, StyleSheet, View, FlatList, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Dimensions } from 'react-native'
import size from '../../res/assert/size'
import { useSelector, useDispatch } from 'react-redux';
import { createMaterialTopTabNavigator, } from '@react-navigation/material-top-tabs';
import TaskComponent from './TaskComponent'
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomSheet from '../custom/BottomSheet'
import { RadioButton, Button, IconButton } from 'react-native-paper'
import { getListUnDoneTasks, getListDoneTasks } from '../../api/taskFirebase'
import { getListUndoneLocal, getListDoneLocal } from '../../api/getTaskLocal'
import { connect } from '../../config/setting';
const Tab = createMaterialTopTabNavigator()

const TaskContainer: React.FC = (props: any) => {
  const [showFilter, setShowFilter] = useState(false)
  const [orderBy, setOrderBy] = useState('fromTime')
  const [unDoneList, setUnDoneList] = useState([])
  const [doneList, setDoneList] = useState([])
  const [subscribe, setSubscribe] = useState({ unsubscribe: () => { } })
  const [subscribe1, setSubscribe1] = useState({ unsubscribe: () => { } })
  useEffect(() => {

    getDoneTask()
    getUnDoneTasks()
  }, [orderBy])
  const getDoneTask = async () => {
    if (connect.type == 'local') {
      getListDoneLocal(setDoneList, orderBy)
      return
    }
    subscribe.unsubscribe && subscribe.unsubscribe()
    const result = await getListUnDoneTasks(setUnDoneList, orderBy)
    setSubscribe({ unsubscribe: result })
  }
  const getUnDoneTasks = async () => {
    if (connect.type == 'local') {
      getListUndoneLocal(setUnDoneList, orderBy)
      return
    }
    subscribe1.unsubscribe && subscribe1.unsubscribe()
    const result = await getListDoneTasks(setDoneList, orderBy)
    setSubscribe1({ unsubscribe: result })
  }
  return (
    <View style={styles.content}>
      <BottomSheet
        disableHeader={true}
        height={size.s340}
        show={showFilter}
        placeHolder={<View />}
        onCancel={() => setShowFilter(false)}
        children={<ModalFilter orderBy={orderBy} setOrderBy={(value) => { setOrderBy(value); setShowFilter(false) }} />}
      />
      <View style={styles.header}>
        <TouchableOpacity
          style={{ padding: size.s10 }}
          onPress={() => setShowFilter(true)}
        >
          <Icon name='filter-list' size={size.s50} />
        </TouchableOpacity>
      </View>
      <Tab.Navigator>
        <Tab.Screen name="Ongoing Task" children={(props) => <TaskComponent {...props} data={unDoneList} add={true} onRefresh={() => {
          getDoneTask()
          getUnDoneTasks()
        }} />} />
        <Tab.Screen name="Done Task" children={(props) => <TaskComponent {...props} data={doneList} add={false} onRefresh={() => {
          getDoneTask()
          getUnDoneTasks()
        }} />} />
      </Tab.Navigator>
    </View>
  )
}

const ModalFilter = (props: any) => {
  const { orderBy, setOrderBy } = props
  const [value, setValue] = useState(orderBy)

  return (
    <View style={{ justifyContent: 'center' }}>
      <Text style={{
        fontWeight: 'bold',
        alignSelf: 'center'
      }}>Order By</Text>
      <RadioButton.Group onValueChange={setValue} value={value}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: size.s20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.text}>Rate</Text>
            <RadioButton value={'rate'} color='#00aaff' />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.text}>Date</Text>
            <RadioButton value={'fromTime'} color='#00aaff' />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.text}>Status</Text>
            <RadioButton value={'status'} color='#00aaff' />
          </View>
        </View>
      </RadioButton.Group>
      <Button icon='filter' mode="contained" onPress={() => { setOrderBy(value) }}>
        Order
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    width: '100%',
    marginTop: size.s80,
    paddingHorizontal: size.s20,
    alignItems: 'flex-end'
  }
})
export default TaskContainer