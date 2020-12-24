import React, { Component, useState, useEffect, memo, } from 'react';
import CameraRoll from '@react-native-community/cameraroll'
import { PermissionsAndroid, Image, Text, View, TouchableOpacity, Modal, FlatList, Dimensions, StatusBar, SafeAreaView, Linking, Alert, Platform } from "react-native";
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';
import images from '../../res/image/index'
import MyCamera from './MyCamera'
import Loading from './Loading'
import AlertModal from './AlertModal'

const width = Dimensions.get('window').width;
// const height = Dimensions.get('window').height;

const propType = {
    //hàm trả về ảnh được chọn
    onSelected: (reponse = reponseType) => { },

    //Bao gồm base64 true false
    base64: Boolean,

    //Component hiển thị để show image picker
    placeHolderComponent: Component,

    quality: Number,

    multiSelect: Boolean,

    maxLength: Number,

    selectedImages: [Number]
}

//Kiểu trả về
const reponseType = {
    filename: String,
    base64: String,
    uri: String,
    size: Number,
    index: Number
}

var clone = []
var selected = []



const ImagePickerCustom = (props = propType) => {


    const [imageData, setImageData] = useState([]);
    const [imageNum, setImageNum] = useState(0);
    const [show, setShow] = useState(false)
    const [tillMore, setMore] = useState(true)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState()

    useEffect(() => {
        selectCount = 0;
    }, []);

    const didMount = async () => {
        await hasAndroidPermission();
        // getPhoto();
        setImageNum(100)
    }

    const getPhoto = () => {
        try {
            CameraRoll.getPhotos({
                first: imageNum,
                assetType: 'Photos',
                include: ['filename', 'imageSize'],
                groupTypes: 'All'
            })
                .then((r) => {
                    if (!r.page_info.has_next_page) setMore(false)
                    setImageData(r.edges)
                })
                .catch((err) => {
                    Platform.OS == 'ios' ? Alert.alert('Truy cập ảnh', 'Chúng tôi cần truy cập thư viện ảnh của bạn!',
                        [{ text: "Đồng ý", onPress: () => { Linking.openURL('app-settings:') } },
                        { text: "Từ chối", onPress: () => { } }
                        ]) : null
                    console.log(err, "ERRRRRRORORORORORORORORO")
                })
        } catch (err) {
            console.log(err, "ERRRRRRORORORORORORORORO")
        }
    }

    useEffect(() => {
        if (!tillMore || !imageNum) return
        getPhoto();
    }, [imageNum]);

    async function hasAndroidPermission() {
        const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

        const hasPermission = await PermissionsAndroid.check(permission);
        if (hasPermission) {
            return true;
        }

        const status = await PermissionsAndroid.request(permission);
        return status === 'granted';
    }

    const getData = async (item, index) => {
        if (loading) return
        if (props.multiSelect) {
            if (selected.includes(index)) {
                const temp = selected;
                await temp.splice(selected.indexOf(index), 1)
                selected = temp;
            } else {
                selected = selected.concat(index)
            }
            return
        }
        setLoading(true)
        const reponse = {
            filename: item.node.image.filename,
            uri: item.node.image.uri,
            base64: null,
            size: null,
            index: index
        }
        if (props.base64) {
            await ImageResizer.createResizedImage(item.node.image.uri, item.node.image.width, item.node.image.height, 'JPEG', props.quality ? props.quality : 100)
                .then(({ uri, size }) => { reponse.size = size; reponse.uri = uri })
                .catch(err => { });
        }
        // props.base64 ? reponse.uri = await ImageResizer.createResizedImage(item.node.image.uri, item.node.image.width, item.node.image.height, 'JPEG', props.quality ? props.quality : 100)
        //     .then(({uri,size}) => {console.log(size);return uri})
        //     .catch(err => {}) : null;
        props.base64 ? await RNFS.readFile(reponse.uri, 'base64')
            .then(res => {
                reponse.base64 = res
            }).catch(err => { }) : null
        setLoading(false)
        props.onSelected && props.onSelected(reponse)
        reset()
        setShow(false)
    }

    const getAllData = async () => {
        for (var i = 0; i < selected.length; i++) {
            await bindData(selected[i]);
        }
        if (selected.length > 0) {
            props.onSelected(clone)
        } else {
            props.onSelected([])
        }
        setLoading(false)
        setShow(false)
        reset()
    }

    const bindData = async (index) => {
        const reponse = await getReponse(imageData[index], index)
        clone = await clone.concat(reponse)
    }

    const getReponse = async (item, index) => {
        const reponse = {
            filename: item.node.image.filename,
            uri: item.node.image.uri,
            base64: null,
            size: null,
            index: index
        }
        if (props.base64) {
            await ImageResizer.createResizedImage(item.node.image.uri, item.node.image.width, item.node.image.height, 'JPEG', props.quality ? props.quality : 100)
                .then(({ uri, size }) => { reponse.size = size; reponse.uri = uri })
                .catch(err => { });
        }
        props.base64 ? await RNFS.readFile(reponse.uri, 'base64')
            .then(res => {
                reponse.base64 = res
            }).catch(err => { }) : null

        return reponse
    }

    const reset = () => {
        clone = []
        selected = []
    }
    return (
        <View>
            <TouchableOpacity onPress={() => { setShow(true); didMount(); }}>
                {props.placeHolderComponent ? props.placeHolderComponent : (
                    <Text style={{ padding: 10, backgroundColor: 'gray', textAlign: 'center' }}>Touch to open my picker</Text>
                )}
            </TouchableOpacity>
            <Modal
                style={{ flex: 1 }}
                visible={show}
                animationType='slide'
                onRequestClose={() => setShow(false)}
            >
                <AlertModal
                    type='alert'
                    show={message ? true : false}
                    onClose={() => setMessage()}
                    message={message}
                />
                {loading && <Loading />}
                <SafeAreaView
                    style={{
                        backgroundColor: props.color ? props.color : "black",
                    }}
                />
                <StatusBar
                    translucent
                    backgroundColor="black"
                    barStyle='light-content'
                />
                <View style={{ flex: 1, backgroundColor: 'black' }}>
                    <View style={{ width: '100%', height: 50, backgroundColor: 'black', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ width: props.multiSelect ? 100 : 50 }}>
                            <TouchableOpacity
                                style={{ width: 50, height: 50, alignItems: 'center', justifyContent: 'center' }}
                                onPress={() => {
                                    reset()
                                    setShow(false)
                                }}>
                                <Image source={{ uri: backUri }} style={{ width: 30, height: 30, tintColor: 'white' }} />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: 20, color: 'white', alignContent: 'center' }}>Thư viện</Text>
                        <View style={{ width: props.multiSelect ? 100 : 50, flexDirection: 'row' }}>
                            <View style={{ width: 50, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                                <MyCamera
                                    placeHolder={<Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={images.ic_camera} />}
                                    takePictureIcon={<Image source={images.ic_camera} />}
                                    onTakePicture={async (response) => {
                                        let filename = response.uri;
                                        filename.split('\\').pop().split('/').pop();
                                        CameraRoll.saveToCameraRoll(filename, "photo").then((response) => {
                                            // selected.map((item,index) => item+1)
                                            getPhoto()
                                        })
                                    }}
                                />
                            </View>
                            <TouchableOpacity
                                style={{ width: 50, height: 50, alignItems: 'center', justifyContent: 'center' }}
                                onPress={() => {
                                    if (!props.multiSelect) return
                                    // if(selected.length == 0){
                                    //     getAllData()
                                    //     setShow(false)
                                    //     return
                                    // }
                                    setLoading(true)
                                    getAllData()
                                }}>
                                {props.multiSelect ? <Text style={{ fontWeight: 'bold', color: 'white' }}>Chọn</Text> : null}
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ width: '100%', height: 1, backgroundColor: 'gray' }} />

                    <FlatList
                        data={imageData}
                        horizontal={false}
                        numColumns={3}
                        // contentContainerStyle = {{flexDirection: 'row',flexWrap: 'wrap'}}a
                        keyExtractor = {(item,index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={(item) => {
                            return <RenderItem
                                item={item.item} index={item.index}
                                getData={(item, index) => getData(item, index)}
                                maxLength={props.maxLength} selectedImages={props.selectedImages}
                                setMessage={setMessage} loading={loading}
                            />
                        }}
                        onEndReachedThreshold={0.2}
                        onEndReached={() => {
                            setImageNum(imageNum + 50);
                        }}
                    />
                </View>
            </Modal>
        </View>
    )
}

