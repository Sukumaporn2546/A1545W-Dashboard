import { Layout, theme, Popover, Select } from 'antd';
import { Col, Row } from 'antd';
import { RealTimeCard } from '../components/RealTimeCard';
import { TemperatureCard } from '../components/TemperatureCard';
import { HumidityCard } from '../components/HumidityCard';
import { AlertPanel } from '../components/AlertPanel';
import { ReportButton } from '../components/ReportButton';
import { ReportContent } from '../components/ReportContent';
const { Header, Content } = Layout;


const DashboardLayout = () => {

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    // forSelect
    const handleChange = value => {
        console.log(`selected ${value}`);
    };

    const now = new Date();

    const options = {
        year: 'numeric',
        month: 'short', // ได้ May แทน May 31
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // เพื่อให้แสดง AM/PM
    };

    const timeFormatted = now.toLocaleString('en-US', options);
    //console.log(timeFormatted);
    const content = (
        <div style={{ width: '300px', overflow: 'auto' }}>
            <div style={{ transform: 'scale(0.5)', transformOrigin: 'top left' }}>
                <ReportContent />
            </div>
        </div>
    );



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
                        <span><ReportButton /></span>
                        {/* </Popover> */}
                        <AlertPanel />
                    </div>

                </Header>
                <Content style={{
                    padding: 24, minHeight: 280,
                }}>
                    <span> <RealTimeCard /></span>

                    <div>
                        <Row gutter={16}>
                            <Col span={12}>
                                <TemperatureCard />
                            </Col>
                            <Col span={12}>
                                <HumidityCard />
                            </Col>
                        </Row>

                    </div>
                    <br />
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
                </Content>
            </Layout>
        </Layout>
    );
};

export default DashboardLayout;
