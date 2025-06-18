import {
  Card,
  DatePicker,
  Select,
  Button,
  Popconfirm,
  InputNumber,
} from "antd";
import { useEffect, useState } from "react";
import { TemperatureChart } from "../charts/TemperatureChart";
import dayjs from "dayjs";
import { EditOutlined } from "@ant-design/icons";
import { useTemperatureStore } from "../store/useTemperatureStore";

export const TemperatureCard = () => {
  const [pickerType, setPickerType] = useState("date");
  const [selectDate, setSelectDate] = useState(
    dayjs(new Date()).format("YYYY-MM-DD")
  );
  const onDateChange = (date, dateString) => {
    setSelectDate(dateString);
  };

  const handlePickerTypeChange = (value) => {
    setPickerType(value.value);
    setSelectDate(null);
  };

  const disableFutureDates = (current) => {
    return current && current > dayjs().endOf("day");
  };

  const { minTempLine, maxTempLine, setMinMaxTempLine, getMinMaxTempLine, seriesTemperature } =
    useTemperatureStore();

  let maxTemp = 0
  if(seriesTemperature.length > 0)  maxTemp = (Math.max(...seriesTemperature.map(item => parseFloat(item[1])))).toFixed(2);
  let minTemp = 0
  if(seriesTemperature.length > 0)  minTemp = (Math.min(...seriesTemperature.map(item => parseFloat(item[1])))).toFixed(2);

  const [tempMin, setMinTemp] = useState(null);
  const [tempMax, setMaxTemp] = useState(null);

  const onMinChange = (value) => {
    setMinTemp(value);
  };

  const onMaxChange = (value) => {
    setMaxTemp(value);
  };

  const confirm = () => {
    setMinMaxTempLine(tempMin, tempMax);
  };
  useEffect(() => {
    getMinMaxTempLine();
  }, [tempMax, tempMin]);

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
                defaultValue={{ value: "date", label: "Date" }}
                style={{ width: 120 }}
                onChange={handlePickerTypeChange}
                options={[
                  { value: "date", label: "Date" },
                  { value: "week", label: "Week" },
                  { value: "month", label: "Month" },
                  { value: "year", label: "Year" },
                  { value: "period", label: "Period" },
                ]}
              />
              {pickerType === "period" ? (
                <DatePicker.RangePicker
                  disabled={pickerType == null}
                  disabledDate={disableFutureDates}
                  onChange={onDateChange}
                  size="middle"
                />
              ) : (
                <DatePicker
                  disabled={pickerType == null}
                  defaultValue={dayjs(new Date())}
                  disabledDate={disableFutureDates}
                  onChange={onDateChange}
                  picker={pickerType}
                  size="middle"
                />
              )}

              {/* Popconfirm instead of Modal */}
              <Popconfirm
                icon={null}
                title="Set Min and Max Temperature"
                description={
                  <div className="flex flex-col gap-2">
                    <div>
                      <span className="mr-2">Max</span>
                      <InputNumber
                        value={tempMax}
                        defaultValue={maxTempLine}
                        onChange={onMaxChange}
                      />
                    </div>
                    <div>
                      <span className="mr-2">Min</span>

                      <InputNumber
                        value={tempMin}
                        defaultValue={minTempLine}
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
            </div>
          </div>
        </div>
      }
    >
      <TemperatureChart pickerType={pickerType} selectDate={selectDate} />
      <div className="flex flex-row gap-4 justify-center">
        <p>
          <span className="font-bold text-red-500">Maximum : </span>
          <span className="font-semibold">{`${maxTemp} °C`}</span>
        </p>
        <p>
          <span className="font-bold text-blue-500">Minimum : </span>
          <span className="font-semibold">{`${minTemp} °C`}</span>
        </p>
      </div>
    </Card>
  );
};