const RenderItem = memo(({ item, index, getData, maxLength, selectedImages, setMessage, loading }) => {
    const [active, setActive] = useState(false)
    const s = [];
    useEffect(() => {
        if (selectedImages && selectedImages.includes(index, 0)) {
            if (loading) return
            setActive(!active)
            getData(item, index)
        }
    }, [])
    return (
        <TouchableOpacity
            style={{ width: width / 3, height: width / 3, padding: 1, justifyContent: 'center' }}
            onPress={() => {
                if (active) {
                    setActive(!active)
                    getData(item, index)
                    return
                }
                if (!maxLength) {
                    setActive(!active)
                    getData(item, index)
                    return
                }
                if (selected.length >= maxLength) {
                    setMessage("Chỉ được chọn tối đa " + maxLength + " ảnh")
                    return
                }
                setActive(!active)
                getData(item, index)
            }}
        >
            <Image style={{ flex: 1, borderWidth: 2, borderColor: active ? '#09ff00' : undefined, opacity: active ? 0.3 : 1, backgroundColor: 'transparent' }} source={{ uri: item.node.image.uri }} />
            {active && <Image source={images.ic_check} style={{ position: 'absolute', alignSelf: 'center' }} />}
        </TouchableOpacity>
    )
})

export default ImagePickerCustom;

const backUri = 'data:image/png;base64,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'