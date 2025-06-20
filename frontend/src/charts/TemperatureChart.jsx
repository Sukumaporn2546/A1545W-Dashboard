import ReactApexChart from "react-apexcharts";
import { getXAxisFormat } from "../utils/transformChartData";
import { useEffect } from "react";
import { useTemperatureStore } from "../store/useTemperatureStore";
import { Spin } from "antd";
import dayjs from "dayjs";

export const TemperatureChart = ({ pickerType, selectDate }) => {
  const {
    seriesTemperature,
    fetchHistoricalTemp,
    minTempLine,
    maxTempLine,
    clearGraphTemp,
    selectedDateTemp,
    compare_max_line,
    compare_min_line,
    fetchLoading,
  } = useTemperatureStore();
  useEffect(() => {
    clearGraphTemp();
    fetchHistoricalTemp(pickerType, selectDate);
  }, [pickerType, selectDate]);
  const Today = dayjs(new Date()).format("YYYY-MM-DD");
  const series = [
    {
      name: "Temperature",
      data: seriesTemperature ?? [], // fallback to empty array
    },
  ];

  const options = {
    chart: {
      id: "realtime",
      width: 800,
      height: 500,
      type: "area",
      animations: {
        enabled: true,
        easing: "linear",
        dynamicAnimation: {
          speed: 1000,
        },
      },
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: true,
      },
    },
    annotations: {
      yaxis: [
        selectedDateTemp == Today
          ? minTempLine !== null && {
              y: minTempLine,
              borderColor: "#e74c3c",
              borderWidth: 2,
              strokeDashArray: 5,
              label: {
                borderColor: "transparent",
                text: `Min: ${minTempLine}`,
                style: {
                  background: "rgba(255, 255, 255, 0)",
                  fontSize: "13px",
                  fontWeight: "bold",
                  color: "#e74c3c",
                },
              },
            }
          : compare_min_line !== null && {
              y: compare_min_line,
              borderColor: "#e74c3c",
              borderWidth: 2,
              strokeDashArray: 5,
              label: {
                borderColor: "transparent",
                text: `Compare Min: ${compare_min_line}`,
                style: {
                  background: "rgba(255, 255, 255, 0)",
                  fontSize: "13px",
                  fontWeight: "bold",
                  color: "#e74c3c",
                },
              },
            },
        selectedDateTemp == Today
          ? maxTempLine !== null && {
              y: maxTempLine,
              borderColor: "#27ae60",
              borderWidth: 2,
              strokeDashArray: 5,
              label: {
                borderColor: "transparent",
                text: `Max: ${maxTempLine}`,
                style: {
                  background: "rgba(255, 255, 255, 0)",
                  fontSize: "13px",
                  fontWeight: "bold",
                  color: "#27ae60",
                },
              },
            }
          : compare_max_line !== null && {
              y: compare_max_line,
              borderColor: "#27ae60",
              borderWidth: 2,
              strokeDashArray: 5,
              label: {
                borderColor: "transparent",
                text: `Compare Max: ${compare_max_line}`,
                style: {
                  background: "rgba(255, 255, 255, 0)",
                  fontSize: "13px",
                  fontWeight: "bold",
                  color: "#27ae60",
                },
              },
            },
      ].filter(Boolean),
      //points: maxPoints,
    },
    tooltip: {
      enabled: true,
      x: {
        format: getXAxisFormat(pickerType),
      },
      y: {
        formatter: function (val) {
          return `${val.toFixed(2)} °C`;
        },
        title: {
          formatter: () => "Temperature", // ชื่อ tooltip
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      //curve: ["straight"],
    },
    markers: {
      size: 0,
    },
    xaxis: {
      type: "datetime",
      labels: {
        datetimeUTC: false,
        format: getXAxisFormat(pickerType),
      },
    },
    yaxis: {
      // max: 100,
      // min: 0,
      title: {
        // text: 'Temperature (°C)',
        // style: { fontSize: '13px', color: '#666', fontWeight: 'semibold' }
      },
    },
    legend: {
      show: false,
    },
    colors: ["#e58017"], // สีเส้น
  };

  return (
    <>
      {fetchLoading ? (
        <Spin size="middle">
          <ReactApexChart
            options={options}
            series={series}
            type="line"
            height={350}
          />
        </Spin>
      ) : (
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={350}
        />
      )}
    </>
  );
};
