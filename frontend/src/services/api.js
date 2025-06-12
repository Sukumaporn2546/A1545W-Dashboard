import axios from "axios";
import { CONFIG } from "../configs/constants";

export class ThingsBoardAPI {
  constructor() {
    this.baseURL = CONFIG.THINGSBOARD_HOST;
    this.token = null;
  }

  async login() {
    try {
      const response = await axios.post(`${this.baseURL}/api/auth/login`, {
        username: CONFIG.USERNAME,
        password: CONFIG.PASSWORD,
      });

      this.token = response.data.token;
      return this.token;
    } catch (error) {
      console.error("Login failed:", error.message);
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  async fetchTelemetryData(params) {
    const { startTs, endTs, interval, limit, keys = "temperature" } = params;

    if (!this.token) {
      await this.login();
    }

    try {
      const url = `${this.baseURL}/api/plugins/telemetry/DEVICE/${CONFIG.DEVICE_ID}/values/timeseries`;
      const response = await axios.get(url, {
        headers: {
          "X-Authorization": `Bearer ${this.token}`,
        },
        params: {
          keys,
          interval,
          startTs,
          endTs,
          agg: "AVG",
          limit,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching telemetry data:", error.message);
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }
}
