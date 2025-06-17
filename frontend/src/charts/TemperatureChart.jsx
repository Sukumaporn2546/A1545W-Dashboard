import ReactApexChart from "react-apexcharts";
import { getXAxisFormat } from "../utils/transformChartData";

import { useEffect } from "react";
import { useTemperatureStore } from "../services/useTemperatureStore";
export const TemperatureChart = ({ pickerType, selectDate }) => {
  const {
    seriesTemperature,
    fetchHistoricalTemp,
    minTempLine,
    maxTempLine,
    clearGraphTemp,
  } = useTemperatureStore();

  useEffect(() => {
    clearGraphTemp();
    fetchHistoricalTemp(pickerType, selectDate);
  }, [pickerType, selectDate]);

  //console.log("TempData", seriesTemperature);


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
        minTempLine !== null && {
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
        },
        maxTempLine !== null && {
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
          return `${val.toFixed(2)} °C`; // เพิ่มหน่วย °C
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
    colors: ["#0b1957"], // สีเส้น
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
