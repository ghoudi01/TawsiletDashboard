import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { Modal } from "antd";

const PdfViewer = ({
  pdfUrl,
  visible,
  handleCancelPdf,
  thumbnailPluginInstance,
}) => {
  return (
    <Modal
      cancelText={"Annuler"}
      visible={visible}
      onCancel={() => {
        handleCancelPdf(); // Call the onCancel callback if provided
      }}
      onOk={() => {
        handleCancelPdf(); // Call the onOk callback if provided
      }}
    >
      <div style={{ width: "100%", height: "500px" }}>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer fileUrl={pdfUrl} plugins={[thumbnailPluginInstance]} />
        </Worker>
      </div>
    </Modal>
  );
};

export default PdfViewer;
