import { Card } from 'antd';

import { Button, Drawer, Badge, Alert } from 'antd';
import { useState } from 'react';
import { AlertOutlined, WarningOutlined } from '@ant-design/icons';
import { has } from 'lodash';

export const AlertPanel = () => {
    const alerts = [
        {
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
            type: "temperature",                // ประเภทแจ้งเตือน
            message: "Low Humidity",  // ข้อความเตือนหลัก
            value: 12,                          // ค่าที่ตรวจพบ
            threshold: 80,                      // ค่ากำหนด (threshold)
            unit: "%",                         // หน่วย
            time: "2025-06-10 14:30",           // เวลาที่เกิดเหตุ
            deviceId: "sensor-01",              // อุปกรณ์ที่ตรวจพบ
            resolved: false                     // แสดงว่ายังไม่ได้รับการยืนยันหรือแก้ไข
        }
    ];

    const hasAlerts = alerts.length > 0;

    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Badge dot={hasAlerts} size="default">
                <Button shape="circle" onClick={showDrawer} icon={<AlertOutlined />} />
            </Badge>
            <Drawer
                title={
                    <span className=' flex items-center'>
                        <span className='w-5 h-5 mx-2 text-yellow-500'><WarningOutlined /></span>
                        <span className='font-bold'>Latest Alerts</span>
                    </span>
                }
                closable={{ 'aria-label': 'Close Button' }}
                onClose={onClose}
                open={open}
            >
                {hasAlerts ? (
                    alerts.map((alert) => (
                        <Alert
                            style={{ marginBottom: '10px' }}
                            key={alert.id}
                            message={alert.message}
                            description={
                                <span className="text-sm text-gray-500">
                                    Detected: {alert.value}{alert.unit} <br />
                                    Time: {alert.time}
                                </span>
                            }
                            type="warning"
                            showIcon
                        />
                    ))
                ) :
                    (
                        <p className="text-gray-500">No alerts</p>
                    )
                }

            </Drawer>
        </>

    );
}