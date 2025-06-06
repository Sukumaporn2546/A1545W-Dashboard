import { create } from 'zustand';
import axios from "axios";
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear.js';
import isoWeek from 'dayjs/plugin/isoWeek.js'

const baseURL = 'http://localhost:3000';

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);


export const useTemperatureStore = create((set, get) => ({
    //for data { "type": "temperature", "timestamp": "2025-06-05T12:00:00Z", "value": 26.5 }
    currentData: {},
    // currentData: {
    //     temperature: 0,
    //     humidity: 0,
    //     lastUpdate: '',
    // },
    seriesTemperature: [],
    seriesHumidity: [],
    socket: null, // ✅ define it

    clearGraphTemp: () =>
        set({
            seriesTemperature: [],
        }),
    clearGraphHumid: () =>
        set({
            seriesHumidity: [],
        }),

    setupWebSocket: () => {

        const jwtToken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtdWF1bndvbmd0dW1fc0BzaWxwYWtvcm4uZWR1IiwidXNlcklkIjoiMTMzMGFkZDAtMjk4Mi0xMWYwLTkwNWItNzE1MTg4YWQyY2Q4Iiwic2NvcGVzIjpbIlRFTkFOVF9BRE1JTiJdLCJzZXNzaW9uSWQiOiJlMTZiMmUwMy1lOGE1LTQ3OGQtYWZkYy1jYmEwNDIyOWFkNzciLCJleHAiOjE3NTA5ODQxMTIsImlzcyI6InRoaW5nc2JvYXJkLmlvIiwiaWF0IjoxNzQ5MTg0MTEyLCJmaXJzdE5hbWUiOiJTdWt1bWFwb3JuIiwibGFzdE5hbWUiOiJNdWF1bndvbmd0dW0iLCJlbmFibGVkIjp0cnVlLCJwcml2YWN5UG9saWN5QWNjZXB0ZWQiOnRydWUsImlzUHVibGljIjpmYWxzZSwidGVuYW50SWQiOiIxMzBmNDMyMC0yOTgyLTExZjAtOTA1Yi03MTUxODhhZDJjZDgiLCJjdXN0b21lcklkIjoiMTM4MTQwMDAtMWRkMi0xMWIyLTgwODAtODA4MDgwODA4MDgwIn0.n8WGVCWQdqg_1zTuRV3-GgbIRhWJnLDBp3ZntIkIhVT4ZLKJZ1bkojtZNt08Jo51t3SzsvoJudiQHoZNPIFfRA";

        const socket = new WebSocket(`wss://demo.thingsboard.io/api/ws/plugins/telemetry?token=${jwtToken}`);

        socket.onopen = () => {
            console.log('WebSocket connection opened');

            const subscribeMessage = JSON.stringify({
                tsSubCmds: [
                    {
                        entityType: "DEVICE",
                        entityId: "f313ad90-3534-11f0-905b-715188ad2cd8",
                        scope: "LATEST_TELEMETRY",
                        cmdId: 1,
                    },
                ],
                historyCmds: [],
                attrSubCmds: [],
            });

            socket.send(subscribeMessage);
            //console.log('sending subscribe message: ', subscribeMessage);
        };

        socket.onmessage = (event) => {

            console.log('WebSocket message received:', event.data);
            const message = JSON.parse(event.data);

            if (!message.data) return;

            const temperatureEntry = message.data.temperature?.[0];
            const humidityEntry = message.data.humidity?.[0];

            const timestamp = parseInt(temperatureEntry?.[0] ?? Date.now());
            const temperature = parseFloat(temperatureEntry?.[1] ?? 0);
            const humidity = parseFloat(humidityEntry?.[1] ?? 0);

            // สร้างฟังก์ชัน helper
            const filterDuplicates = (arr) => {
                const seen = new Set();
                return arr.filter(([ts]) => {
                    if (seen.has(ts)) return false;
                    seen.add(ts);
                    return true;
                });
            };


            set((state) => ({
                currentData: {
                    temperature,
                    humidity,
                },
                seriesTemperature: filterDuplicates([
                    ...state.seriesTemperature,
                    [timestamp, temperature],
                ]).slice(-288),
                seriesHumidity: filterDuplicates([
                    ...state.seriesHumidity,
                    [timestamp, humidity],
                ]).slice(-288),
            }));
        };

        // ✅ store socket
        set({ socket });

        // socket.onclose = (event) => {  //event ตัวแปรที่รับข้อมูลเหตุการณ์ (Event Object) ที่เกิดขึ้น
        //     console.log("🔌 WebSocket closed", event.code, event.reason);
        // };


    },


    closeWebSocket: () => {
        const socket = get().socket;
        socket?.close();
        set({ socket: null }); // clear it
    },


    fetchHistoricalTemp: async (pickerType, selectDate) => {
        console.log("pickerType from fetchHistoricalTemp", pickerType);
        console.log("selectDate from fetchHistoricalTemp", selectDate);

        let start, end, range = pickerType;

        if (pickerType === 'period' && Array.isArray(selectDate)) {
            [start, end] = selectDate;
        } else if (pickerType === 'date') {
            start = end = selectDate; // single date
        } else if (pickerType === 'week') {
            // selectDate example: "2025-24th"
            // extract year and week number:
            const [yearStr, weekStr] = selectDate.split('-');
            const year = parseInt(yearStr, 10);
            const week = parseInt(weekStr.replace('th', ''), 10);

            // get first day of week (week starts on Sunday)
            start = dayjs().year(year).isoWeek(week).startOf('week').format('YYYY-MM-DD');
            end = dayjs().year(year).isoWeek(week).endOf('week').format('YYYY-MM-DD');
        } else if (pickerType === 'month') {
            // selectDate example: "2025-05"
            const date = dayjs(selectDate);
            start = date.startOf('month').format('YYYY-MM-DD');
            end = date.endOf('month').format('YYYY-MM-DD');
        } else if (pickerType === 'year') {
            // selectDate example: "2026"
            const date = dayjs(selectDate, 'YYYY');
            start = date.startOf('year').format('YYYY-MM-DD');
            end = date.endOf('year').format('YYYY-MM-DD');
        } else {
            console.warn('Invalid pickerType or selectDate');
            return;
        }

        try {
            // const response = await axios.get(`${baseURL}/api/temperature`, {
            //     params: { range, start, end },
            // });

            //mock data
            const response = await axios.get('https://683e963c1cd60dca33dc446f.mockapi.io/api/temp/date');




            console.log(response.data);
            const json = await response.data;
            const formatted = json.map(item => [new Date(item.timestamp).getTime(), item.value]);
            console.log('formatted', formatted);
            set({ seriesTemperature: formatted });
        } catch (error) {
            console.error('Error fetching temperature data:', error);
        }
    },

    fetchHistoricalHumid: async (pickerType, selectDate) => {
        console.log("pickerType from fetchHistoricalHumid", pickerType);
        console.log("selectDate from fetchHistoricalHumid", selectDate);

        let start, end, range = pickerType;

        if (pickerType === 'period' && Array.isArray(selectDate)) {
            [start, end] = selectDate;
        } else if (pickerType === 'date') {
            start = end = selectDate; // single date
        } else if (pickerType === 'week') {
            // selectDate example: "2025-24th"
            // extract year and week number:
            const [yearStr, weekStr] = selectDate.split('-');
            const year = parseInt(yearStr, 10);
            const week = parseInt(weekStr.replace('th', ''), 10);

            // get first day of week (week starts on Sunday)
            start = dayjs().year(year).isoWeek(week).startOf('week').format('YYYY-MM-DD');
            end = dayjs().year(year).isoWeek(week).endOf('week').format('YYYY-MM-DD');
        } else if (pickerType === 'month') {
            // selectDate example: "2025-05"
            const date = dayjs(selectDate);
            start = date.startOf('month').format('YYYY-MM-DD');
            end = date.endOf('month').format('YYYY-MM-DD');
        } else if (pickerType === 'year') {
            // selectDate example: "2026"
            const date = dayjs(selectDate, 'YYYY');
            start = date.startOf('year').format('YYYY-MM-DD');
            end = date.endOf('year').format('YYYY-MM-DD');
        } else {
            console.warn('Invalid pickerType or selectDate');
            return;
        }

        try {
            // const response = await axios.get(`${baseURL}/api/humidity`, {
            //     params: { range, start, end },
            // });

            //mock data
            const response = await axios.get('https://683e963c1cd60dca33dc446f.mockapi.io/api/temp/humidityDate');






            console.log(response.data);
            const json = await response.data;
            const formatted = json.map(item => [new Date(item.timestamp).getTime(), item.value]);
            set({ seriesHumidity: formatted });
        } catch (error) {
            console.error('Error fetching temperature data:', error);
        }
    }

}));

