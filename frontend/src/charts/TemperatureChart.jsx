import ReactApexChart from "react-apexcharts";
import { getXAxisFormat } from "../utils/transformChartData";

import { useEffect } from "react";
import { useTemperatureStore } from "../services/useTemperatureStore";
export const TemperatureChart = ({ pickerType, selectDate }) => {
  const {
    seriesTemperature,
    setupWebSocket,
    closeWebSocket,
    fetchHistoricalTemp,
    clearGraphTemp,
    login,
  } = useTemperatureStore();

  const isRealtime =
    pickerType == "realtime" || (pickerType == null && selectDate == null);

  useEffect(() => {
    login();
    clearGraphTemp();

    if (isRealtime) {
      setupWebSocket();
    } else if (pickerType != null && selectDate != null) {
      closeWebSocket();
      fetchHistoricalTemp(pickerType, selectDate);
    }

    return () => {
      closeWebSocket(); // cleanup
    };
  }, [pickerType, selectDate, login]);

  console.log("TempData", seriesTemperature);

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
      max: 50,
      min: 0,
      title: {
        // text: 'Temperature (°C)',
        // style: { fontSize: '13px', color: '#666', fontWeight: 'semibold' }
      },
    },
    legend: {
      show: false,
    },
    colors: ["#63ba88"], // สีเส้น
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
