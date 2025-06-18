import { Card, Table, Collapse } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useHumidityStore } from "../store/useHumidityStore";
import { useAlarmStore } from "../store/useAlarmStore";
import { useState, useEffect, useMemo } from "react";
export const ReportAlertHumid = () => {
  const { selectedDateHumid } = useHumidityStore();
  const { alarmHistoricalHumid, getHistoricalAlarmHumid, tableHumidLoading } =
    useAlarmStore();
  const [sortedInfo, setSortedInfo] = useState({});
  const logs_data = useMemo(() => {
    if (!alarmHistoricalHumid?.length) return [];
    return alarmHistoricalHumid
      .filter((rn) => rn.message.includes("Humidity"))
      .map((rn, index) => ({
        key: rn.id || index,
        time: rn.time,
        message: rn.message,
        value: typeof rn.value === "number" ? rn.value : Number(rn.value),
        threshold: rn.threshold,
      }));
  }, [alarmHistoricalHumid]);

  useEffect(() => {
    if (selectedDateHumid) {
      getHistoricalAlarmHumid(selectedDateHumid);
    }
  }, [selectedDateHumid, getHistoricalAlarmHumid]);

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
      <Collapse
        className="custom-collapse"
        collapsible="icon"
        defaultActiveKey={["1"]}
        items={[
          {
            key: "1",
            label: (
              <div className=" font-semibold flex items-center">
                <BellOutlined className="mr-2" />
                Humidity Logs : {selectedDateHumid}
              </div>
            ),
            children: (
              <div className="mb-4 overflow-auto">
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
            ),
          },
        ]}
      />
    </div>
  );
};
