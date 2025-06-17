import React, { useEffect } from "react";
import { notification } from "antd";

const AlertRealtime = ({ alarm }) => {
  const [api, contextHolder] = notification.useNotification();
  useEffect(() => {
    if (alarm) {
      api.open({
        message: alarm.message,
        description: alarm.description ?? "no details",
        type: getNotificationType(alarm.type),
        placement: "topRight",
        duration: 10, // sec
      });
    }
  }, [alarm]);

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
