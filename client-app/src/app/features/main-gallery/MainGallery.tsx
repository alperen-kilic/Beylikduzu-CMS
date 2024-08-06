import { useEffect, useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { App, Breadcrumb, Button, Upload } from "antd";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/store";
import LoadingComponent from "../../layout/LoadingComponent";
import MainGalleryTable from "./MainGalleryTable";
import { Link } from "react-router-dom";
const { Dragger } = Upload;

const MainGallery = observer(() => {
  const { imageStore } = useStore();
  const { message } = App.useApp();

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { uploadToMainGallery, loading, getGallery, clearGallery, gallery } = imageStore;

  useEffect(() => {
    getGallery(-1);

    return () => clearGallery();
  }, [getGallery, clearGallery]);

  const props: UploadProps = {
    name: "file",
    showUploadList: true,
    multiple: true,
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onRemove: (file) => {
      setFileList((prevState) => prevState.filter((f) => f.uid !== file.uid));
    },
    beforeUpload(file) {
      const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
      const isSvg = file.type === "image/svg+xml";
      const isWebp = file.type === "image/webp";
      const isGif = file.type === "image/gif";
      const isLt3M = file.size / 1024 / 1024 < 3;

      if (!(isJpgOrPng || isSvg || isWebp || isGif)) {
        message.error(
          "Yalnızca .jpg, .jpeg, .png, .svg, .webp, .gif dosya türlerine izin verilir!"
        );
      }
      if (!isLt3M) {
        message.error("Dosya boyutu 3MB'den büyük olamaz!");
      }

      if ((isJpgOrPng || isSvg || isWebp || isGif) && isLt3M) {
        setFileList((prevState) => [...prevState, file]);
        // setFile(file);
        // uploadImageToGallery(newsId!);
        // message.success(`${file.name} başarıyla yüklendi.`);
      }

      return false;
    },
    fileList,
  };

  const handleUpload = async () => {
    await uploadToMainGallery("-1", fileList);
    setFileList([]);
  };

  if (!gallery) return <LoadingComponent />;

  return (
    <>
      <Breadcrumb
        style={{ marginBottom: "1rem" }}
        items={[
          {
            title: <Link to="/">Anasayfa</Link>,
          },
          {
            title: "Anasayfa Fotoğraf Galerisi",
          },
        ]}
      />
      <div>
        <Dragger {...props} listType="picture-card">
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibited from uploading company data or
            other banned files.
          </p>
        </Dragger>
        <Button
          type="primary"
          disabled={fileList.length === 0}
          style={{ marginTop: "1rem" }}
          onClick={handleUpload}
          loading={loading}
        >
          Resimleri Yükle
        </Button>
      </div>
      <div style={{ marginTop: "1rem" }}>{gallery && <MainGalleryTable />}</div>
    </>
  );
});

export default MainGallery;
