import { Card, DatePicker, Select, Button, Popconfirm, InputNumber } from 'antd';
import { useState, useEffect } from 'react';
import { TemperatureChart } from '../charts/TemperatureChart';
import dayjs from 'dayjs';
import { EditOutlined } from '@ant-design/icons';
import { useTemperatureStore } from '../services/useTemperatureStore';

export const TemperatureCard = () => {
    const [pickerType, setPickerType] = useState(null);
    const [selectDate, setSelectDate] = useState(null);
    const [value, setValue] = useState(null);

    const onDateChange = (date, dateString) => {
        setSelectDate(dateString);
        setValue(date);
    };

    useEffect(() => {
        console.log('pickerType updated:', pickerType);
        console.log('selectDate updated:', selectDate);
    }, [selectDate, pickerType]);

    const handlePickerTypeChange = (value) => {
        setPickerType(value.value);
        setSelectDate(null);
    };

    const disableFutureDates = (current) => {
        return current && current > dayjs().endOf('day');
    };

    const { setMinTempLine, setMaxTempLine } = useTemperatureStore();

    const [tempMin, setMinTemp] = useState(null);
    const [tempMax, setMaxTemp] = useState(null);

    const onMinChange = (value) => {
        setMinTemp(value);
    };

    const onMaxChange = (value) => {
        setMaxTemp(value);
    };

    const confirm = () => {
        setMinTempLine(tempMin);
        setMaxTempLine(tempMax);
    };

    return (
        <Card
            type="inner"
            title={
                <div className="w-full flex flex-col gap-2 pt-6 pb-4">
                    <div className="flex justify-between items-center">
                        <span>Temperature Chart (°C)</span>
                        <div className="flex items-center gap-4">
                            <Select
                                labelInValue
                                placeholder="Select type"
                                //defaultValue={{ value: 'date', label: 'Date' }}
                                style={{ width: 120 }}
                                onChange={handlePickerTypeChange}
                                options={[
                                    { value: 'date', label: 'Date' },
                                    { value: 'week', label: 'Week' },
                                    { value: 'month', label: 'Month' },
                                    { value: 'year', label: 'Year' },
                                    { value: 'period', label: 'Period' },
                                ]}
                            />
                            {pickerType === 'period' ? (
                                <DatePicker.RangePicker
                                    disabled={pickerType == null}
                                    disabledDate={disableFutureDates}
                                    onChange={onDateChange}
                                    size="small"
                                />
                            ) : (
                                <DatePicker
                                    disabled={pickerType == null}
                                    disabledDate={disableFutureDates}
                                    onChange={onDateChange}
                                    picker={pickerType}
                                    size="small"
                                />
                            )}

                            {/* Popconfirm instead of Modal */}
                            <Popconfirm
                                title="Set Min and Max Temperature"
                                description={
                                    <div className="flex flex-col gap-2">
                                        <div>
                                            <span className="mr-2">Min</span>
                                            <InputNumber value={tempMin} onChange={onMinChange} />
                                        </div>
                                        <div>
                                            <span className="mr-2">Max</span>
                                            <InputNumber value={tempMax} onChange={onMaxChange} />
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
                        </div>
                    </div>
                </div>
            }
        >
            <TemperatureChart pickerType={pickerType} selectDate={selectDate} />
        </Card>
    );
};
