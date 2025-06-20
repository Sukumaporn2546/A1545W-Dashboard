import {
  Card,
  DatePicker,
  Select,
  Button,
  Popconfirm,
  InputNumber,
  Form,
} from "antd";
import React, { useState, useEffect } from "react";
import { ArrowLeftRight } from "lucide-react";
import { HumidityChart } from "../charts/HumidityChart";
import dayjs from "dayjs";
import { EditOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useHumidityStore } from "../store/useHumidityStore";
import { useSystemStore } from "../store/useSystemStore";
export const HumidityCard = () => {
  const [pickerType, setPickerType] = useState("date");
  const [selectDate, setSelectDate] = useState(
    dayjs(new Date()).format("YYYY-MM-DD")
  );
  const [datePickerValue, setDatePickerValue] = useState(dayjs());

  const [form] = Form.useForm();

  const onDateChange = (date, dateString) => {
    setSelectDate(dateString);
    setDatePickerValue(date);
  };

  const handlePickerTypeChange = (value) => {
    setPickerType(value.value);
    setSelectDate(null);
    setDatePickerValue(null);
  };

  const disableFutureDates = (current) => {
    return current && current > dayjs().endOf("day");
  };
  const [open, setOpen] = useState(true);
  const [openRealtime, setOpenRealtime] = useState(false);

  //for input
  const {
    minHumidLine,
    maxHumidLine,
    setMinMaxHumidLine,
    getMinMaxHumidLine,
    setCompare_max_min_Line,
    seriesHumidity,
    selectedDateHumid,
  } = useHumidityStore();

  //for inputNumber
  const { setCompareHumidMode } = useSystemStore();

  //for inputNumber

  let maxHumid = 0;
  if (seriesHumidity.length > 0)
    maxHumid = Math.max(
      ...seriesHumidity.map((item) => parseFloat(item[1]))
    ).toFixed(2);
  let minHumid = 0;
  if (seriesHumidity.length > 0)
    minHumid = Math.min(
      ...seriesHumidity.map((item) => parseFloat(item[1]))
    ).toFixed(2);

  const [humidMin, setMinHumid] = useState(minHumidLine);
  const [humidMax, setMaxHumid] = useState(maxHumidLine);
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
  const confirmCompare = (max, min) => {
    setCompareMax(max);
    setCompareMin(min);
    setCompare_max_min_Line(compareMax, compareMin);
    setCompareHumidMode(true);
  };
  const confirmSetMaxMin = (max, min) => {
    const finalMax = max != null ? max : maxHumidLine;
    const finalMin = min != null ? min : minHumidLine;
    setMaxHumid(finalMax);
    setMinHumid(finalMin);
    setMinMaxHumidLine(finalMin, finalMax);
  };
  useEffect(() => {
    getMinMaxHumidLine();
  }, [humidMax, humidMin]);
  useEffect(() => {
    if (selectedDateHumid !== Today && selectDate && pickerType) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [selectedDateHumid, Today, selectDate, pickerType]);

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
                value={datePickerValue}
                onChange={onDateChange}
                size="middle"
              />
            ) : (
              <DatePicker
                disabled={pickerType == null}
                value={datePickerValue}
                disabledDate={disableFutureDates}
                onChange={onDateChange}
                picker={pickerType} // date, week, month, year ตาม pickerType
                size="middle"
              />
            )}

            {selectDate !== Today ? (
              <Popconfirm
                icon={null}
                open={open}
                title="Set Threshold to Compare"
                description={
                  <Form
                    form={form}
                    //layout="vertical"
                    initialValues={{
                      compareMax: compareMax,
                      compareMin: compareMin,
                    }}
                  >
                    <Form.Item
                      label="Max"
                      name="compareMax"
                      rules={[
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            const min = getFieldValue("compareMin");
                            if (min == null || value == null) {
                              return Promise.resolve(); // ยังไม่ต้อง validate
                            }
                            if (value <= min) {
                              return Promise.reject(
                                new Error("Max must be greater than Min")
                              );
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <InputNumber onChange={onMaxCompareChange} />
                    </Form.Item>

                    <Form.Item
                      label="Min"
                      name="compareMin"
                      // rules={[{ required: true, message: "Please enter min temperature" }]}
                    >
                      <InputNumber onChange={onMinCompareChange} />
                    </Form.Item>
                  </Form>
                }
                onConfirm={async () => {
                  try {
                    const values = await form.validateFields();
                    confirmCompare(values.compareMax, values.compareMin);
                    setOpen(false);
                  } catch (e) {
                    console.error(e);
                  }
                }}
                okText="Save"
                cancelText="Cancel"
                onCancel={() => setOpen(false)}
                okButtonProps={{
                  style: {
                    backgroundColor: "#F5C45E",
                    borderColor: "#F5C45E",
                    color: "#fff",
                  },
                }}
              >
                <Button
                  type="primary"
                  onClick={() => setOpen(true)}
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
                open={openRealtime}
                title="Set Threshold to Alert"
                description={
                  <Form
                    form={form}
                    //layout="vertical"
                    initialValues={{
                      humidMax: maxHumidLine,
                      humidMin: minHumidLine,
                    }}
                  >
                    <Form.Item
                      label="Max"
                      name="humidMax"
                      rules={[
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (value <= getFieldValue("humidMin")) {
                              return Promise.reject(
                                new Error("Max must be greater than Min")
                              );
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <InputNumber
                        onChange={onMaxChange}
                        defaultValue={maxHumidLine}
                      />
                    </Form.Item>

                    <Form.Item label="Min" name="humidMin">
                      <InputNumber
                        onChange={onMinChange}
                        defaultValue={minHumidLine}
                      />
                    </Form.Item>
                  </Form>
                }
                onConfirm={async () => {
                  try {
                    const values = await form.validateFields();
                    confirmSetMaxMin(values.humidMax, values.humidMin);
                    setOpenRealtime(false);
                  } catch (e) {
                    console.error(e);
                  }
                }}
                okText="Save"
                cancelText="Cancel"
                onCancel={() => setOpenRealtime(false)}
              >
                <Button
                  type="primary"
                  onClick={() => setOpenRealtime(true)}
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
      <div className="flex flex-row gap-4 justify-center">
        <p>
          <span className="font-bold text-red-500">Maximum : </span>
          <span className="font-semibold">{`${maxHumid} %`}</span>
        </p>
        <p>
          <span className="font-bold text-blue-500">Minimum : </span>
          <span className="font-semibold">{`${minHumid} %`}</span>
        </p>
      </div>
    </Card>
  );
};
