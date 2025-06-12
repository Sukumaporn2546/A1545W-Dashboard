// import ApexCharts from "apexcharts";
import ReactApexChart from "react-apexcharts";
import { getXAxisFormat } from "../utils/transformChartData";

import { useEffect } from "react";
import { useTemperatureStore } from "../services/useTemperatureStore";
export const HumidityChart = ({ pickerType, selectDate }) => {
  const {
    seriesHumidity,
    fetchHistoricalHumid,
    clearGraphHumid,
    minHumidLine,
    maxHumidLine,
  } = useTemperatureStore();

  useEffect(() => {
    clearGraphHumid();

    fetchHistoricalHumid(pickerType, selectDate);
  }, [pickerType, selectDate]);

  //console.log("HumidData", seriesHumidity);

  const series = [
    {
      name: "Humidity",
      data: seriesHumidity ?? [], // fallback to empty array
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
        minHumidLine !== null && {
          y: minHumidLine,
          borderColor: "#e74c3c",
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: "#e74c3c",
            text: `Min: ${minHumidLine}`,
            style: {
              background: "#e74c3c",
              fontSize: "13px",
              fontWeight: "bold",
              color: "#fff",
            },
          },
        },
        maxHumidLine !== null && {
          y: maxHumidLine,
          borderColor: "#27ae60",
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: "#27ae60",
            text: `Max: ${maxHumidLine}`,
            style: {
              background: "#27ae60",
              fontSize: "13px",
              fontWeight: "bold",
              color: "#fff",
            },
          },
        },
      ].filter(Boolean),
    },
    tooltip: {
      enabled: true,
      x: {
        format: getXAxisFormat(pickerType), // รูปแบบเวลา
      },
      y: {
        formatter: function (val) {
          return `${val.toFixed(2)} %`; // เพิ่มหน่วย %
        },
        title: {
          formatter: () => "Humidity", // ชื่อ tooltip
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      //curve: 'smooth',
      curve: ["straight"],
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
    colors: ["#667eea"], // สีเส้น
  };

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="line"
      height={350}
    />
  );
};
