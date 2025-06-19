import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { dateHelpers } from "./dateHelper";

dayjs.extend(utc);
dayjs.extend(timezone);

export const dataReportHelper = {
    convertDateTemp: (start, end) => {
        if (start === end) {
            return start;
        } else {
            return `${start} to ${end}`;
        }
    },
    convertDateHumid: (start, end) =>
        start === end
            ? start
            : `${start} to ${end}`,


    getTimeGenerate: () => dayjs().tz('Asia/Bangkok').format("YYYY-MM-DD, HH:mm"),

    getStatValue: (series, type) => {
        if (!Array.isArray(series) || series.length === 0) return "0.00";

        const values = series.map(item => parseFloat(item[1]));

        let result;

        switch (type) {
            case "max":
                result = Math.max(...values);
                break;
            case "avg":
                result = values.reduce((sum, val) => sum + val, 0) / values.length;
                break;
            case "min":
            default:
                result = Math.min(...values);
                break;
        }
        return result.toFixed(2);
    },

    getComparedTemp: (series, compareMax, compareMin) => {
        if (!series?.length) return [];
        const maxSeries = series
            .filter((rn) => rn[1] >= compareMax)
            .map((rn, index) => ({
                key: index,
                timestamp: rn[0],
                time: dateHelpers.formatThaiDate(rn[0]),
                message: "High Temperature",
                value: typeof rn.value === "number" ? rn[1] : Number(rn[1]),
                threshold: compareMax,
            }));
        const minSeries = series
            .filter((rn) => rn[1] <= compareMin)
            .map((rn, index) => ({
                key: index,
                timestamp: rn[0],
                time: dateHelpers.formatThaiDate(rn[0]),
                message: "Low Temperature",
                value: typeof rn.value === "number" ? rn[1] : Number(rn[1]),
                threshold: compareMin,
            }));

        const combined = [...maxSeries, ...minSeries].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        return combined
    },

    groupContinuousExceed: (series, compareMax, compareMin) => {
        if (!series?.length) return [];

        const result = [];
        let currentGroup = null;

        for (let i = 0; i < series.length; i++) {
            const [ts, rawVal] = series[i];
            const value = parseFloat(rawVal);
            const type =
                value > compareMax ? "High Temperature" :
                    value < compareMin ? "Low Temperature" :
                        null;

            if (type) {
                if (!currentGroup) {
                    currentGroup = {
                        key: result.length,
                        start: ts,
                        end: ts,
                        type,
                        values: [value],
                    };
                } else {
                    currentGroup.end = ts;
                    currentGroup.values.push(value);
                }
            } else {
                if (currentGroup) {
                    result.push({ ...currentGroup });
                    currentGroup = null;
                }
            }
        }

        if (currentGroup) {
            result.push({ ...currentGroup });
        }

        return result.map((g, i) => ({
            key: i,
            message: g.type,
            timeRange: dateHelpers.formatThaiDate(g.start) == dateHelpers.formatThaiDate(g.end) ? dateHelpers.formatThaiDate(g.start) : `${dateHelpers.formatThaiDate(g.start)} - ${dateHelpers.formatThaiDate(g.end)}`,
            avgValue: (g.values.reduce((a, b) => a + b, 0) / g.values.length).toFixed(2),
            threshold: g.type === "High Temperature" ? compareMax : compareMin,
        }));
        
        //console.log('result', result);
        //return result;
    }

}