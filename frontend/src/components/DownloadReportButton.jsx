import { useState } from "react";
import { Button, Modal, Spin } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useTemperatureStore } from "../store/useTemperatureStore";
import { useHumidityStore } from "../store/useHumidityStore";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const DownloadReportButton = () => {
  const [openResponsive, setOpenResponsive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfInstance, setPdfInstance] = useState(null);
  const generatePdfPreview = async () => {
    setOpenResponsive(true);
    const input = document.getElementById("report-content");
    if (!input) {
      return;
    }

    try {
      setLoading(true);
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      //   setImages(imgData);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = 0;
      let heightLeft = imgHeight;

      while (heightLeft > 0) {
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        position -= pageHeight;

        if (heightLeft > 0) pdf.addPage();
      }

      const dataUri = pdf.output("bloburl");
      console.log("Generated PDF data URI:", dataUri.slice(0, 100)); // ดูแค่ 100 ตัวแรก
      setPdfUrl(dataUri);
      setPdfInstance(pdf);
      setOpenResponsive(true);
    } catch (error) {
      console.error("error : ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    console.log("PDF instance:", pdfInstance);
    console.log("Number of pages:", pdfInstance.internal.getNumberOfPages());
    if (pdfInstance) {
      pdfInstance.save("report.pdf");
      setOpenResponsive(false);
    }
  };

  return (
    <>
      {/* Responsive */}

      <Button
        shape="circle"
        onClick={generatePdfPreview}
        icon={<DownloadOutlined />}
      />

      <Modal
        title={<span className="text-xl font-bold">Download Report</span>}
        centered
        open={openResponsive}
        okText="Download"
        onOk={() => handleDownload()}
        onCancel={() => setOpenResponsive(false)}
        width={{
          xs: "90%",
          sm: "80%",
          md: "70%",
          lg: "60%",
          xl: "60%",
          xxl: "40%",
        }}
      >
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            width="100%"
            height="600px"
            style={{ border: "1px solid #ccc", borderRadius: "8px" }}
            title="PDF Preview"
          />
        ) : (
          <div className="flex justify-center items-center h-[600px]">
            <Spin tip="Generating PDF..." size="large" />
          </div>
        )}
      </Modal>
    </>
  );
};
