import React, { useState, useEffect, memo } from 'react'
import { StatusBar, StyleSheet, View, FlatList,  TouchableOpacity } from 'react-native'
import size from '../../res/assert/size'
import TaskItem from './TaskItem'
import Icon from 'react-native-vector-icons/FontAwesome5'
import AddTaskModal from './AddTaskModal'

const Task: React.FC = (props: any) => {
  const {add, data, onRefresh} = props
  const [showAdd, setShowAdd] = useState(false)
  const [isRefresh, setRefresh] = useState(false)
  const [focus, setFocus] = useState()
  useEffect(() => {
    isRefresh && setRefresh(false)
  })
  useEffect(() => {
    focus ? setShowAdd(true): setShowAdd(false)
  },[focus])
  return (
    <View style = {styles.content}>
      {add && 
        <TouchableOpacity 
          onPress = {() => setShowAdd(true)}
          style = {styles.addBtn}>
          <Icon name = 'plus-circle' size = {size.s100} color = '#33b1ff'/>
        </TouchableOpacity>
      }
      
      <AddTaskModal 
        show = {showAdd}
        setShow = {setShowAdd}
        onClose = {() => {
          setShowAdd(false)
          setFocus(null)
        }}
        onRefresh = {onRefresh}
        data = {focus}
      />
      <FlatList
        style = {styles.listStyle}
        data = {data}
        extraData = {data}
        keyExtractor = {(item, index) => index.toString()}
        renderItem = {({item,index}) => <TaskItem data = {item} index = {index} onRefresh = {onRefresh} setFocus = {() => setFocus(item)} />}
        ListHeaderComponent = {() => <View style = {{marginTop: size.s40}} />}
        refreshing = {isRefresh}
        onRefresh = {() => {
          setRefresh(true)
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    flex:1,
    backgroundColor: 'white',
  },
  listStyle: {
    flex:1,
  },
  addBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: size.s20,
    zIndex: 1
  }
})
export default Task