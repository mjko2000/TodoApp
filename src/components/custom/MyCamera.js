'use strict';
import React, { useState } from 'react';
import { Component } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import size from '../../res/assert/size';

const propsType = {
    onTakePicture: () => {return reponse},
    placeHolder: Component,
    takePictureIcon: Component
}

const MyCamera = (props = propsType) => {

    const {onTakePicture, placeHolder, takePictureIcon} = props;

    const [camera,setCamera] = useState();
    const [show,setShow] = useState(false)
    const [isFront, setFront] = useState(false)

    const takePicture = async () => {
        if (camera) {
          const data = await camera.takePictureAsync({quality: 0.5, base64: false });
          setShow(false)
          onTakePicture(data);
        }
      };

    return (
      <View>
        <TouchableOpacity
            onPress = {() => setShow(true)}
        >
            {placeHolder ? placeHolder :
            (
                <Text>Touch to open Camera</Text>
            )}
        </TouchableOpacity>
        <Modal visible = {show} style = {styles.container} animationType ='fade'>
            <View style = {styles.header}>
                <TouchableOpacity onPress = {() => setShow(false)}>
                    <Text style = {{color: 'white', fontSize: size.s35, paddingVertical: size.s10, paddingHorizontal: size.s20}}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress = {() => setFront(!isFront)}>
                    {/* <Text style = {{color: 'white', fontSize: size.s35, paddingVertical: size.s10, paddingHorizontal: size.s20}}></Text> */}
                </TouchableOpacity>
            </View>
            <RNCamera
              ref={ref => {setCamera(ref)}}
              style={styles.preview}
              type={isFront ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
              flashMode={RNCamera.Constants.FlashMode.off}
              androidCameraPermissionOptions={{
                  title: 'Quyền truy cập camera',
                  message: 'Chúng tôi cần quyền sử dụng camera của bạn!',
                  buttonPositive: 'Đồng ý',
                  buttonNegative: 'Hủy',
              }}
              androidRecordAudioPermissionOptions={{
                  title: 'Quyền sử dụng thu âm',
                  message: 'Chúng tôi cần quyền sử dụng microphone của bạn!',
                  buttonPositive: 'Đồng ý',
                  buttonNegative: 'Hủy',
              }}
            />
            <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'center', backgroundColor: 'black' }}>
                <TouchableOpacity onPress={() => takePicture()} style={styles.capture}>
                    {takePictureIcon ? takePictureIcon : <Text style={{ fontSize: size.h28 }}> SNAP </Text>}
                </TouchableOpacity>
            </View>
        </Modal>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  header:{
    flex: 1.2,
    flexDirection: 'row',
    backgroundColor: 'black',
    alignItems: 'center',
    paddingHorizontal: 20
},
  preview: {
    flex: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

export default MyCamera;
