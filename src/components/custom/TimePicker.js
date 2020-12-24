import Sizes from "../../res/assert/size";
import { now } from 'moment';
import React, { Component, useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, Platform } from 'react-native'
import BottomSheet from './BottomSheet'
import {
    TimePicker, DatePicker
} from "react-native-wheel-picker-android";


const pixel = Math.round(Sizes.s2)
const responseObject = {
    hour: Number,
    min: Number
}
const propsType = {
    placeHolder: Component,
    onSelect: (response = responseObject) => { },
    onCancel: () => { },
    isBirth: Boolean,
    show: Boolean,
}

const TimePickerCustom = (props = propsType) => {

    const [time, setTime] = useState(new Date())
    const [minData, setMinData] = useState([])
    useEffect(() => {
        const dataMin = []
        for(var i = 0; i < 60 ; i ++)dataMin.push(i.toString())
        setMinData(dataMin)
    },[])


    return (
        <BottomSheet
            show={props.show}
            height={Platform.OS == 'ios' ? pixel * 330 : pixel * 250}
            title="Chọn giờ"
            rightIcon={<Text style={{ padding: Sizes.s10, color: '#3E62CC', fontSize: Sizes.h32 }}>Xác nhận</Text>}
            leftIcon={<View style={{ width: Sizes.s140, height: 1 }} />}
            onRightClick={() => {
                props.onSelect && props.onSelect({
                    hour: time.getHours(),
                    min: time.getMinutes()
                })
            }}
            placeHolder={props.placeHolder ? props.placeHolder : null}
            children={
                <View style={{ flex: 1 }}>
                    <TimePicker onTimeSelected={setTime} format24 = {false} minutes = {minData}  />
                </View>
            }
        />
    )
}
const Item = ({ type, data, index }) => {
    return (
        <View style={styles.item}>
            {type == 'year' && <Text>{"Năm " + data}</Text>}
            {type == 'month' && <Text>{"Tháng " + data}</Text>}
            {type == 'date' && <Text>{data}</Text>}
        </View>
    )
}
const styles = StyleSheet.create({
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: Sizes.s30,
        marginBottom: Sizes.s60
    },
})

export default TimePickerCustom