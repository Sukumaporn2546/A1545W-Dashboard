import { Card, Table, Collapse } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useHumidityStore } from "../store/useHumidityStore";
import { useAlarmStore } from "../store/useAlarmStore";
import { useState, useEffect, useMemo, useCallback } from "react";
import { dateHelpers } from "../utils/dateHelper";
import { Car } from "lucide-react";
export const ReportAlertHumid = () => {
  const { selectedDateHumid, selectedTypeHumid } = useHumidityStore();
  const { alarmHistoricalHumid, getHistoricalAlarmHumid, tableHumidLoading } =
    useAlarmStore();
  const [sortedInfo, setSortedInfo] = useState({});
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
          return dateHelpers.formatThaiDate_weekDay(rn);
      }
    },
    [selectedTypeHumid]
  );
  const logs_data = useMemo(() => {
    if (!alarmHistoricalHumid?.length) return [];
    return alarmHistoricalHumid
      .filter((rn) => rn.message.includes("Humidity"))
      .map((rn, index) => ({
        key: rn.id || index,
        time: formatTime(rn.timeInTable),
        message: rn.message,
        value: typeof rn.value === "number" ? rn.value : Number(rn.value),
        threshold: rn.threshold,
      }));
  }, [formatTime, alarmHistoricalHumid]);

  useEffect(() => {
    if (selectedDateHumid && selectedTypeHumid) {
      getHistoricalAlarmHumid(selectedTypeHumid, selectedDateHumid);
    }
  }, [selectedTypeHumid, selectedDateHumid, getHistoricalAlarmHumid]);

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
    <div className=" border-l-8 text-indigo-400  rounded-xl">
      <Card
        type="inner"
        size="small"
        title={
          <div className="w-full flex flex-col gap-2 pt-4 pb-2">
            <div className="flex justify-between items-center">
              <div className=" font-semibold flex items-center">
                <BellOutlined className="mr-2" />
                Humidity Logs :{" "}
                {selectedTypeHumid === "period"
                  ? `${selectedDateHumid[0]} to ${selectedDateHumid[1]} `
                  : selectedDateHumid}
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
            loading={tableHumidLoading}
          />
        </div>
      </Card>
    </div>
  );
};
