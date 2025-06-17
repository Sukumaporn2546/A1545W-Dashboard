import { Layout } from "antd";
import { Select, Switch } from "antd";
import { Col, Row } from "antd";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import { RealTimeCard } from "../components/RealTimeCard";
import { TemperatureCard } from "../components/TemperatureCard";
import { HumidityCard } from "../components/HumidityCard";
import { AlertPanel } from "../components/AlertPanel";

const { Header, Content } = Layout;
const DashboardLayout = ({ isDarkMode }) => {
  //   const {
  //     token: { colorBgContainer },
  //   } = theme.useToken();

  // forSelect
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const now = new Date();

  const options = {
    year: "numeric",
    month: "short", // ได้ May แทน May 31
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // เพื่อให้แสดง AM/PM
  };

  const timeFormatted = now.toLocaleString("en-US", options);
  //console.log(timeFormatted);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Header
          className="header"
          style={{
            backgroundColor: isDarkMode ? "#121212" : "#ffffff",
            color: isDarkMode ? "#ffffff" : "#000000",
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
            <span className="time">{timeFormatted}</span>

            <AlertPanel />
            {/* <Switch
                            style={{ marginLeft: 20 }}
                            checked={isDarkMode}
                            checkedChildren={<MoonOutlined />}
                            unCheckedChildren={<SunOutlined />}
                            onChange={toggleTheme}
                        /> */}
          </div>
        </Header>
        <Content
          style={{
            padding: 24,
            minHeight: 280,
          }}
        >
          {/* <span> <RealTimeCard /></span> */}
          <span>
            {" "}
            <RealTimeCard />
          </span>
          {/* <span> <AlertPanel /></span> */}

          <div>
            <Row gutter={16}>
              <Col span={12}>
                <TemperatureCard />
              </Col>
              <Col span={12}>
                <HumidityCard />
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
