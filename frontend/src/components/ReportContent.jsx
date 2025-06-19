import { TemperatureChart } from "../charts/TemperatureChart";
import { HumidityChart } from "../charts/HumidityChart";
import { Table, Card } from "antd";
import { useTemperatureStore } from "../store/useTemperatureStore";
import { useHumidityStore } from "../store/useHumidityStore";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useMemo } from "react";
import { dataReportHelper } from "../utils/dataReportHelper";

dayjs.extend(utc);
dayjs.extend(timezone);

export const ReportContent = () => {
  //real data
  const {
    startPeriodTemp,
    endPeriodTemp,
    seriesTemperature,
    compare_max_line,
    compare_min_line,
  } = useTemperatureStore();
  const {
    startPeriodHumid,
    endPeriodHumid,
    seriesHumidity,
    compare_max_line_humid,
    compare_min_line_humid,
  } = useHumidityStore();

  const tempPeriod = dataReportHelper.convertDateTemp(
    startPeriodTemp,
    endPeriodTemp
  );
  const humidPeriod = dataReportHelper.convertDateHumid(
    startPeriodHumid,
    endPeriodHumid
  );
  const timeFormatted = dataReportHelper.getTimeGenerate();

  const maxTemp = dataReportHelper.getStatValue(seriesTemperature, "max");
  const minTemp = dataReportHelper.getStatValue(seriesTemperature, "min");
  const averageTemp = dataReportHelper.getStatValue(seriesTemperature, "avg");
  const maxHumid = dataReportHelper.getStatValue(seriesHumidity, "max");
  const minHumid = dataReportHelper.getStatValue(seriesHumidity, "min");
  const averageHumid = dataReportHelper.getStatValue(seriesHumidity, "avg");

  const comparedTempData = useMemo(() => {
    return dataReportHelper.groupContinuousExceed(
      seriesTemperature,
      compare_max_line,
      compare_min_line
    );
  }, [seriesTemperature, compare_max_line, compare_min_line]);

  const comparedHumidData = useMemo(() => {
    return dataReportHelper.groupContinuousExceed(
      seriesHumidity,
      compare_max_line_humid,
      compare_max_line_humid
    );
  }, [seriesHumidity, compare_max_line_humid, compare_min_line_humid]);

  const columnSummary = [
    {
      title: <div className="text-center font-bold">Metrics</div>,
      dataIndex: "metrics",
      key: "metrics",
      align: "center",
      width: 150,
    },
    {
      title: <div className="text-center font-bold">Temperature (°C)</div>,
      dataIndex: "temperature",
      key: "temperature",
      align: "center",
      width: 200,
    },
    {
      title: <div className="text-center font-bold">Humidity (%RH)</div>,
      dataIndex: "humidity",
      key: "humidity",
      align: "center",
      width: 200,
    },
  ];

  const data = [
    {
      key: "1",
      metrics: "Maximum",
      temperature: maxTemp,
      humidity: maxHumid,
    },
    {
      key: "2",
      metrics: "Minimum",
      temperature: minTemp,
      humidity: minHumid,
    },
    {
      key: "3",
      metrics: "Average",
      temperature: averageTemp,
      humidity: averageHumid,
    },
  ];

  //table for alerts
  // const columnAlerts = [
  //   {
  //     title: <div className="text-center font-bold ">Time</div>,
  //     dataIndex: "time",
  //     key: "time",
  //     align: "center",
  //     width: 250,
  //   },
  //   {
  //     title: <div className="text-center font-bold">Alert Type</div>,
  //     dataIndex: "message",
  //     key: "message",
  //     align: "center",
  //     width: 210,
  //   },
  //   {
  //     title: <div className="text-center font-bold">Value</div>,
  //     dataIndex: "value",
  //     key: "value",
  //     align: "center",
  //     render: (_, record) => `${record.value} ${record.unit}`,
  //     width: 200,
  //   },
  //   {
  //     title: <div className="text-center font-bold">Threshold Limit</div>,
  //     dataIndex: "threshold",
  //     key: "threshold",
  //     align: "center",
  //     width: 250,
  //   },
  // ];

  const columnAlertsTemp = [
    {
      title: <div className="text-center font-bold ">Time</div>,
      dataIndex: "timeRange",
      key: "timeRange",
      align: "center",
      width: 200,
    },
    {
      title: <div className="text-center font-bold">Message Type</div>,
      dataIndex: "message",
      key: "message",
      align: "center",
      width: 230,
    },
    {
      title: <div className="text-center font-bold">Value (°C)</div>,
      dataIndex: "avgValue",
      key: "avgValue",
      align: "center",
      width: 190,
    },
    {
      title: <div className="text-center font-bold">Threshold</div>,
      dataIndex: "threshold",
      key: "threshold",
      align: "center",
      width: 150,
    },
  ];
  const columnAlertsHumid = [
    {
      title: <div className="text-center font-bold ">Time</div>,
      dataIndex: "timeRange",
      key: "timeRange",
      align: "center",
      width: 200,
    },
    {
      title: <div className="text-center font-bold">Message Type</div>,
      dataIndex: "message",
      key: "message",
      align: "center",
      width: 230,
    },
    {
      title: <div className="text-center font-bold">Value (%)</div>,
      dataIndex: "avgValue",
      key: "avgValue",
      align: "center",
      width: 190,
    },
    {
      title: <div className="text-center font-bold">Threshold</div>,
      dataIndex: "threshold",
      key: "threshold",
      align: "center",
      width: 150,
    },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-center">
        Temperature and Humidity Report
      </h2>
      <div className="mb-8 text-base">
        <p>
          <strong>Temperature Period:</strong> {tempPeriod}
        </p>
        <p>
          <strong>Humidity Period:</strong> {humidPeriod}
        </p>
        <p>
          <strong>Generated:</strong> {timeFormatted}
        </p>
      </div>

      <h3 className="text-xl font-bold mb-4">• Trend Graphs</h3>
      <div className="mb-22">
        <div className="mb-4">
          <Card
            title={<div className="py-4 text-xl">Temperature Chart (°C)</div>}
            variant="outlined"
          >
            <TemperatureChart />
          </Card>
        </div>
        <div>
          <Card
            title={<div className="py-4 text-xl">Humidity Chart (%RH)</div>}
            variant="outlined"
          >
            <HumidityChart />
          </Card>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4">• Summary Statistics</h3>
      <div className="inline-block mb-8">
        <Table
          pagination={false}
          tableLayout="auto"
          size="small"
          bordered
          columns={columnSummary}
          dataSource={data}
          className="custom-table"
        />
      </div>

      <h3 className="text-xl font-bold mb-2">• Threshold Violations</h3>
      <p className="mb-4 text-base">
        Data points collected at 5-minute intervals
      </p>
      <p className="text-xl font-semibold mb-4">Temperature</p>

      <div className="inline-block mb-4">
        <Table
          columns={columnAlertsTemp}
          size="small"
          dataSource={comparedTempData}
          rowKey="id"
          pagination={false}
          tableLayout="auto"
          bordered
          className="custom-table"
        />
      </div>
      <p className="text-xl font-semibold mb-4">Humidity</p>
      <div className="inline-block mb-4">
        <Table
          columns={columnAlertsHumid}
          size="small"
          dataSource={comparedHumidData}
          rowKey="id"
          pagination={false}
          tableLayout="auto"
          bordered
          className="custom-table"
        />
      </div>
    </div>
  );
};
