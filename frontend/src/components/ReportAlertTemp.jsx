import { Card, Table, Collapse } from 'antd';
import {BellOutlined } from '@ant-design/icons';
export const ReportAlertTemp = () => {

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



    return (
        <div class=" border-l-8 border-l-yellow-500 rounded-xl">
            <Collapse
                className="custom-collapse"
                collapsible="icon" 
                defaultActiveKey={['1']}
                items={[
                    {
                        key: '1',
                        label: (
                            <div className=" font-semibold flex items-center">
                                <BellOutlined  className="mr-2" />
                                Temperature Logs
                            </div>
                        ),
                        children: <div className="inline-block mb-4">
                            <Table
                                columns={columnAlerts}
                                size="small"
                                dataSource={alerts}
                                rowKey="id"
                                pagination={false}
                                tableLayout="auto"
                            />
                        </div>,
                    },
                ]}
            />
        </div>

    );
}