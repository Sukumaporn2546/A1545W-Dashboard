import {
  Card,
  DatePicker,
  Select,
  Button,
  Popconfirm,
  InputNumber,
} from "antd";
import React, { useState, useEffect } from "react";
import { ArrowLeftRight } from "lucide-react";
import { HumidityChart } from "../charts/HumidityChart";
import dayjs from "dayjs";
import { EditOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useHumidityStore } from "../store/useHumidityStore";
import { useSystemStore } from "../store/useSystemStore";
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
  const {
    minHumidLine,
    maxHumidLine,
    setMinMaxHumidLine,
    getMinMaxHumidLine,
    setCompare_max_min_Line,
  } = useHumidityStore();

  //for inputNumber
  const { setCompareHumidMode } = useSystemStore();
  // const { minHumidLine, maxHumidLine, setMinMaxHumidLine, getMinMaxHumidLine, seriesHumidity } =
  //   useHumidityStore();

  //for inputNumber

  // let maxHumid = 0
  //   if (seriesHumidity.length > 0) maxHumid = (Math.max(...seriesHumidity.map(item => parseFloat(item[1])))).toFixed(2);
  //   let   minHumid = 0
  //   if (seriesHumidity.length > 0) minHumid = (Math.min(...seriesHumidity.map(item => parseFloat(item[1])))).toFixed(2);

  const [humidMin, setMinHumid] = useState(null);
  const [humidMax, setMaxHumid] = useState(null);
  const [compareMax, setCompareMax] = useState(null);
  const [compareMin, setCompareMin] = useState(null);
  const Today = dayjs(new Date()).format("YYYY-MM-DD");
  const onMinChange = (value) => {
    setMinHumid(value);
  };
  const onMaxChange = (value) => {
    setMaxHumid(value);
  };
  const onMaxCompareChange = (value) => {
    setCompareMax(value);
  };
  const onMinCompareChange = (value) => {
    setCompareMin(value);
  };
  const confirmCompare = () => {
    setCompare_max_min_Line(compareMax, compareMin);
    setCompareHumidMode(true);
  };
  const confirmSetMaxMin = () => {
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
                disabled={pickerType == null}
                defaultValue={dayjs(new Date())}
                disabledDate={disableFutureDates}
                onChange={onDateChange}
                picker={pickerType} // date, week, month, year ตาม pickerType
                size="middle"
              />
            )}

            {selectDate !== Today ? (
              <Popconfirm
                icon={null}
                title="Set Min Max to Compare"
                description={
                  <div className="flex flex-col gap-2">
                    <div>
                      <span className="mr-2">Max</span>
                      <InputNumber
                        value={compareMax}
                        // defaultValue={maxTempLine}
                        onChange={onMaxCompareChange}
                      />
                    </div>
                    <div>
                      <span className="mr-2">Min</span>

                      <InputNumber
                        value={compareMin}
                        // defaultValue={minTempLine}
                        onChange={onMinCompareChange}
                      />
                    </div>
                  </div>
                }
                onConfirm={confirmCompare}
                okText="Save"
                cancelText="Cancel"
              >
                <Button
                  type="primary"
                  icon={<ArrowLeftRight size={16} />}
                  disabled={!pickerType || !selectDate}
                  style={{
                    backgroundColor: "#F5C45E",
                    borderColor: "#F5C45E",
                  }}
                />
              </Popconfirm>
            ) : (
              <Popconfirm
                icon={null}
                title="Set Min and Max Temperature"
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
                onConfirm={confirmSetMaxMin}
                okText="Save"
                cancelText="Cancel"
              >
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  disabled={!pickerType || !selectDate}
                />
              </Popconfirm>
            )}
          </div>
        </div>
      }
    >
      <HumidityChart pickerType={pickerType} selectDate={selectDate} />
      {/* <div className="flex flex-row gap-4 justify-center">
        <p>
          <span className="font-bold text-red-500">Maximum : </span>
          <span className="font-semibold">{`${maxHumid} %`}</span>
        </p>
        <p>
          <span className="font-bold text-blue-500">Minimum : </span>
          <span className="font-semibold">{`${minHumid} %`}</span>
        </p>
      </div> */}
    </Card>
  );
};
