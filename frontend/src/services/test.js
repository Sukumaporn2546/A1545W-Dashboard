import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic, Button } from "antd";
const THINGSBOARD_HOST = "http://localhost:8080"; // Replace with your ThingsBoard host
const USERNAME = "tenant@thingsboard.org"; // Replace with your username
const PASSWORD = "tenant"; // Replace with your password

function App() {
  const [temperature, setTemperature] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const login = async () => {
      try {
        const res = await axios.post(`${THINGSBOARD_HOST}/api/auth/login, {
          username: USERNAME,
          password: PASSWORD,
        }`);
        setToken(res.data.token);
      } catch (error) {
        console.error("Login failed", error);
      }
    };

    login();
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchTelemetry = async () => {
      try {
        const deviceId = "cd9547a0-271e-11f0-8357-f9dbaaabf457";
        const res = await axios.get(
          `${THINGSBOARD_HOST}/api/plugins/telemetry/DEVICE/${deviceId}/values/timeseries?keys=temperature,
          {
            headers: {
              "X-Authorization": Bearer ${token},
            },
          }
        `);

        const tempValue = res.data.temperature?.[0]?.value;
        if (tempValue !== undefined) {
          setTemperature(parseFloat(tempValue).toFixed(2));
        }
      } catch (error) {
        console.error("Failed to fetch telemetry", error);
      }
    };

    // Fetch every 5 seconds
    const interval = setInterval(fetchTelemetry, 5000);
    return () => clearInterval(interval);
  }, [token]);

  return (
    // <div>
    //   <p>
    //     {temperature !== null ? ${temperature} °C : "Waiting for data..."}
    //   </p>
    // </div>
    <Row gutter={16}>
      <Col span={5}>
        <Card variant="borderless">
          <Statistic
            title="Temperature"
            value={
              temperature !== null ? `${temperature}` : "Waiting for data..."
            }
            precision={2}
            valueStyle={{ color: "#3f8600" }}
            prefix={<ArrowUpOutlined />}
            suffix="°C"
          />
          <Row gutter={16}>
            <Col span={1}></Col>
            <Col span={8}>
              <Button
                shape="circle"
                onClick={() => setTemperature(temperature + 1)}
              >
                {" "}
                -{" "}
              </Button>
            </Col>
            <Col span={1}>
              <Button shape="circle"> + </Button>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
}

export default App;