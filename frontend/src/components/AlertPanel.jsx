import {
  Button,
  Drawer,
  Badge,
  Alert,
  Space,
  Popover,
  Radio,
  Flex,
  Skeleton,
} from "antd";
import { useEffect, useState } from "react";
import {
  AlertOutlined,
  WarningOutlined,
  SyncOutlined,
  EditOutlined,
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
    }
  }, [open]);

  useEffect(() => {
    if (alarm) {
      setAlerts(alarm);
    }
  }, [alarm]);

  return (
    <>
      <Badge dot={hasAlerts} size="default">
        <Button shape="circle" onClick={showDrawer} icon={<AlertOutlined />} />
      </Badge>
      <Drawer
        title={
          <div>
            <span className=" flex items-center">
              {/* <span className="w-5 h-5 mx-2 text-yellow-500">
                <WarningOutlined />
              </span> */}
              <span className="font-bold">Latest Alerts</span>
            </span>
            <div className="font-semibold text-slate-400">June 17,2025</div>
          </div>
        }
        closable={{ "aria-label": "Close Button" }}
        onClose={onClose}
        open={open}
        extra={
          <Space>
            <Button type="primary" onClick={onClose}>
              <EditOutlined />
            </Button>
          </Space>
        }
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
                  title={alert.message}
                  content={
                    <div>
                      <p>{alert.description} </p>
                      <p>Detected : {alert.value}</p>
                      {!alert.message.includes("Normal") ? (
                        <p>threshold : {alert.threshold}</p>
                      ) : (
                        <>
                          <p>min : {alert.min}</p>
                          <p>max : {alert.max}</p>
                        </>
                      )}

                      <p>Start : {alert.startAt}</p>

                      <p>
                        Clear : {alert.cleared ? "Yes" : "No"}
                        {alert.cleared ? alert.clearAt : null}
                      </p>
                      <p>
                        Acknowledge : {alert.acknowledged ? "Yes" : "No"}
                        {alert.acknowledged ? alert.ackAt : null}
                      </p>
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
              <p className="text-gray-500">No alerts</p>
            )}
          </Flex>
        </>
      </Drawer>
    </>
  );
};
