// components/MessagePanel.jsx
import React, { useEffect } from "react";
import { message } from "antd";
import { useMessageStore } from "../store/useMessageStore";

const MessagePanel = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { messageData, clearMessage } = useMessageStore();

  useEffect(() => {
    if (messageData?.status && messageData?.text) {
      messageApi.open({
        type: messageData.status, // 'success' | 'error' | 'info' | 'warning'
        content: messageData.text,
      });
      clearMessage(); // เคลียร์หลังแสดง
    }
  }, [messageData]);

  return <>{contextHolder}</>;
};

export default MessagePanel;
