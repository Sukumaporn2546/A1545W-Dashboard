import { Card, Table, Radio } from "antd";
import { BellOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useHumidityStore } from "../store/useHumidityStore";
import { ArrowLeftRight } from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { dateHelpers } from "../utils/dateHelper";
export const CompareHumid = () => {
  const {
    seriesHumidity,
    compare_max_line,
    compare_min_line,
    selectedDateHumid,
    minHumidLine,
    maxHumidLine,
    selectedTypeHumid,
  } = useHumidityStore();
  const [selected, setSelected] = useState(1);
  const Today = dayjs(new Date()).format("YYYY-MM-DD");
  const [isEmpty, setIsEmpty] = useState(false);
  const [sortedInfo, setSortedInfo] = useState({});
  useEffect(() => {
    const noCompareSet =
      !compare_max_line && !compare_min_line && Today !== selectedDateHumid;
    setIsEmpty(noCompareSet);
  }, [compare_max_line, compare_min_line, selectedDateHumid, Today]);
  const formatTime = useCallback(
    (rn) => {
      switch (selectedTypeHumid) {
        case "date":
          return dateHelpers.formatThaiDate_day(rn);
        case "week":
          return dateHelpers.formatThaiDate_weekDay(rn);
        case "month":
          return dateHelpers.formatThaiDate_month(rn);
        case "year":
          return dateHelpers.formatThaiDate_year(rn);
        case "period":
          return dateHelpers.formatThaiDate_weekDay(rn);
        default:
          return rn;
      }
    },
    [selectedTypeHumid]
  );
  const CompareGreaterThanMax_data = useMemo(() => {
    if (!seriesHumidity?.length) return [];
    return seriesHumidity
      .filter(
        (rn) =>
          rn[1] >=
          (selectedDateHumid == Today ? maxHumidLine : compare_max_line)
      )
      .map((rn, index) => ({
        key: index,
        time: formatTime(rn[0]),
        message: "High Humidity",
        value: typeof rn.value === "number" ? rn[1] : Number(rn[1]),
        threshold: selectedDateHumid == Today ? maxHumidLine : compare_max_line,
      }));
  }, [
    formatTime,
    seriesHumidity,
    compare_max_line,
    Today,
    maxHumidLine,
    selectedDateHumid,
  ]);
  const CompareLessThanMin_data = useMemo(() => {
    if (!seriesHumidity?.length) return [];
    return seriesHumidity
      .filter(
        (rn) =>
          rn[1] <=
          (selectedDateHumid == Today ? minHumidLine : compare_min_line)
      )
      .map((rn, index) => ({
        key: index,
        time: formatTime(rn[0]),
        message: "Low Humidity",
        value: typeof rn.value === "number" ? rn[1] : Number(rn[1]),
        threshold: selectedDateHumid == Today ? minHumidLine : compare_min_line,
      }));
  }, [
    formatTime,
    seriesHumidity,
    Today,
    compare_min_line,
    minHumidLine,
    selectedDateHumid,
  ]);
  const CompareNormal_data = useMemo(() => {
    if (!seriesHumidity?.length) return [];
    return seriesHumidity
      .filter(
        (rn) =>
          rn[1] <
            (selectedDateHumid == Today ? maxHumidLine : compare_max_line) &&
          rn[1] > (selectedDateHumid == Today ? minHumidLine : compare_min_line)
      )
      .map((rn, index) => ({
        key: index,
        time: formatTime(rn[0]),
        message: "Normal Humidity",
        value: typeof rn.value === "number" ? rn[1] : Number(rn[1]),
        threshold: `${
          selectedDateHumid == Today ? minHumidLine : compare_min_line
        },${selectedDateHumid == Today ? maxHumidLine : compare_max_line}`,
      }));
  }, [
    formatTime,
    seriesHumidity,
    compare_max_line,
    compare_min_line,
    Today,
    maxHumidLine,
    minHumidLine,
    selectedDateHumid,
  ]);

  useEffect(() => {}, [compare_max_line, compare_min_line, seriesHumidity]);

  const columnAlerts = [
    {
      title: <div className="text-center font-bold ">Time</div>,
      dataIndex: "time",
      key: "time",
      align: "center",
      width: 100,
      sorter: (a, b) => a.time.localeCompare(b.time),
      sortOrder: sortedInfo.columnKey === "time" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: <div className="text-center font-bold">Message Type</div>,
      dataIndex: "message",
      key: "message",
      align: "center",
      width: 300,
    },
    {
      title: <div className="text-center font-bold">Value (%)</div>,
      dataIndex: "value",
      key: "value",
      align: "center",
      width: 100,
      sorter: (a, b) => a.value - b.value,
      sortOrder: sortedInfo.columnKey === "value" ? sortedInfo.order : null,
      ellipsis: true,
      //   render: (text) => (
      //     <span style={{ color: "#eab308", fontWeight: "bold" }}>{text}</span>
      //   ),
    },
    {
      title: <div className="text-center font-bold">Compare Value</div>,
      dataIndex: "threshold",
      key: "threshold",
      align: "center",
      render: (text) => (
        <span style={{ color: "#eab308", fontWeight: "bold" }}>{text}</span>
      ),
    },
  ];
  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };
  const handleRadio = (event) => {
    setSelected(event.target.value);
  };

  return (
    <div className=" border-l-8 text-indigo-400  rounded-xl">
      <Card
        type="inner"
        size="small"
        title={
          <div className="w-full flex flex-col gap-2 pt-4 pb-2">
            <div className="flex justify-between items-center">
              <div className=" font-semibold flex items-center">
                <ArrowLeftRight className="mr-2" size={16} />
                Historical Comparison Humidity
              </div>
            </div>
          </div>
        }
        extra={
          <Radio.Group
            name="radiogroup"
            defaultValue={1}
            onChange={handleRadio}
            size="small"
            options={[
              { value: 1, label: "High" },
              { value: 2, label: "Low" },
              { value: 3, label: "Normal" },
            ]}
          />
        }
        style={{ width: "100%" }}
      >
        <div className="mt-2 overflow-auto">
          <Table
            columns={columnAlerts}
            size="small"
            dataSource={
              isEmpty
                ? []
                : selected === 1
                ? CompareGreaterThanMax_data
                : selected === 2
                ? CompareLessThanMin_data
                : CompareNormal_data
            }
            rowKey="key"
            scroll={{ y: 66 * 5 }}
            tableLayout="auto"
            onChange={handleChange}
            locale={{
              emptyText: isEmpty
                ? "⚠️ Please select min and max humidity for comparison"
                : "No data within the specified humidity range",
            }}
          />
        </div>
      </Card>
    </div>
  );
};
