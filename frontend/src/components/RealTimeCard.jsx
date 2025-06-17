import React, { useEffect, useRef, useState } from "react";
import { useTemperatureStore } from "../store/useTemperatureStore";
import { useHumidityStore } from "../store/useHumidityStore";
import { useAlarmStore } from "../store/useAlarmStore";
import MessagePanel from "./MessageRanel";
import AlertRealtime from "../components/AlertRealtime";

export const RealTimeCard = () => {
  const { realtimeTemp, setupWebSocketTempTelemetry, closeWebSocketTemp } =
    useTemperatureStore();
  const { realtimeHumid, setupWebSocketHumid, closeWebSocketHumid } =
    useHumidityStore();

  // Use refs to track if WebSockets are initialized to prevent multiple setups
  const tempSocketInitialized = useRef(false);
  const humidSocketInitialized = useRef(false);

  useEffect(() => {
    const setupConnections = async () => {
      try {
        if (!humidSocketInitialized.current) {
          console.log("Setting up humidity WebSocket...");
          await setupWebSocketHumid("telemetry");
          humidSocketInitialized.current = true;
        }
        if (!tempSocketInitialized.current) {
          console.log("Setting up temperature WebSocket...");
          await setupWebSocketTempTelemetry();
          tempSocketInitialized.current = true;
        }
      } catch (error) {
        console.error("Error setting up WebSocket connections:", error);
      }
    };
    setupConnections();
    return () => {
      console.log("Cleaning up WebSocket connections...");

      if (humidSocketInitialized.current) {
        closeWebSocketHumid();
        humidSocketInitialized.current = false;
      }

      if (tempSocketInitialized.current) {
        closeWebSocketTemp();
        tempSocketInitialized.current = false;
      }
    };
  }, []);

  const [alarm, setAlarm] = useState(null);
  const { getLatestAlarm, latestAlerts } = useAlarmStore();

  const prevAlarmRef = useRef(null);
  const lastProcessedAlarmId = useRef(null);

  useEffect(() => {
    const checkAlarmChanges = async () => {
      await getLatestAlarm();
      if (latestAlerts && latestAlerts.id) {
        const isNewAlarm = latestAlerts.id !== lastProcessedAlarmId.current;
        const isAlarmChanged =
          !prevAlarmRef.current ||
          latestAlerts.id !== prevAlarmRef.current.id ||
          latestAlerts.status !== prevAlarmRef.current.status ||
          latestAlerts.message !== prevAlarmRef.current.message;

        if (isNewAlarm && isAlarmChanged) {
          setAlarm(latestAlerts);
          prevAlarmRef.current = latestAlerts;
          lastProcessedAlarmId.current = latestAlerts.id;
        }
      } else {
        if (alarm !== null) {
          setAlarm(null);
        }
      }
    };
    if (realtimeTemp !== undefined || realtimeHumid !== undefined) {
      checkAlarmChanges();
    }
  }, [realtimeHumid || realtimeTemp]);

  const getBorderColor = (status) => {
    switch (status) {
      case "normal":
        return "border-blue-400";
      case "warning":
        return "border-yellow-400";
      case "critical":
        return "border-red-500";
      default:
        return "border-gray-400";
    }
  };

  const getTemperatureStatus = (temperature) => {
    if (temperature == 0 || temperature == null) return "default";
    else if (temperature > 35) return "critical";
    else if (temperature > 28) return "warning";
    else return "normal";
  };

  const getHumidityStatus = (humidity) => {
    if (humidity == 0 || humidity == null) return "default";
    else if (humidity < 30 || humidity > 85) return "critical";
    else if (humidity < 40 || humidity > 80) return "warning";
    else return "normal";
  };

  const StatCard = ({ title, value, unit, status }) => (
    <div
      className={`bg-white rounded-xl p-6 border-l-8 ${getBorderColor(
        status
      )} transition-shadow flex flex-col justify-between mb-8`}
    >
      <p className="text-sm font-normal text-gray-400">{title}</p>
      <div className="flex flex-1 items-center justify-center">
        <div className="flex items-center space-x-2">
          <span className="text-3xl font-bold">{value}</span>
          <span className="text-lg text-gray-500">{unit}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Current Values */}
      <MessagePanel />
      <AlertRealtime alarm={alarm} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <StatCard
          title="Current Temperature"
          value={realtimeTemp ?? "--"}
          unit="°C"
          status={getTemperatureStatus(realtimeTemp)}
        />
        <StatCard
          title="Current Humidity"
          value={realtimeHumid ?? "--"}
          unit="%"
          status={getHumidityStatus(realtimeHumid)}
        />
      </div>
    </>
  );
};
