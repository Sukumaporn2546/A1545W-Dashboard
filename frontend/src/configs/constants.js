export const CONFIG = {
  THINGSBOARD_HOST: import.meta.env.VITE_THINGSBOARD_HOST,
  USERNAME: import.meta.env.VITE_USERNAME,
  PASSWORD: import.meta.env.VITE_PASSWORD,
  DEVICE_ID: import.meta.env.VITE_DEVICE_ID,
  WS_ENDPOINT: "wss://demo.thingsboard.io/api/ws/plugins/telemetry",
  MOCK_API_URL:
    "https://683e963c1cd60dca33dc446f.mockapi.io/api/temp/humidityDate",
  MAX_SERIES_LENGTH: 288,
  INTERVALS: {
    FIVE_MINUTES: 5 * 60 * 1000,
    HOUR: 60 * 60 * 1000,
    DAY: 24 * 60 * 60 * 1000,
    MONTH: 30 * 24 * 60 * 60 * 1000,
  },
  LIMITS: {
    DAILY: 288,
    WEEKLY: 168,
    MONTHLY: 30,
    YEARLY: 12,
  },
};
