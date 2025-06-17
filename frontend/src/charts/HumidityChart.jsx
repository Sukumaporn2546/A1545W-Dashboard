// import ApexCharts from "apexcharts";
import ReactApexChart from "react-apexcharts";
import { getXAxisFormat } from "../utils/transformChartData";

import { useEffect } from "react";
import { useHumidityStore } from "../store/useHumidityStore";
export const HumidityChart = ({ pickerType, selectDate }) => {
  const {
    seriesHumidity,
    fetchHistoricalHumid,
    clearGraphHumid,
    minHumidLine,
    maxHumidLine,
  } = useHumidityStore();

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
            borderColor: "transparent",
            text: `Min: ${minHumidLine}`,
            style: {
              background: "rgba(255, 255, 255, 0)",
              fontSize: "13px",
              fontWeight: "bold",
              color: "#e74c3c",
            },
          },
        },
        maxHumidLine !== null && {
          y: maxHumidLine,
          borderColor: "#27ae60",
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: "transparent", 
            text: `Max: ${maxHumidLine}`,
            style: {
              background: "rgba(255, 255, 255, 0)",
              fontSize: "13px",
              fontWeight: "bold",
              color: "#27ae60",
            },
          },
          zIndex: 0,
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
    colors: ["#426bc2"], // สีเส้น
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
