import {
  Button,
  Drawer,
  Badge,
  Alert,
  Space,
  Popover,
  Radio,
  Flex,
  Spin,
} from "antd";
import { useEffect, useState } from "react";
import {
  AlertOutlined,
  WarningOutlined,
  SyncOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useAlarmStore } from "../store/useAlarmStore";
import { useSystemStore } from "../store/useSystemStore";
// import { response_alert } from "../constants/constants";
// import { alarmHelper } from "../utils/alarmHelper";

export const AlertPanel = () => {
  const {
    alarm,
    getAlarm,
    acknowledgeAlarm,
    clearAlarm,
    isAckLoading,
    isClearLoading,
    setIsDot,
    isDot,
  } = useAlarmStore();
  const { openAlertPanel, setOpenAlertPanel } = useSystemStore();
  const [alerts, setAlerts] = useState([]);
  const [open, setOpen] = useState(false);
  // const alerts = alarmHelper.formatAlarmData(response_alert.data);
  useEffect(() => {
    setOpen(openAlertPanel);
  }, [openAlertPanel]);
  const hasAlerts = alerts && alerts.length > 0;

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
    setOpenAlertPanel(false);
  };
  const handleAcknowledge = (alarmId) => {
    acknowledgeAlarm(alarmId);
  };
  const handleClear = (alarmId) => {
    clearAlarm(alarmId);
  };
  const handleSelected = async (event) => {
    let selected = event.target.value;
    switch (selected) {
      case "temp":
        setAlerts(alarm.filter((e) => e.message.includes("Temperature")));
        break;
      case "humid":
        setAlerts(alarm.filter((e) => e.message.includes("Humidity")));
        break;
      case "all":
        setAlerts(alarm);
        break;
      default:
        setAlerts(alarm);
    }
  };

  useEffect(() => {
    if (open) {
      getAlarm();
      setIsDot(false);
    }
  }, [open]);

  useEffect(() => {
    if (alarm) {
      setAlerts(alarm);
    }
  }, [alarm]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Badge dot={isDot} size="default">
        <Button shape="circle" onClick={showDrawer} icon={<AlertOutlined />} />
      </Badge>
      <Drawer
        title={
          <div>
            <span className=" flex items-center">
              <span className="w-6 h-6 mx-2 text-yellow-500">
                <WarningOutlined />
              </span>
              <span className="font-bold">Latest Alerts</span>
            </span>
            {/* <div className="font-semibold text-slate-400">June 17,2025</div> */}
          </div>
        }
        closable={{ "aria-label": "Close Button" }}
        onClose={onClose}
        open={open}
        // extra={
        //   <Space>
        //     <Button type="primary" onClick={onClose}>
        //       <EditOutlined />
        //     </Button>
        //   </Space>
        // }
      >
        <>
          <Radio.Group onChange={handleSelected} block defaultValue="all">
            <Radio.Button value="all">All</Radio.Button>
            <Radio.Button value="temp">Temperature</Radio.Button>
            <Radio.Button value="humid">Humidity</Radio.Button>
          </Radio.Group>
          <br></br>

          <Flex vertical gap={"small"}>
            {hasAlerts ? (
              alerts.map((alert) => (
                <Popover
                  placement="left"
                  title={
                    <>
                      <span className="mr-2">
                        <InfoCircleOutlined />
                      </span>
                      <span>{alert.message}</span>
                    </>
                  }
                  content={
                    <div>
                      <p>{alert.description} </p>
                      <p>
                        Detected : {alert.value} {alert.unit}
                      </p>
                      {!alert.message.includes("Normal") ? (
                        <>
                          <p>
                            Threshold : {alert.threshold} {alert.unit}
                          </p>
                          <p>Started : {alert.startAt}</p>
                          <p>
                            Clear : {alert.cleared ? "Yes " : "No"}
                            {alert.cleared ? `(${alert.clearAt})` : null}
                          </p>
                          <p>
                            Acknowledge : {alert.acknowledged ? "Yes " : "No"}
                            {alert.acknowledged ? `(${alert.ackAt})` : null}
                          </p>
                        </>
                      ) : (
                        <>
                          <p>
                            Min : {alert.min} {alert.unit}
                          </p>
                          <p>
                            Max : {alert.max} {alert.unit}
                          </p>
                          <p>Resolved : {alert.startAt}</p>
                        </>
                      )}
                    </div>
                  }
                >
                  <Alert
                    style={{ marginBottom: "10px" }}
                    key={alert.id}
                    message={alert.message}
                    description={
                      <span className="text-sm text-gray-500">
                        Detected: {alert.value}
                        {alert.unit} <br />
                        Time: {alert.time}
                      </span>
                    }
                    type={alert.type == "MINOR" ? "success" : "warning"}
                    showIcon={!alert.cleared}
                    action={
                      alert.type == "MAJOR" ? (
                        <Space direction="vertical">
                          {alert.acknowledged == false ? (
                            <Button
                              loading={
                                isAckLoading[alert.id] && {
                                  icon: <SyncOutlined spin />,
                                }
                              }
                              size="middle"
                              type="primary"
                              style={{ width: "100%" }}
                              onClick={() => handleAcknowledge(alert.id)}
                            >
                              Accept
                            </Button>
                          ) : (
                            <Button
                              size="middle"
                              type="primary"
                              style={{ width: "100%" }}
                              disabled
                            >
                              Accepted
                            </Button>
                          )}
                          {alert.cleared == false ? (
                            <Button
                              size="middle"
                              danger
                              ghost
                              style={{ width: "100%" }}
                              loading={
                                isClearLoading[alert.id] && {
                                  icon: <SyncOutlined spin />,
                                }
                              }
                              onClick={() => handleClear(alert.id)}
                            >
                              Clear
                            </Button>
                          ) : (
                            <Button
                              size="middle"
                              danger
                              ghost
                              style={{ width: "100%" }}
                              disabled
                            >
                              Cleared
                            </Button>
                          )}
                        </Space>
                      ) : null
                    }
                  />
                </Popover>
              ))
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "500px",
                }}
              >
                <Spin tip="Loading alerts..." />
              </div>
            )}
          </Flex>
        </>
      </Drawer>
    </div>
  );
};
