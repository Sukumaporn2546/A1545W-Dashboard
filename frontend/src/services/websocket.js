import { CONFIG } from "../configs/constants";
import { ThingsBoardAPI } from "./api";
const api = new ThingsBoardAPI();
export class SetupWebSocket {
  constructor(onMessage) {
    this.config = CONFIG;
    this.baseURL = CONFIG.THINGSBOARD_WEBSOCKET;
    this.onMessage = onMessage;
    this.api = api;
    this.ws = null;
    this.isConnected = false;
    this.closeFlag = false;
    this.connectNum = 0;
    this.lastReceiveTime = Date.now();
    this.heartBeatInterval = null;
  }
  async start() {
    this.connect();
  }
  async buildUrl() {
    try {
      const token = await this.api.login();
      return `${this.baseURL}/api/ws/plugins/telemetry?token=${token}`;
    } catch (error) {
      console.error("can't build URL websocket", error);
    }
  }
  async connect() {
    try {
      if (this.isConnected) {
        console.error("Web Socket is already connected");
        return;
      }
      const url = await this.buildUrl();
      this.ws = new globalThis.WebSocket(url);
      this.ws.onopen = () => this.onOpen();
      this.ws.onmessage = (message) => this.handleMessage(message);
      this.ws.onclose = (event) => this.onClose(event.code, event.reason);
      this.ws.onerror = (event) => this.onError(event);
    } catch (error) {
      console.error("Can't connect WebSocket : ", error.message);
    }
  }
  onOpen() {
    try {
      this.isConnected = true;
      this.lastReceiveTime = Date.now();
      const subscribeMessage = JSON.stringify({
        tsSubCmds: [
          {
            entityType: "DEVICE",
            entityId: this.config.DEVICE_ID,
            scope: "LATEST_TELEMETRY",
            cmdId: 1,
          },
        ],
      });
      this.sendMessage(subscribeMessage);
      this.startHeartBeat();
    } catch (error) {
      console.error("Can't connect WebSocket : ", error.message);
    }
  }

  handleMessage(message) {
    this.lastReceiveTime = Date.now();
    try {
      if (!message || !message.data) {
        console.warn("Received empty WebSocket message");
        return;
      }
      let parsed = JSON.parse(message.data);
      if (this.onMessage && typeof this.onMessage === "function") {
        this.onMessage(parsed);
      }
    } catch (err) {
      console.error("Error in messageProcessService:", err);
    }
  }
  onClose(code, reason) {
    console.error(`WebSocket closed. Code: ${code}, Reason: ${reason}`);
    this.isConnected = false;
    this.ws = null;
    this.stopHeartBeat();
    this.reconnect();
  }

  onError(error) {
    console.error("WebSocket error:", error);
    this.isConnected = false;
    this.ws = null;
    this.reconnect();
  }
  async reconnect() {
    if (this.closeFlag) {
      console.warn(
        "WebSocket has been closed by the client, no more reconnection."
      );
      return;
    }

    if (this.connectNum >= this.config.reconnectCycle) {
      this.connectNum = 0;
    }

    const waitTime = this.config.reconnectInterval * (this.connectNum + 1);

    this.connectNum++;
    setTimeout(() => this.connect(), waitTime * 1000);
  }
  sendMessage(message) {
    if (!this.isConnected || !this.ws) {
      console.error("WebSocket is not connected, cannot send message.");
      return false;
    }
    this.ws.send(message);

    return true;
  }
  startHeartBeat() {
    this.heartBeatInterval = setInterval(() => {
      const now = Date.now();
      if (now - this.lastReceiveTime > this.config.heartBeatInterval) {
        this.sendMessage(this.config.heartBeatMsg);
        this.lastReceiveTime = now;
      }
    }, this.config.sleepInterval);
  }
  stopHeartBeat() {
    if (this.heartBeatInterval) {
      clearInterval(this.heartBeatInterval);
      this.heartBeatInterval = null;
    }
  }
  async close() {
    console.warn("Closing WebSocket...");
    this.closeFlag = true;
    this.stopHeartBeat();
    if (this.ws) {
      this.ws.close(1001, "Client initiated close.");
    }
    console.warn("WebSocket closed.");
  }
}
