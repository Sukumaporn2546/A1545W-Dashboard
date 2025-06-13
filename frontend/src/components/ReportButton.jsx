
import { Button, message, Badge } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useState } from 'react';
import { useTemperatureStore } from '../services/useTemperatureStore';

export const ReportButton = () => {

    const { startPeriodTemp, endPeriodTemp, startPeriodHumid, endPeriodHumid } = useTemperatureStore();
    const [loading, setLoading] = useState(false);

    // const disabledButton = startPeriodTemp === null || endPeriodTemp === null || startPeriodHumid === null || endPeriodHumid === null
    const disabledButton = [startPeriodTemp, endPeriodTemp, startPeriodHumid, endPeriodHumid].some(val => val === null);

    const handleDownload = async () => {
        const input = document.getElementById('report-content');
        if (!input) {
            message.error('Report content not found');
            return;
        }
        try {
            setLoading(true);

            const canvas = await html2canvas(input, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: 'a4',
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            const imgWidth = pageWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let position = 0;
            let heightLeft = imgHeight;

            while (heightLeft > 0) {
                pdf.addImage(
                    imgData,
                    'PNG',
                    0,
                    position,         // ตำแหน่ง Y ของหน้า PDF
                    imgWidth,
                    imgHeight
                );
                heightLeft -= pageHeight;
                position -= pageHeight;

                if (heightLeft > 0) {
                    pdf.addPage(); // ขึ้นหน้าใหม่ทันที
                }
            }

            pdf.save('report.pdf');
        } catch (error) {
            message.error('Error downloading report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            shape="circle"
            onClick={handleDownload}
            icon={<DownloadOutlined />}
            loading={loading}
            disabled={disabledButton}
        />
    )
};