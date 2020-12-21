import React, { Component, useState, useEffect, } from 'react';
import { View, StyleSheet, Text, Animated, Modal, TouchableOpacity, Image, StatusBar } from 'react-native';
import Sizes from '../../res/assert/size'
import images from '../../res/image'

const propType = {
    show: Boolean,
    title: String,
    type: "alert" | "option",
    message: String,
    onClose: () => { },
    headerStyle: Object,
    contentStyle: Object,
    bodyStyle: Object,
    btnRightColor: String,
    bottomStyle: Object,
    leftTitle: String,
    rightTitle: String,
    alertIcon: Component,
    onTouchLeft: () => { },
    onTouchRight: () => { }
}

const MyModal = (props = propType) => {

    const [show, setShow] = useState(false)
    const [scaleA, setScaleA] = useState(new Animated.Value(0))

    const onShow = () => {
        setShow(true)
        Animated.timing(
            scaleA,
            {
                toValue: 1,
                duration: 250,
                useNativeDriver: false
            }
        ).start();
    }

    const onClose = () => {
        Animated.timing(
            scaleA,
            {
                toValue: 0,
                duration: 250,
                useNativeDriver: false
            }
        ).start(() => {
            setShow(false);
            props.onClose && props.onClose()
        });
    }

    useEffect(() => {
        if (props.show == true) {
            onShow()
        }
        if (props.show == false) {
            onClose()
        }
    }, [props.show])

    const onLeftBtn = () => {
        props.onTouchLeft && props.onTouchLeft()
        onClose()
    }
    const onRightBtn = () => {
        props.onTouchRight && props.onTouchRight()
        onClose()
    }
    return (
        <Modal
            visible={show}
            style={{ flex: 1 }}
            transparent={true}
        >
            <StatusBar barStyle = 'dark-content' backgroundColor = '#00000060'/>
            <View style={styles.content}>
                <Animated.View style={[styles.modal, props.contentStyle, { transform: [{ scale: scaleA }] }]}>

                    <View style={[styles.body, props.bodyStyle]}>
                        {props.type == "alert" && <Image source={props.alertIcon ? props.alertIcon : images.ic_alert} style={styles.icon} />}
                        <View style={{ flex: 1, alignItems: props.type == "alert" ? 'flex-start' : 'center', marginVertical: Sizes.s20 }}>
                            <Text style={styles.title}>{props.title}</Text>
                            <Text style={[styles.messageText,
                            {
                                textAlign: props.type == 'alert' ? 'left' : 'center',
                                width: props.type == 'alert' ? '95%' : '85%',
                                marginTop: Sizes.s20
                            }]}>{props.message}</Text>
                        </View>
                    </View>
                    <View style={[styles.bottom, props.bottomStyle]}>
                        <TouchableOpacity
                            style={[styles.button, { opacity: props.type == "option" ? 1 : 0, backgroundColor: '#3E62CC' }]}
                            onPress={() => onLeftBtn()}
                            disabled={props.type == "option" ? false : true}
                        >
                            <Text style={{ fontSize: Sizes.h32, fontWeight: 'bold', color: 'white' }}>{props.leftTitle ? props.leftTitle : 'Xác nhận'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: props.btnRightColor ? props.btnRightColor : '#E8576A' }]}
                            onPress={() => onRightBtn()}
                        >
                            <Text style={{ fontSize: Sizes.h32, fontWeight: 'bold', color: 'white' }}>{props.rightTitle ? props.rightTitle : 'Thoát'}</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View >

        </Modal>
    )
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: '#00000060',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Sizes.s20
    },
    modal: {
        // width: Sizes.s300 * 2,
        // alignItems:'center',
        backgroundColor: 'white',
        borderRadius: Sizes.s15,
        minHeight: Sizes.s240 * 1.7
    },
    title: {
        fontFamily: 'NunitoSans-Bold',
        fontSize: Sizes.h40,
        textAlign: 'center',
        color: '#000000'
    },
    icon: {
        width: Sizes.s140,
        height: Sizes.s140,
        marginHorizontal: Sizes.s15,
        resizeMode: 'contain'
    },
    body: {
        flex: 3,
        paddingHorizontal: Sizes.s30,
        alignItems: 'center',
        flexDirection: 'row',
        // backgroundColor: 'green',
    },
    messageText: {
        fontFamily: 'NunitoSans-Regular',
        fontSize: Sizes.h32,
        color: '#00000080',
    },
    bottom: {
        flex: 1.4,
        borderBottomLeftRadius: Sizes.s15,
        borderBottomRightRadius: Sizes.s15,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: Sizes.s20
    },
    button: {
        width: '47%',
        height: '70%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Sizes.s15
    }
})
export default MyModal;