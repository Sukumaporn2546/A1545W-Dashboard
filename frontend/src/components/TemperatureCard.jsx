import {
  Card,
  DatePicker,
  Select,
  Button,
  Popconfirm,
  InputNumber,
  Form
} from "antd";
import { useEffect, useState, useForm } from "react";
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
  const [datePickerValue, setDatePickerValue] = useState(dayjs()); // เพิ่ม state สำหรับ DatePicker value

  const [open, setOpen] = useState(true);
  const [openRealtime, setOpenRealtime] = useState(false);

  const [form] = Form.useForm();

  const onDateChange = (date, dateString) => {
    console.log(dateString);
    setSelectDate(dateString);
    setDatePickerValue(date); // อัพเดต DatePicker value
  };

  const handlePickerTypeChange = (value) => {
    setPickerType(value.value);
    setSelectDate(null);
    setDatePickerValue(null); // ล้างค่า DatePicker เมื่อเปลี่ยน pickerType
  };

  const disableFutureDates = (current) => {
    return current && current > dayjs().endOf("day");
  };

  const {
    minTempLine,
    maxTempLine,
    setMinMaxTempLine,
    setCompare_max_min_Line,
    getMinMaxTempLine,
    seriesTemperature,
    selectedDateTemp,
  } = useTemperatureStore();
  const { setCompareTempMode } = useSystemStore();

  let maxTemp = 0;
  if (seriesTemperature.length > 0)
    maxTemp = Math.max(
      ...seriesTemperature.map((item) => parseFloat(item[1]))
    ).toFixed(2);
  let minTemp = 0;
  if (seriesTemperature.length > 0)
    minTemp = Math.min(
      ...seriesTemperature.map((item) => parseFloat(item[1]))
    ).toFixed(2);

  const [tempMin, setMinTemp] = useState(minTempLine);
  const [tempMax, setMaxTemp] = useState(maxTempLine);
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
  const confirmCompare = (max, min) => {
    setCompareMax(max);
    setCompareMin(min)
    setCompare_max_min_Line(compareMax, compareMin);
    setCompareTempMode(true);
  };
  const confirmSetMaxMin = (max, min) => {
    const finalMax = max != null ? max : maxTempLine;
    const finalMin = min != null ? min : minTempLine;
    setMaxTemp(finalMax);
    setMinTemp(finalMin);
    setMinMaxTempLine(finalMin, finalMax);
    console.log('tempMax', tempMax)
    console.log('tempMin', tempMin);
  };

  useEffect(() => {
    getMinMaxTempLine();
  }, [tempMax, tempMin]);

  useEffect(() => {
    if (selectedDateTemp !== Today && selectDate && pickerType) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [selectedDateTemp, Today, selectDate, pickerType]);

  useEffect(() => {
  }, [pickerType, selectDate]);

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
                  value={datePickerValue}
                  size="middle"
                />
              ) : (
                <DatePicker
                  disabled={pickerType == null}
                  disabledDate={disableFutureDates}
                  value={datePickerValue}
                  onChange={onDateChange}
                  picker={pickerType}
                  size="middle"
                />
              )}

              {selectDate !== Today ? (
                <Popconfirm
                  icon={null}
                  open={open}
                  title="Set Min Max to Compare"
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
                  title="Set Min and Max Temperature"
                  open={openRealtime}
                  description={
                    <Form
                      form={form}
                      //layout="vertical"
                      initialValues={{
                        tempMax: maxTempLine,
                        tempMin: minTempLine,
                      }}
                    >
                      <Form.Item
                        label="Max"
                        name="tempMax"
                        rules={[
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (value <= getFieldValue("tempMin")) {
                                return Promise.reject(
                                  new Error("Max must be greater than Min")
                                );
                              }
                              return Promise.resolve();
                            }
                          })
                        ]}
                      >
                        <InputNumber onChange={onMaxChange}
                          defaultValue={maxTempLine}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Min"
                        name="tempMin"
                      // rules={[
                      //   ({ getFieldValue }) => ({
                      //     validator(_, value) {
                      //       if (value >= getFieldValue("maxTempLine")) {
                      //         return Promise.reject(
                      //           new Error("Min must be less than than Max")
                      //         );
                      //       }
                      //       return Promise.resolve();
                      //     }
                      //   })
                      // ]}
                      >
                        <InputNumber onChange={onMinChange}
                          defaultValue={minTempLine} />
                      </Form.Item>
                    </Form>
                  }
                  onConfirm={async () => {
                    try {
                      const values = await form.validateFields();
                      confirmSetMaxMin(values.tempMax, values.tempMin);
                      setOpenRealtime(false);
                    } catch (e) {
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
          </div >
        </div >
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
    </Card >
  );
};
