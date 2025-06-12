import { CONFIG } from "../config/constants.js";
export class ThingsBoardWebSocket {
  constructor(onMessage) {
    this.socket = null;
    this.onMessage = onMessage;
    this.isConnected = false;
  }

  connect() {
    // Note: In production, this token should come from authentication
    const jwtToken =
      "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtdWF1bndvbmd0dW1fc0BzaWxwYWtvcm4uZWR1IiwidXNlcklkIjoiMTMzMGFkZDAtMjk4Mi0xMWYwLTkwNWItNzE1MTg4YWQyY2Q4Iiwic2NvcGVzIjpbIlRFTkFOVF9BRE1JTiJdLCJzZXNzaW9uSWQiOiJlMTZiMmUwMy1lOGE1LTQ3OGQtYWZkYy1jYmEwNDIyOWFkNzciLCJleHAiOjE3NTA5ODQxMTIsImlzcyI6InRoaW5nc2JvYXJkLmlvIiwiaWF0IjoxNzQ5MTg0MTEyLCJmaXJzdE5hbWUiOiJTdWt1bWFwb3JuIiwibGFzdE5hbWUiOiJNdWF1bndvbmd0dW0iLCJlbmFibGVkIjp0cnVlLCJwcml2YWN5UG9saWN5QWNjZXB0ZWQiOnRydWUsImlzUHVibGljIjpmYWxzZSwidGVuYW50SWQiOiIxMzBmNDMyMC0yOTgyLTExZjAtOTA1Yi03MTUxODhhZDJjZDgiLCJjdXN0b21lcklkIjoiMTM4MTQwMDAtMWRkMi0xMWIyLTgwODAtODA4MDgwODA4MDgwIn0.n8WGVCWQdqg_1zTuRV3-GgbIRhWJnLDBp3ZntIkIhVT4ZLKJZ1bkojtZNt08Jo51t3SzsvoJudiQHoZNPIFfRA";

    this.socket = new WebSocket(`${CONFIG.WS_ENDPOINT}?token=${jwtToken}`);

    return new Promise((resolve, reject) => {
      this.socket.onopen = () => {
        console.log("WebSocket connection established");
        this.isConnected = true;
        this.subscribe();
        resolve();
      };

      this.socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.onMessage(message);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      this.socket.onclose = (event) => {
        console.log(`WebSocket closed: ${event.code} - ${event.reason}`);
        this.isConnected = false;
      };

      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.isConnected = false;
        reject(error);
      };
    });
  }

  subscribe() {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket not ready for subscription");
      return;
    }

    const subscribeMessage = {
      tsSubCmds: [
        {
          entityType: "DEVICE",
          entityId: CONFIG.DEVICE_ID,
          scope: "LATEST_TELEMETRY",
          cmdId: 1,
        },
      ],
      historyCmds: [],
      attrSubCmds: [],
    };

    this.socket.send(JSON.stringify(subscribeMessage));
    console.log("Subscription message sent");
  }

  close() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
    }
  }
}
