import axios from "axios";
import { CONFIG } from "../configs/constants";
import { dateHelpers } from "../utils/dateHelper";

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

  async postAttributeMaxMinTemp(min, max) {
    try {
      const url = `${this.baseURL}/api/plugins/telemetry/DEVICE/${CONFIG.DEVICE_ID}/attributes/SERVER_SCOPE`;
      const body = JSON.stringify({
        minTemperature: min,
        maxTemperature: max,
      });

      if (!this.token) {
        await this.login();
      }
      const response = await axios.post(url, body, {
        headers: {
          "X-Authorization": `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status == 200) {
        return response;
      }
    } catch (error) {
      console.error("Error post attribute max min:", error.message);
      throw Error(`Failed to post attribute: ${error.message}`);
    }
  }
  async postAttributeMaxMinHumid(min, max) {
    try {
      const url = `${this.baseURL}/api/plugins/telemetry/DEVICE/${CONFIG.DEVICE_ID}/attributes/SERVER_SCOPE`;
      const body = JSON.stringify({
        minHumidity: min,
        maxHumidity: max,
      });

      if (!this.token) {
        await this.login();
      }
      const response = await axios.post(url, body, {
        headers: {
          "X-Authorization": `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status == 200) {
        return response;
      }
    } catch (error) {
      console.error("Error post attribute max min:", error.message);
      throw Error(`Failed to post attribute: ${error.message}`);
    }
  }
  async getAttributeMaxMinTempLine() {
    try {
      const url = `${this.baseURL}/api/plugins/telemetry/DEVICE/${CONFIG.DEVICE_ID}/values/attributes?maxTemperature&minTemperature`;
      if (!this.token) {
        await this.login();
      }
      const response = await axios.get(url, {
        headers: {
          "X-Authorization": `Bearer ${this.token}`,
        },
      });

      return response;
    } catch (error) {
      console.error("Error get attribute max min:", error.message);
      throw Error(`Failed to get attribute: ${error.message}`);
    }
  }
  async getAttributeMaxMinHumidLine() {
    try {
      const url = `${this.baseURL}/api/plugins/telemetry/DEVICE/${CONFIG.DEVICE_ID}/values/attributes?maxHumidity&minHumidity`;
      if (!this.token) {
        await this.login();
      }
      const response = await axios.get(url, {
        headers: {
          "X-Authorization": `Bearer ${this.token}`,
        },
      });

      return response;
    } catch (error) {
      console.error("Error get attribute max min:", error.message);
      throw Error(`Failed to get attribute: ${error.message}`);
    }
  }
  getLatestAlarm = async () => {
    try {
      const { start, end } = dateHelpers.getTodayTimestamp();
      const url = `${this.baseURL}/api/alarm/DEVICE/${CONFIG.DEVICE_ID}?pageSize=10&page=0&sortProperty=endTs&sortOrder=DESC&startTime=${start}&endTime=${end}`;
      if (!this.token) {
        await this.login();
      }
      const response = await axios.get(url, {
        headers: {
          "X-Authorization": `Bearer ${this.token}`,
        },
      });
      if (response.status == 200) {
        return response.data.data[0];
      }
    } catch (error) {
      console.error("Failed to get latest alarm", error);
      return null;
    }
  };
  async getAlarm() {
    try {
      const { start, end } = dateHelpers.getTodayTimestamp();
      const url = `${CONFIG.THINGSBOARD_HOST}/api/alarm/DEVICE/${CONFIG.DEVICE_ID}?pageSize=200&page=0&sortProperty=endTs&sortOrder=DESC&startTime=${start}&endTime=${end}`;
      if (!this.token) {
        await this.login();
      }
      const response = await axios.get(url, {
        headers: {
          "X-Authorization": `Bearer ${this.token}`,
        },
      });

      if (response.status == 200) {
        return response.data.data;
      }
    } catch (error) {
      console.error("Error get Alarm", error.message);
      throw Error(`Failed to get Alarm: ${error.message}`);
    }
  }
  async getHistoricalAlarm(params) {
    try {
      const { startTs, endTs } = params;
      const url = `${CONFIG.THINGSBOARD_HOST}/api/alarm/DEVICE/${CONFIG.DEVICE_ID}?pageSize=200&page=0&sortProperty=endTs&sortOrder=DESC&startTime=${startTs}&endTime=${endTs}`;
      if (!this.token) {
        await this.login();
      }
      const response = await axios.get(url, {
        headers: {
          "X-Authorization": `Bearer ${this.token}`,
        },
      });
      if (response.status == 200) {
        return response.data.data;
      }
    } catch (error) {
      console.error("Error fetching Historical Alarm : ", error);
      throw Error(`Failed to get historical alarm : ${error.message}`);
    }
  }
  async acknowledgeAlarm(alarmId) {
    try {
      const url = `${this.baseURL}/api/alarm/${alarmId}/ack`;
      if (!this.token) {
        await this.login();
      }
      const response = await axios.post(url, alarmId, {
        headers: {
          "X-Authorization": `Bearer ${this.token}`,
        },
      });
      if (response.status == 200) {
        return response;
      }
    } catch (error) {
      console.error("Error acknowledge Alarm", error.message);
      throw Error(`Failed to acknowledge Alarm: ${error.message}`);
    }
  }
  async clearAlarm(alarmId) {
    try {
      const url = `${this.baseURL}/api/alarm/${alarmId}/clear`;
      if (!this.token) {
        await this.login();
      }
      const response = await axios.post(url, alarmId, {
        headers: {
          "X-Authorization": `Bearer ${this.token}`,
        },
      });
      if (response.status == 200) {
        return response;
      }
    } catch (error) {
      console.error("Error clear Alarm", error.message);
      throw Error(`Failed to clear Alarm: ${error.message}`);
    }
  }
}
