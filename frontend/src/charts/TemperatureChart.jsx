import ReactApexChart from "react-apexcharts";
import { getXAxisFormat } from "../utils/transformChartData";

import { useEffect } from "react";
import { useTemperatureStore } from "../services/useTemperatureStore";
export const TemperatureChart = ({ pickerType, selectDate }) => {
  const {
    seriesTemperature,
    fetchHistoricalTemp,
    clearGraphTemp,
    login,
    minTempLine,
    maxTempLine,
  } = useTemperatureStore();

  const isRealtime =
    pickerType == null && selectDate == null;

  useEffect(() => {
    login();
    clearGraphTemp();
    
    if (!isRealtime) {
      console.log("fetchHistoricalTemp");
      fetchHistoricalTemp(pickerType, selectDate);
    }
  }, [pickerType, selectDate, login]);

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
          borderColor: '#e74c3c',
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#e74c3c',
            text: `Min: ${minTempLine}`,
            style: {
              background: "#e74c3c",
              fontSize: "13px",
              fontWeight: "bold",
              color: "#fff"
            },
          },
        },
        maxTempLine !== null && {
          y: maxTempLine,
          borderColor: '#27ae60',
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#27ae60',
            text: `Max: ${maxTempLine}`,
            style: {
              background: '#27ae60',
              fontSize: '13px',
              fontWeight: 'bold',
              color: "#fff"
            },
          },
        }
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
      curve: 'smooth',
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
