import storage from '@react-native-firebase/storage'
import {userData} from '../config/setting'

export const uploadAvatar = (uploadUri,filename) => {
  return storage().ref(userData.email+'/images/'+filename).putFile(uploadUri);
}

export const getDownloadURL = (filename) => {
  return storage().ref(userData.email+'/images/'+filename).getDownloadURL()
}