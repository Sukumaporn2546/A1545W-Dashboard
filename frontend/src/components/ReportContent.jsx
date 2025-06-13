import { TemperatureChart } from "../charts/TemperatureChart";
import { HumidityChart } from "../charts/HumidityChart";
import { Table, Card } from 'antd';
import { useTemperatureStore } from "../services/useTemperatureStore";
import dayjs from 'dayjs';


export const ReportContent = () => {

    //real data
    const { startPeriodTemp, endPeriodTemp, startPeriodHumid, endPeriodHumid } = useTemperatureStore();

    const convertDateTemp = () => {
        if (startPeriodTemp === endPeriodTemp) {
            return startPeriodTemp;
        } else {
            return `${startPeriodTemp} to ${endPeriodTemp}`
        }
    }
    const convertDateHumid = () => (startPeriodHumid === endPeriodHumid) ? startPeriodHumid : `${startPeriodHumid} to ${endPeriodHumid}`

    const tempPeriod = convertDateTemp();
    const humidPeriod = convertDateHumid();

    const timeFormatted = dayjs().format('YYYY-MM-DD, HH:mm A');


    //table for statistics mock data

    const columns = [
        {
            title: <div className="text-center font-bold">Metrics</div>,
            dataIndex: 'metrics',
            key: 'metrics',
            align: 'center',
            width: 150
        },
        {
            title: <div className="text-center font-bold">Temperature (°C)</div>,
            dataIndex: 'temperature',
            key: 'temperature',
            align: 'center',
            width: 200
        },
        {
            title: <div className="text-center font-bold">Humidity (%RH)</div>,
            dataIndex: 'humidity',
            key: 'humidity',
            align: 'center',
            width: 200
        },
    ];

    const data = [
        {
            key: '1',
            metrics: 'Maximum',
            temperature: '30.14',
            humidity: '80.00',
        },
        {
            key: '2',
            metrics: 'Minimum',
            temperature: '20.00',
            humidity: '60.25',
        },
        {
            key: '3',
            metrics: 'Average',
            temperature: '25.23',
            humidity: '70.5',
        },
    ];


    //table for alerts
    const columnAlerts = [
        {
            title: <div className="text-center font-bold ">Time</div>,
            dataIndex: 'time',
            key: 'time',
            align: 'center',
            width: 250
        },
        {
            title: <div className="text-center font-bold">Alert Type</div>,
            dataIndex: 'message',
            key: 'message',
            align: 'center',
            width: 210
        },
        {
            title: <div className="text-center font-bold">Value</div>,
            dataIndex: 'value',
            key: 'value',
            align: 'center',
            render: (_, record) => `${record.value} ${record.unit}`,
            width: 200
        },
        {
            title: <div className="text-center font-bold">Threshold Limit</div>,
            dataIndex: 'threshold',
            key: 'threshold',
            align: 'center',
            width: 250
        }
    ];


    const alerts = [{
        id: "1",                             // ไว้สำหรับระบุรายการแต่ละอัน
        type: "temperature",                // ประเภทแจ้งเตือน
        message: "High Temperature",  // ข้อความเตือนหลัก
        value: 85,                          // ค่าที่ตรวจพบ
        threshold: 80,                      // ค่ากำหนด (threshold)
        unit: "°C",                         // หน่วย
        time: "2025-06-10 14:30",           // เวลาที่เกิดเหตุ
        deviceId: "sensor-01",              // อุปกรณ์ที่ตรวจพบ
        resolved: false                     // แสดงว่ายังไม่ได้รับการยืนยันหรือแก้ไข
    },
    {
        id: "2",                             // ไว้สำหรับระบุรายการแต่ละอัน
        type: "humidity",                // ประเภทแจ้งเตือน
        message: "Low Humidity",  // ข้อความเตือนหลัก
        value: 12,                          // ค่าที่ตรวจพบ
        threshold: 20,                      // ค่ากำหนด (threshold)
        unit: "%",                         // หน่วย
        time: "2025-06-10 14:30",           // เวลาที่เกิดเหตุ
        deviceId: "sensor-01",              // อุปกรณ์ที่ตรวจพบ
        resolved: false                     // แสดงว่ายังไม่ได้รับการยืนยันหรือแก้ไข
    },
    {
        id: "3",                             // ไว้สำหรับระบุรายการแต่ละอัน
        type: "humidity",                // ประเภทแจ้งเตือน
        message: "Low Humidity",  // ข้อความเตือนหลัก
        value: 19.69,                          // ค่าที่ตรวจพบ
        threshold: 20,                      // ค่ากำหนด (threshold)
        unit: "%",                         // หน่วย
        time: "2025-06-10 15:30",           // เวลาที่เกิดเหตุ
        deviceId: "sensor-01",              // อุปกรณ์ที่ตรวจพบ
        resolved: false                     // แสดงว่ายังไม่ได้รับการยืนยันหรือแก้ไข
    },
    {
        id: "4",                             // ไว้สำหรับระบุรายการแต่ละอัน
        type: "humidity",                // ประเภทแจ้งเตือน
        message: "Low Humidity",  // ข้อความเตือนหลัก
        value: 19.69,                          // ค่าที่ตรวจพบ
        threshold: 20,                      // ค่ากำหนด (threshold)
        unit: "%",                         // หน่วย
        time: "2025-06-10 15:30",           // เวลาที่เกิดเหตุ
        deviceId: "sensor-01",              // อุปกรณ์ที่ตรวจพบ
        resolved: false                     // แสดงว่ายังไม่ได้รับการยืนยันหรือแก้ไข
    }
    ]


    return (
        <div>
            <h2 className="text-4xl font-bold mb-6 text-center">Temperature and Humidity Report</h2>
            <div className="mb-8 text-xl">
                <p><strong>Temperature Period:</strong> {tempPeriod}</p>
                <p><strong>Humidity Period:</strong> {humidPeriod}</p>
                <p><strong>Generated:</strong> {timeFormatted}</p>
            </div>

            <h3 className="text-3xl font-bold mb-4">
                Summary Statistics</h3>
            <div className="inline-block mb-8">
                <Table
                    pagination={false}
                    tableLayout="auto"
                    size="small"
                    bordered
                    columns={columns}
                    dataSource={data}
                    className="custom-table"
                />
            </div>
            <h3 className="text-3xl font-bold mb-4">
                Trend Graphs
            </h3>
            <div className="mb-8">
                <div className="mb-4">
                    <Card title={
                        <div className="py-4 text-xl">
                            Temperature Chart (°C)
                        </div>
                    } variant="outlined">
                        <TemperatureChart />
                    </Card>
                </div>
                <div>
                    <Card title={
                        <div className="py-4 text-xl">
                            Humidity Chart (%RH)
                        </div>
                    } variant="outlined">

                        <HumidityChart />
                    </Card>
                </div>
            </div>


            <h3 className="text-3xl font-bold mb-6">
                Threshold Violations
            </h3>

            <div className="inline-block mb-4">
                <Table
                    columns={columnAlerts}
                    size="small"
                    dataSource={alerts}
                    rowKey="id"
                    pagination={false}
                    tableLayout="auto"
                    bordered
                    className="custom-table"
                />
            </div>

        </div>
    )
};