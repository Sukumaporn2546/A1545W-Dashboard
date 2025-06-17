import { Layout, theme, Select, Col, Row } from 'antd';
import { useState, useEffect } from 'react';
import { RealTimeCard } from '../components/RealTimeCard';
import { TemperatureCard } from '../components/TemperatureCard';
import { HumidityCard } from '../components/HumidityCard';
import { AlertPanel } from '../components/AlertPanel';
import { ReportContent } from '../components/ReportContent';
import { DownloadReportButton } from '../components/DownloadReportButton';
import { ReportAlertTemp } from '../components/ReportAlertTemp';
import { ReportAlertHumid } from '../components/ReportAlertHumid';
const { Header, Content } = Layout;



const DashboardLayout = () => {

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    // forSelect
    const handleChange = value => {
        console.log(`selected ${value}`);
    };

   const [timeFormatted, setTimeFormatted] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const options = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            };
            setTimeFormatted(now.toLocaleString('en-US', options));
        };

        updateTime(); // ตั้งค่าครั้งแรก
        const interval = setInterval(updateTime, 1000); // อัปเดตทุกวินาที

        return () => clearInterval(interval); // ล้าง interval ตอน component ถูกถอด
    }, []);

    
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Layout>
                <Header
                    className='header'
                    style={{
                        backgroundColor: '#ffffff',
                        color: '#000000',
                        height: '50px',
                    }}
                >

                    <div className='header-left'>
                        <span style={{ fontSize: '24px', fontWeight: 'bold', }} className='room'>QA Room</span>
                        <Select
                            className='select'
                            defaultValue="AW5145W"
                            style={{ width: 150, marginLeft: 20 }}
                            onChange={handleChange}
                            options={[
                                {
                                    label: <span>Devices</span>,
                                    title: 'Devices',
                                    options: [
                                        { label: <span>AW5145W</span>, value: 'AW5145W' },
                                    ],
                                },
                            ]}
                        />
                    </div>

                    <div className='header-right'>

                        <span className="time">{timeFormatted}</span>
                        {/* <Popover content={content} title="Title" trigger="hover"> */}
                        {/* <span><ReportButton /></span> */}
                        <span><DownloadReportButton /></span>
                        {/* </Popover> */}
                        <AlertPanel />
                    </div>

                </Header>
                <Content style={{
                    padding: 24, minHeight: 280,
                }}>
                    <span> <RealTimeCard /></span>

                    <div className='mb-6'>
                        <Row gutter={16}>
                            <Col span={12}>
                                <TemperatureCard />
                            </Col>
                            <Col span={12}>
                                <HumidityCard />
                            </Col>
                        </Row>

                    </div>
                    <div id="report-content"
                        style={{
                            position: 'fixed',
                            top: '-10000px',
                            left: '-10000px',
                            padding: '60px',
                            backgroundColor: 'white',
                        }}
                    >
                        <ReportContent />
                    </div>
                    <div>
                        <Row gutter={16}>
                            <Col span={12}>     
                                <ReportAlertTemp />
                            </Col>
                            <Col span={12}>
                                <ReportAlertHumid />
                            </Col>
                        </Row>

                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default DashboardLayout;
