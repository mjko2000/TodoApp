import PushNotification from 'react-native-push-notification'

export const addNotification = async (id:any,time: any,message:any) => {
  PushNotification.createChannel(
    {
      channelId: id, // (required)
      channelName: "My channel", // (required)
      channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
      soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  );
  await PushNotification.localNotificationSchedule({
    channelId: id,
    message: message, // (required)
    date: time, // in 60 secs
    allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
  });
}

export const removeNotification = (id: any) => {
  PushNotification.deleteChannel(id)
}