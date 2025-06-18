import ReactApexChart from "react-apexcharts";
import { getXAxisFormat } from "../utils/transformChartData";
import { useEffect } from "react";
import { useTemperatureStore } from "../store/useTemperatureStore";
<<<<<<< HEAD
import dayjs from "dayjs";
=======
import { max, min } from "lodash";
>>>>>>> d237641e27df5c2bb586073c999314ffabf41f91
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
  } = useTemperatureStore();
  useEffect(() => {
    clearGraphTemp();
    fetchHistoricalTemp(pickerType, selectDate);
    console.log(compare_max_line, compare_min_line);
  }, [pickerType, selectDate]);



  //console.log("TempData", seriesTemperature);
  const Today = dayjs(new Date()).format("YYYY-MM-DD");
  const series = [
    {
      name: "Temperature",
      data: seriesTemperature ?? [], // fallback to empty array
    },
  ];

  // const maxTemp = (Math.max(...seriesTemperature.map(item => parseFloat(item[1])))).toFixed(2);
  // const maxTimestamp = seriesTemperature
  //   .filter(item => parseFloat(item[1]) == maxTemp)
  //   .map(item => item[0]);

  // console.log('maxTemp', maxTemp);
  // console.log('maxTimestamp', maxTimestamp);

  // const maxPoints = seriesTemperature
  //   .filter(d => parseFloat(d[1]) == maxTemp)
  //   .map(d => ({
  //     x: d[0],           // ✅ timestamp เป็น number
  //     y: maxTemp,        // ✅ ค่าตัวเลข
  //     marker: {
  //       size: 6,
  //       fillColor: '#fff',
  //       strokeColor: 'red',
  //       radius: 2,
  //     },
  //     label: {
  //       //text: `Max: ${maxTemp}`,
  //       style: {
  //         background: 'red',
  //         color: '#fff',
  //       },
  //     },
  //   }));


  // const minTemp = (Math.min(...seriesTemperature.map(item => parseFloat(item[1])))).toFixed(2);

  // const minTimestamp = minTemp?.[0]

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
<<<<<<< HEAD
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
=======
        minTempLine !== null && {
          y: minTempLine,
          borderColor: "#0984e3",
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: "transparent",
            text: `Min: ${minTempLine}`,
            style: {
              background: "rgba(255, 255, 255, 0)",
              fontSize: "13px",
              fontWeight: "bold",
              color: "#0984e3",
            },
          },
        },
        maxTempLine !== null && {
          y: maxTempLine,
          borderColor: "#e74c3c ",
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: "transparent",
            text: `Max: ${maxTempLine}`,
            style: {
              background: "rgba(255, 255, 255, 0)",
              fontSize: "13px",
              fontWeight: "bold",
              color: "#e74c3c ",
>>>>>>> d237641e27df5c2bb586073c999314ffabf41f91
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
    <ReactApexChart
      options={options}
      series={series}
      type="line"
      height={350}
    />
  );
};
