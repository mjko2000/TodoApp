import firestore from '@react-native-firebase/firestore';
import {userData} from '../config/setting'

export const addTaskDone = (data) => {
  return firestore().collection('users').doc(userData.email).collection('tasks').add(data)
}

// export const getListDoneTasks = () => {
//   return firestore().collection('users').doc(userData.email).collection('tasksDone').get().then(value => value.docs.map(item => item.data()));
// }

export const getListDoneTasks = (setData,orderBy) => {
  return firestore().collection('users').doc(userData.email).collection('tasks').where('status','==', 2).onSnapshot(snap => {
    const data = snap.docs.map(item => {
      return {...item.data(), id: item.id}
    })
    switch(orderBy){
      case 'timeCreate': data.sort((a,b) => a.time - b.time);break
      case 'fromTime': data.sort((a,b) => a.fromTime - b.fromTime);break
      case 'rate': data.sort((a,b) => b.rate - a.rate);break
      case 'status': data.sort((a,b) => b.status - a.status);break
    }
    setData(data)
  })
}

export const getListUnDoneTasks = (setData,orderBy) => {
  return firestore().collection('users').doc(userData.email).collection('tasks').where('status','<', 2).onSnapshot(snap => {
    const data = snap.docs.map(item => {
      return {...item.data(), id: item.id}
    })
    switch(orderBy){
      case 'timeCreate': data.sort((a,b) => a.time - b.time);break
      case 'fromTime': data.sort((a,b) => a.fromTime - b.fromTime);break
      case 'rate': data.sort((a,b) => b.rate - a.rate);break
      case 'status': data.sort((a,b) => b.status - a.status);break
    }
    setData(data)
  })
}

export const deleteTask = (id) => {
  return firestore().collection('users').doc(userData.email).collection('tasks').doc(id).delete()
}

export const changeStatus = (id, status) => {
  if(status == 2) return
  return firestore().collection('users').doc(userData.email).collection('tasks').doc(id).update({status: status+1})
}