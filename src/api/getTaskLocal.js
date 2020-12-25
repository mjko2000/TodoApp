import AsyncStorage from '@react-native-async-storage/async-storage';

export var tasksLocal = []

export const storeTaskUndoneLocal = async (json) => {
  try {
    if(json != null)tasksLocal.push(json)
    const jsonValue = JSON.stringify(tasksLocal)
    await AsyncStorage.setItem('tasks', jsonValue)
  } catch (e) {
    console.log(e)
  }
}

export const editLocalTask = async (data) => {
  tasksLocal[tasksLocal.findIndex(value => value.id == data.id)] = data
  const jsonValue = JSON.stringify(tasksLocal)
  await AsyncStorage.setItem('tasks', jsonValue)
}

export const deleteLocalTask = async (data) => {
  tasksLocal.splice(tasksLocal.findIndex(value => value.id == data.id),1)
  const jsonValue = JSON.stringify(tasksLocal)
  await AsyncStorage.setItem('tasks', jsonValue)
}

export const changeStatusLocal = async (data) => {
  if(data.status == 2) return
  tasksLocal[tasksLocal.findIndex(value => value.id == data.id)].status += 1;
  await storeTaskUndoneLocal()
  return 
}


export const getListDoneLocal = async (callback, orderBy) => {
  try {
    const jsonValue = await AsyncStorage.getItem('tasks')
    var result = JSON.parse(jsonValue)
    if(result == null){
      tasksLocal = []
      return callback([])
    }
    tasksLocal = result
    console.log(result)
    result = result.filter(item => item.status == 2);
    switch(orderBy){
      case 'timeCreate': result.sort((a,b) => a.time - b.time);break
      case 'fromTime': result.sort((a,b) => b.fromTime - a.fromTime);break
      case 'rate': result.sort((a,b) => b.rate - a.rate);break
      case 'status': result.sort((a,b) => b.status - a.status);break
    }
    return callback(result)
  } catch(e) {
    return []
  }
}
export const getListUndoneLocal = async (callback, orderBy) => {
  try {
    const jsonValue = await AsyncStorage.getItem('tasks')
    var result = JSON.parse(jsonValue)
    if(result == null){
      tasksLocal = []
      return callback([])
    }
    tasksLocal = result
    result = result.filter(item => {console.log(item.status); return item.status < 2});
    switch(orderBy){
      case 'timeCreate': result.sort((a,b) => a.time - b.time);break
      case 'fromTime': result.sort((a,b) => a.fromTime - b.fromTime);break
      case 'rate': result.sort((a,b) => b.rate - a.rate);break
      case 'status': result.sort((a,b) => b.status - a.status);break
    }
    return callback(result)
  } catch(e) {
    console.log(e)
    return []
  }
}