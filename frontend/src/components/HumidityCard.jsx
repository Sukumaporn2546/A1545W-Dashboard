import {
  Card,
  DatePicker,
  Select,
  Button,
  Popconfirm,
  InputNumber,
} from "antd";
import React, { useState, useEffect } from "react";
import { HumidityChart } from "../charts/HumidityChart";
import dayjs from "dayjs";
import { EditOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useHumidityStore } from "../store/useHumidityStore";

export const HumidityCard = () => {
  const [pickerType, setPickerType] = useState("date"); // เก็บ picker type
  const [selectDate, setSelectDate] = useState(
    dayjs(new Date()).format("YYYY-MM-DD")
  );

  const onDateChange = (date, dateString) => {
    setSelectDate(dateString);
  };

  const handlePickerTypeChange = (value) => {
    console.log("value", value);
    setPickerType(value.value);
    setSelectDate(null);
  };

  const disableFutureDates = (current) => {
    return current && current > dayjs().endOf("day");
  };

  //for input
  const { minHumidLine, maxHumidLine, setMinMaxHumidLine, getMinMaxHumidLine } =
    useHumidityStore();

  //for inputNumber

  const [humidMin, setMinHumid] = useState(null);
  const [humidMax, setMaxHumid] = useState(null);

  const onMinChange = (value) => {
    setMinHumid(value);
  };

  const onMaxChange = (value) => {
    setMaxHumid(value);
  };

  const confirm = () => {
    setMinMaxHumidLine(humidMin, humidMax);
  };
  useEffect(() => {
    getMinMaxHumidLine();
  }, [humidMax, humidMin]);

  return (
    <Card
      type="inner"
      title={
        <div className="w-full flex justify-between items-center  pt-6 pb-4">
          <span>Humidity Chart (%RH)</span>
          <div className="flex items-center gap-4">
            <Select
              labelInValue
              defaultValue={{ value: "date", label: "Date" }}
              placeholder="Select type"
              style={{ width: 120 }}
              onChange={handlePickerTypeChange}
              options={[
                { value: "date", label: "Date" },
                { value: "week", label: "Week" },
                { value: "month", label: "Month" },
                { value: "year", label: "Year" },
                { value: "period", label: "Period" }, // ช่วงเวลาที่เลือกได้
              ]}
            />

            {pickerType === "period" ? (
              <DatePicker.RangePicker
                disabledDate={disableFutureDates}
                disabled={pickerType == null}
                onChange={onDateChange}
                size="middle"
              />
            ) : (
              <DatePicker
                disabledDate={disableFutureDates}
                defaultValue={dayjs(new Date())}
                disabled={pickerType == null}
                onChange={onDateChange}
                picker={pickerType} // date, week, month, year ตาม pickerType
                size="middle"
              />
            )}

            <Popconfirm
              title="Select Min Max Humidity"
              icon={null}
              description={
                <div className="flex flex-col gap-2">
                  <div>
                    <span className="mr-2">Max</span>

                    <InputNumber
                      value={humidMax}
                      defaultValue={maxHumidLine}
                      onChange={onMaxChange}
                    />
                  </div>
                  <div>
                    <span className="mr-2">Min</span>
                    <InputNumber
                      value={humidMin}
                      defaultValue={minHumidLine}
                      onChange={onMinChange}
                    />
                  </div>
                </div>
              }
              onConfirm={confirm}
              okText="Save"
              cancelText="Cancel"
            >
              <Button
                type="primary"
                icon={<EditOutlined />}
                disabled={!pickerType || !selectDate}
              />
            </Popconfirm>
            {/* button for select refLine max, min */}
          </div>
        </div>
      }
    >
      <HumidityChart pickerType={pickerType} selectDate={selectDate} />
    </Card>
  );
};
