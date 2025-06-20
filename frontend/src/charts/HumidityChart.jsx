// import ApexCharts from "apexcharts";
import ReactApexChart from "react-apexcharts";
import { getXAxisFormat } from "../utils/transformChartData";
import dayjs from "dayjs";
import { Spin } from "antd";
import { useEffect } from "react";
import { useHumidityStore } from "../store/useHumidityStore";
import { useMemo } from "react";
export const HumidityChart = ({ pickerType, selectDate }) => {
  const {
    seriesHumidity,
    fetchHistoricalHumid,
    clearGraphHumid,
    minHumidLine,
    maxHumidLine,
    selectedDateHumid,
    compare_max_line_humid,
    compare_min_line_humid,
    fetchLoading,
  } = useHumidityStore();

  useEffect(() => {
    clearGraphHumid();

    fetchHistoricalHumid(pickerType, selectDate);
  }, [pickerType, selectDate]);

  const Today = dayjs(new Date()).format("YYYY-MM-DD");
  const series = [
    {
      name: "Humidity",
      data: seriesHumidity ?? [],
    },
  ];

  const options = useMemo(
    () => ({
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
          selectedDateHumid == Today
            ? minHumidLine !== null &&
              minHumidLine !== undefined && {
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
              }
            : compare_min_line_humid !== null &&
              compare_min_line_humid !== undefined && {
                y: compare_min_line_humid,
                borderColor: "#e74c3c",
                borderWidth: 2,
                strokeDashArray: 5,
                label: {
                  borderColor: "transparent",
                  text: `Compare Min: ${compare_min_line_humid}`,
                  style: {
                    background: "rgba(255, 255, 255, 0)",
                    fontSize: "13px",
                    fontWeight: "bold",
                    color: "#e74c3c",
                  },
                },
              },
          selectedDateHumid == Today
            ? maxHumidLine !== null &&
              maxHumidLine !== undefined && {
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
              }
            : compare_max_line_humid !== null &&
              compare_max_line_humid !== undefined && {
                y: compare_max_line_humid,
                borderColor: "#27ae60",
                borderWidth: 2,
                strokeDashArray: 5,
                label: {
                  borderColor: "transparent",
                  text: `Compare Max: ${compare_max_line_humid}`,
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
          format: getXAxisFormat(pickerType),
        },
        y: {
          formatter: function (val) {
            return `${val.toFixed(2)} %`;
          },
          title: {
            formatter: () => "Humidity",
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
    }),
    [
      pickerType,
      minHumidLine,
      maxHumidLine,
      selectedDateHumid,
      compare_max_line_humid,
      compare_min_line_humid,
      Today,
    ]
  );

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
