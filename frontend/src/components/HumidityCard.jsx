import { Card, DatePicker, Select, Button, Popconfirm, InputNumber, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { HumidityChart } from '../charts/HumidityChart';
import dayjs from 'dayjs';
import { EditOutlined } from '@ant-design/icons';
import { useTemperatureStore } from '../services/useTemperatureStore';

export const HumidityCard = () => {
    const [pickerType, setPickerType] = useState(null); // เก็บ picker type
    const [selectDate, setSelectDate] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();

    const onDateChange = (date, dateString) => {
        setSelectDate(dateString);
    };

    useEffect(() => {
        // โค้ดในนี้จะทำงานเมื่อ selectDate มีการเปลี่ยนแปลง
        console.log('pickerTypeHumid updated:', pickerType);
        console.log('selectDateHumid updated:', selectDate);
    }, [selectDate, pickerType]); // เพิ่ม selectDate เป็น dependency array    

    const handlePickerTypeChange = (value) => {
        console.log('value', value);
        setPickerType(value.value);
        setSelectDate(null);
    };

    const disableFutureDates = (current) => {
        return current && current > dayjs().endOf('day');
    };

    //for input
    const { setMinHumidLine, setMaxHumidLine } = useTemperatureStore();

    //for inputNumber

    const [humidMin, setMinHumid] = useState(null);
    const [humidMax, setMaxHumid] = useState(null);


    const onMinChange = value => {
        setMinHumid(value);
    };

    const onMaxChange = value => {
        setMaxHumid(value);
    };

    const confirm = () => {
        if (humidMin !== null && humidMin > humidMax) {
            messageApi.open({
                type: 'error',
                content: 'Max Humidity must be higher',
            });
        }
        else {
            messageApi.open({
                type: 'success',
                content: 'Saved',
            });
            setMinHumidLine(humidMin);
            setMaxHumidLine(humidMax);
        }
    };

    return (
        <Card
            type="inner"
            title={
                <div className="w-full flex justify-between items-center  pt-6 pb-4">
                    <span>Humidity Chart (%RH)</span>
                    <div className="flex items-center gap-4">
                        <Select
                            labelInValue
                            //defaultValue={{ value: 'date', label: 'Date' }}
                            placeholder="Select type"
                            style={{ width: 120 }}
                            onChange={handlePickerTypeChange}
                            options={[
                                { value: 'date', label: 'Date' },
                                { value: 'week', label: 'Week' },
                                { value: 'month', label: 'Month' },
                                { value: 'year', label: 'Year' },
                                { value: 'period', label: 'Period' }, // ช่วงเวลาที่เลือกได้
                            ]}
                        />

                        {pickerType === 'period' ? (
                            <DatePicker.RangePicker
                                disabledDate={disableFutureDates}
                                disabled={pickerType == null}
                                onChange={onDateChange}
                                size="small"
                            />
                        ) : (
                            <DatePicker
                                disabledDate={disableFutureDates}
                                disabled={pickerType == null}
                                onChange={onDateChange}
                                picker={pickerType} // date, week, month, year ตาม pickerType
                                size="small"
                            />
                        )}

                        <Popconfirm
                            title="Select Min Max Humidity"
                            description={
                                <div className="flex flex-col gap-2">
                                    {contextHolder}
                                    <div>
                                        <span className="mr-2">Min</span>
                                        <InputNumber value={humidMin} onChange={onMinChange} />
                                    </div>
                                    <div>
                                        <span className="mr-2">Max</span>
                                        <InputNumber value={humidMax} onChange={onMaxChange} />
                                    </div>
                                </div>
                            }
                            onConfirm={confirm}
                            okText="Save"
                            cancelText="Cancel"
                        >
                            <Button type="primary" icon={<EditOutlined />}
                                disabled={!pickerType || !selectDate}
                            />
                        </Popconfirm>
                        {/* button for select refLine max, min */}

                    </div>
                </div>
            }
        >
            <HumidityChart
                pickerType={pickerType}
                selectDate={selectDate}
            />
        </Card>
    );
};
