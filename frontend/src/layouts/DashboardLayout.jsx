import { Layout, Select, Col, Row, Radio } from "antd";
import { useState, useEffect } from "react";
import { RealTimeCard } from "../components/RealTimeCard";
import { TemperatureCard } from "../components/TemperatureCard";
import { HumidityCard } from "../components/HumidityCard";
import { AlertPanel } from "../components/AlertPanel";
import { ReportContent } from "../components/ReportContent";
import { DownloadReportButton } from "../components/DownloadReportButton";
import { ReportAlertTemp } from "../components/ReportAlertTemp";
import { ReportAlertHumid } from "../components/ReportAlertHumid";

import { CompareTemp } from "../components/CompareTemp";
import { CompareHumid } from "../components/CompareHumid";
import { useSystemStore } from "../store/useSystemStore";
// import { dateHelpers } from "../utils/dateHelper";
// import { set } from "lodash";

const { Header, Content } = Layout;

const DashboardLayout = () => {
  // const {
  //   token: { colorBgContainer },
  // } = theme.useToken();

  // forSelect
  // const [dateFormatted, setDateFormatted] = useState();
  // const [timeFormatted, setTimeFormatted] = useState();

  const {
    compareTemp_mode,
    setCompareTempMode,
    compareHumid_mode,
    setCompareHumidMode,
  } = useSystemStore();
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const [selectedTableTemp, setSelectedTableTemp] = useState("tempLogs");
  const [selectedTableHumid, setSelectedTableHumid] = useState("humidLogs");
  const handleSelectedTemp = async (event) => {
    setSelectedTableTemp(event.target.value);
    if (event.target.value == "tempCompare") {
      setCompareTempMode(true);
    } else {
      setCompareTempMode(false);
    }
  };
  const handleSelectedHumid = async (event) => {
    setSelectedTableHumid(event.target.value);
    if (event.target.value == "tempCompare") {
      setCompareHumidMode(true);
    } else {
      setCompareHumidMode(false);
    }
  };
  useEffect(() => {
    if (compareTemp_mode) {
      setSelectedTableTemp("tempCompare");
    } else {
      setSelectedTableTemp("tempLogs");
    }
  }, [compareTemp_mode]);
  useEffect(() => {
    if (compareHumid_mode) {
      setSelectedTableHumid("humidCompare");
    } else {
      setSelectedTableHumid("humidLogs");
    }
  }, [compareHumid_mode]);

  // useEffect(() => {
  //   const updateTime = () => {
  //     const now = new Date();
  //     const dateOptions = {
  //       year: "numeric",
  //       month: "short",
  //       day: "numeric",
  //     };
  //     const timeOptions = {
  //       hour: "2-digit",
  //       minute: "2-digit",
  //       second: "2-digit",
  //       hour12: false,
  //     };
  //     setDateFormatted(now.toLocaleString("en-US", dateOptions));
  //     setTimeFormatted(now.toLocaleString("th-TH", timeOptions));
  //   };

  //   updateTime();
  //   const interval = setInterval(updateTime, 1000);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Header
          className="header"
          style={{
            backgroundColor: "#ffffff",
            color: "#000000",
            height: "50px",
          }}
        >
          <div className="header-left">
            <span
              style={{ fontSize: "24px", fontWeight: "bold" }}
              className="room"
            >
              QA Room
            </span>
            <Select
              className="select"
              defaultValue="AW5145W"
              style={{ width: 150, marginLeft: 20 }}
              onChange={handleChange}
              options={[
                {
                  label: <span>Devices</span>,
                  title: "Devices",
                  options: [{ label: <span>AW5145W</span>, value: "AW5145W" }],
                },
              ]}
            />
          </div>

          <div className="header-right">
            <span className="time">
              {/* {dateFormatted} {timeFormatted} */}
            </span>
            <span>
              <DownloadReportButton />
            </span>
            {/* </Popover> */}
            <AlertPanel />
          </div>
        </Header>
        <Content
          style={{
            padding: 24,
            minHeight: 280,
          }}
        >
          <span>
            {" "}
            <RealTimeCard />
          </span>

          <div className="mb-6">
            <Row gutter={16}>
              <Col span={12}>
                <TemperatureCard />
              </Col>
              <Col span={12}>
                <HumidityCard />
              </Col>
            </Row>
          </div>
          <div
            id="report-content"
            style={{
              position: "fixed",
              top: "-10000px",
              left: "-10000px",
              padding: "50px",
              paddingTop: "10px",
              backgroundColor: "white",
            }}
          >
            <ReportContent />
          </div>
          <div>
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <Row justify="end">
                  <Col>
                    <Radio.Group
                      onChange={handleSelectedTemp}
                      value={selectedTableTemp}
                    >
                      <Radio.Button value="tempLogs">
                        Temperature Logs
                      </Radio.Button>
                      <Radio.Button value="tempCompare">
                        Comparison
                      </Radio.Button>
                    </Radio.Group>
                  </Col>
                </Row>
              </Col>

              <Col span={12}>
                <Row justify="end">
                  <Col>
                    <Radio.Group
                      onChange={handleSelectedHumid}
                      value={selectedTableHumid}
                    >
                      <Radio.Button value="humidLogs">
                        Humidity Logs
                      </Radio.Button>
                      <Radio.Button value="humidCompare">
                        Comparison
                      </Radio.Button>
                    </Radio.Group>
                  </Col>
                </Row>
              </Col>
              {selectedTableTemp == "tempLogs" ? (
                <Col span={12}>
                  <ReportAlertTemp />
                </Col>
              ) : (
                <Col span={12}>
                  <CompareTemp />
                </Col>
              )}
              {selectedTableHumid == "humidLogs" ? (
                <Col span={12}>
                  <ReportAlertHumid />
                </Col>
              ) : (
                <Col span={12}>
                  <CompareHumid />
                </Col>
              )}
            </Row>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
