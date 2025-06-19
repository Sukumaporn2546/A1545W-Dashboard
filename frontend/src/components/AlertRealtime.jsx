import React, { useEffect } from "react";
import { notification, Button, Space } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { useSystemStore } from "../store/useSystemStore";
const AlertRealtime = ({ alarm }) => {
  const [api, contextHolder] = notification.useNotification();
  const { setOpenAlertPanel, openAlertPanel } = useSystemStore();
  const btn = (
    <Space>
      <Button type="text" size="small" onClick={() => setOpenAlertPanel(true)}>
        See More
        <RightOutlined />
      </Button>
    </Space>
  );
  useEffect(() => {
    if (alarm) {
      api.open({
        message: alarm.message,
        description: alarm.description ?? "no details",
        type: getNotificationType(alarm.type),
        placement: "topRight",
        actions: btn,
        duration: 5, // sec
      });
    }
  }, [alarm]);
  useEffect(() => {
    if (openAlertPanel) {
      api.destroy(); // ปิด Notification ทั้งหมดทันทีเมื่อ Alert Panel ถูกเปิด
    }
  }, [openAlertPanel]);

  return <>{contextHolder}</>;
};
const getNotificationType = (type) => {
  switch (type) {
    case "MINOR":
      return "success";
    case "MAJOR":
      return "warning";
    default:
      return "info";
  }
};

export default AlertRealtime;
