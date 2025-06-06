import { Card, DatePicker, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import { HumidityChart } from '../charts/HumidityChart';
import dayjs from 'dayjs';

export const HumidityCard = () => {
    const [pickerType, setPickerType] = useState(null); // เก็บ picker type
    const [selectDate, setSelectDate] = useState(null)

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


    return (
        <Card
            type="inner"
            title={
                <div className="w-full flex justify-between items-center">
                    <span>Humidity Chart (%)</span>
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
                                { value: null, label: 'Realtime' }, // ช่วงเวลาที่เลือกได้
                            ]}
                        />

                        {pickerType === 'period' ? (
                            <DatePicker.RangePicker
                                disabledDate={disableFutureDates}
                                onChange={onDateChange}
                                size="small"
                            />
                        ) : (
                            <DatePicker
                                disabledDate={disableFutureDates}
                                onChange={onDateChange}
                                picker={pickerType} // date, week, month, year ตาม pickerType
                                size="small"
                            />
                        )}
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
