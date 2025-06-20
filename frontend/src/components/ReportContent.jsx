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
    selectedTypeTemp,
    maxTempLine,
    minTempLine,
    selectedDateTemp,
  } = useTemperatureStore();
  const {
    startPeriodHumid,
    endPeriodHumid,
    seriesHumidity,
    compare_max_line_humid,
    compare_min_line_humid,
    selectedTypeHumid,
    maxHumidLine,
    minHumidLine,
    selectedDateHumid
  } = useHumidityStore();

  const Today = dayjs(new Date()).format("YYYY-MM-DD");
  const checkedNotToday = Today !== selectedDateTemp

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

  const isCompareReady = [
    compare_max_line,
    compare_min_line,
    compare_max_line_humid,
    compare_min_line_humid
  ].some((val) => val !== null && val !== undefined);

  const comparedTempData = useMemo(() => {
    return dataReportHelper.groupContinuousExceed(
      seriesTemperature,
      compare_max_line,
      compare_min_line,
      selectedTypeTemp
    );
  }, [seriesTemperature, compare_max_line, compare_min_line, selectedTypeTemp]);

  const comparedTempRealtimeData = useMemo(() => {
    return dataReportHelper.groupContinuousExceed(
      seriesTemperature,
      maxTempLine,
      minTempLine,
      selectedTypeTemp
    );
  }, [seriesTemperature, minTempLine, maxTempLine, selectedTypeTemp]);

  const comparedHumidData = useMemo(() => {
    return dataReportHelper.groupContinuousExceed(
      seriesHumidity,
      compare_max_line_humid,
      compare_min_line_humid,
      selectedTypeHumid
    );
  }, [seriesHumidity, compare_max_line_humid, compare_min_line_humid, selectedTypeHumid]);

  const comparedHumidRealtimeData = useMemo(() => {
    return dataReportHelper.groupContinuousExceed(
      seriesHumidity,
      maxHumidLine,
      minHumidLine,
      compare_min_line_humid,
      selectedTypeHumid
    );
  }, [seriesHumidity, maxHumidLine, minHumidLine, selectedTypeHumid]);

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

  const columnAlertsTemp = [
    {
      title: <div className="text-center font-bold ">Time</div>,
      dataIndex: "timeRange",
      key: "timeRange",
      align: "center",
      width: 250,
    },
    {
      title: <div className="text-center font-bold">Message Type</div>,
      dataIndex: "message",
      key: "message",
      align: "center",
      width: 150,
    },
    {
      title: <div className="text-center font-bold">Value (°C)</div>,
      dataIndex: "avgValue",
      key: "avgValue",
      align: "center",
      width: 150,
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
      width: 250,
    },
    {
      title: <div className="text-center font-bold">Message Type</div>,
      dataIndex: "message",
      key: "message",
      align: "center",
      width: 150,
    },
    {
      title: <div className="text-center font-bold">Value (%)</div>,
      dataIndex: "avgValue",
      key: "avgValue",
      align: "center",
      width: 150,
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
      <h2 className="text-2xl font-bold mb-4 text-center">
        Temperature and Humidity Report
      </h2>
      <div className="mb-4 text-sm">
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

      <h3 className="text-base font-bold mb-4">• Trend Graphs</h3>
      <div className="mb-12">
        <div className="mb-4">
          <Card
            title={<div className="py-2 text-base">Temperature Chart (°C)</div>}
            variant="outlined"
          >
            <TemperatureChart pickerType={selectedTypeTemp} selectDate={selectedDateTemp} />
          </Card>
        </div>
        <div>
          <Card
            title={<div className="py-2 text-base">Humidity Chart (%RH)</div>}
            variant="outlined"
          >
            <HumidityChart pickerType={selectedTypeHumid} selectDate={selectedDateHumid} />
          </Card>
        </div>
      </div>

      <h3 className="text-base font-bold mb-4">• Summary Statistics</h3>
      <div className="inline-block mb-6">
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

      <h3 className="text-base font-bold mb-2">• Threshold Violations</h3>
      <p className="mb-4 text-base">
        Data points collected at 5-minute intervals
      </p>
      <p className="text-base font-semibold mb-4">Temperature</p>

      <div className="inline-block mb-4">
        {!isCompareReady ? (
          <p className="text-center">No data available, you don't select compare max and min</p>
        ) : (

          <Table
            columns={columnAlertsTemp}
            size="small"
            dataSource={checkedNotToday ? comparedTempData : comparedTempRealtimeData}
            rowKey="id"
            pagination={false}
            tableLayout="auto"
            bordered
            className="custom-table"
          />
        )}
      </div>
      <p className="text-base font-semibold mb-4">Humidity</p>
      <div className="inline-block mb-4">
        {!isCompareReady ? (
          <p className="text-center">No data available, you don't select compare max and min </p>
        ) : (
          <Table
            columns={columnAlertsHumid}
            size="small"
            dataSource={checkedNotToday ? comparedHumidData : comparedHumidRealtimeData}
            rowKey="id"
            pagination={false}
            tableLayout="auto"
            bordered
            className="custom-table"
          />
        )}
      </div>
    </div>
  );
};
