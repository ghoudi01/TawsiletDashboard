import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload } from "antd";
import axios from "axios";
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const UploadNew = ({ dataToShow, setFunction }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState(dataToShow);
  useEffect(() => {
    setFileList(dataToShow);
  }, [dataToShow]);

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Ajouter
      </div>
    </div>
  );
  const handleFileSelect = async (e) => {
    const file = e;
    // .target.files[0];

    const isLt2MB = file.size / 1024 / 1024 < 1; // Limiting size to 2MB

    // console.log("file", file);
    const formData = new FormData();

    formData.append("files", file);

    const response = await axios
      .post(`${process.env.REACT_APP_BACKUP_URL}upload`, formData)
      .then((res) => {
        setFunction(res);
      });

    // Do something with the selected file
  };
  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={(file) => {
          handleFileSelect(file);
          return false;
        }}
      >
        {fileList?.length >= 1 ? null : uploadButton}
      </Upload>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img
          alt="example"
          style={{
            width: "100%",
          }}
          src={previewImage}
        />
      </Modal>
    </>
  );
};
export default UploadNew;
