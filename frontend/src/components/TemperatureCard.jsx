import {
  Card,
  DatePicker,
  Select,
  Button,
  Popconfirm,
  InputNumber,
} from "antd";
import { useEffect, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { TemperatureChart } from "../charts/TemperatureChart";
import dayjs from "dayjs";
import { EditOutlined } from "@ant-design/icons";
import { useTemperatureStore } from "../store/useTemperatureStore";
import { useSystemStore } from "../store/useSystemStore";
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

<<<<<<< HEAD
  const {
    minTempLine,
    maxTempLine,
    setMinMaxTempLine,
    setCompare_max_min_Line,
    getMinMaxTempLine,
  } = useTemperatureStore();
  const { setCompareTempMode } = useSystemStore();
=======
  const { minTempLine, maxTempLine, setMinMaxTempLine, getMinMaxTempLine, seriesTemperature } =
    useTemperatureStore();

  let maxTemp = 0
  if(seriesTemperature.length > 0)  maxTemp = (Math.max(...seriesTemperature.map(item => parseFloat(item[1])))).toFixed(2);
  let minTemp = 0
  if(seriesTemperature.length > 0)  minTemp = (Math.min(...seriesTemperature.map(item => parseFloat(item[1])))).toFixed(2);

>>>>>>> d237641e27df5c2bb586073c999314ffabf41f91
  const [tempMin, setMinTemp] = useState(null);
  const [tempMax, setMaxTemp] = useState(null);
  const [compareMax, setCompareMax] = useState(null);
  const [compareMin, setCompareMin] = useState(null);
  const Today = dayjs(new Date()).format("YYYY-MM-DD");
  const onMinChange = (value) => {
    setMinTemp(value);
  };
  const onMaxChange = (value) => {
    setMaxTemp(value);
  };
  const onMaxCompareChange = (value) => {
    setCompareMax(value);
  };
  const onMinCompareChange = (value) => {
    setCompareMin(value);
  };
  const confirmCompare = () => {
    setCompare_max_min_Line(compareMax, compareMin);
    setCompareTempMode(true);
  };
  const confirmSetMaxMin = () => {
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

              {selectDate !== Today ? (
                <Popconfirm
                  icon={null}
                  title="Set Min Max to Compare"
                  description={
                    <div className="flex flex-col gap-2">
                      <div>
                        <span className="mr-2">Max</span>
                        <InputNumber
                          // value={compareMax}
                          // defaultValue={maxTempLine}
                          onChange={onMaxCompareChange}
                        />
                      </div>
                      <div>
                        <span className="mr-2">Min</span>

                        <InputNumber
                          // value={compareMin}
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
