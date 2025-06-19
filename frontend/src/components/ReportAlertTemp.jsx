import { Card, Table, Collapse } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useTemperatureStore } from "../store/useTemperatureStore";
import { useAlarmStore } from "../store/useAlarmStore";
import { useEffect, useState, useMemo, useCallback } from "react";
import { dateHelpers } from "../utils/dateHelper";
export const ReportAlertTemp = () => {
  const { selectedDateTemp, selectedTypeTemp } = useTemperatureStore();
  const { alarmHistoricalTemp, getHistoricalAlarmTemp, tableTempLoading } =
    useAlarmStore();
  const [sortedInfo, setSortedInfo] = useState({});
  const formatTime = useCallback(
    (rn) => {
      switch (selectedTypeTemp) {
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
          return dateHelpers.formatThaiDate_weekDay(rn);
      }
    },
    [selectedTypeTemp]
  );
  const logs_data = useMemo(() => {
    if (!alarmHistoricalTemp?.length) return [];
    return alarmHistoricalTemp
      .filter((rn) => rn.message.includes("Temperature"))
      .map((rn, index) => ({
        key: rn.id || index,
        time: formatTime(rn.timeInTable),
        message: rn.message,
        value: typeof rn.value === "number" ? rn.value : Number(rn.value),
        threshold: rn.threshold,
      }));
  }, [formatTime, alarmHistoricalTemp]);

  useEffect(() => {
    if (selectedDateTemp && selectedDateTemp) {
      getHistoricalAlarmTemp(selectedTypeTemp, selectedDateTemp);
    }
  }, [selectedTypeTemp, selectedDateTemp, getHistoricalAlarmTemp]);

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
      title: <div className="text-center font-bold">Alert Type</div>,
      dataIndex: "message",
      key: "message",
      align: "center",
      width: 300,
    },
    {
      title: <div className="text-center font-bold">Value</div>,
      dataIndex: "value",
      key: "value",
      align: "center",
      width: 100,
      sorter: (a, b) => a.value - b.value,
      sortOrder: sortedInfo.columnKey === "value" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: <div className="text-center font-bold">Threshold Limit</div>,
      dataIndex: "threshold",
      key: "threshold",
      align: "center",
    },
  ];

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  return (
    <div className="border-l-8 border-l-yellow-500 rounded-xl">
      <Card
        type="inner"
        size="small"
        title={
          <div className="w-full flex flex-col gap-2 pt-4 pb-2">
            <div className="flex justify-between items-center">
              <div className=" font-semibold flex items-center">
                <BellOutlined className="mr-2" />
                Temperature Logs :{" "}
                {selectedTypeTemp === "period"
                  ? `${selectedDateTemp[0]} to ${selectedDateTemp[1]}`
                  : selectedDateTemp}
              </div>
            </div>
          </div>
        }
        style={{ width: "100%" }}
      >
        <div className="mt-2 overflow-auto">
          <Table
            columns={columnAlerts}
            size="small"
            dataSource={logs_data}
            rowKey="key"
            scroll={{ y: 66 * 5 }}
            tableLayout="auto"
            onChange={handleChange}
            loading={tableTempLoading}
          />
        </div>
      </Card>
    </div>
  );
};
