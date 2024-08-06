import { useEffect, useState } from "react";
import { CloseOutlined, PictureOutlined } from "@ant-design/icons";
import type { FormInstance, UploadProps } from "antd";
import { Button, message, Typography, Upload } from "antd";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../stores/store";

type Props = {
  form: FormInstance;
};

const { Dragger } = Upload;

const ArticleImageUploader = ({ form }: Props) => {
  const { imageStore, articlesStore } = useStore();
  const { setFile, file } = imageStore;
  const { selectedArticle } = articlesStore;
  const [imagePreview, setImagePreview] = useState<string | null>();

  useEffect(() => {
    if (selectedArticle?.imageUrl) {
      setImagePreview(selectedArticle.imageUrl);
    }
  }, [selectedArticle]);

  const uploadProps: UploadProps = {
    listType: "picture-card",
    showUploadList: false,
    onRemove: () => {
      setFile(null);
      setImagePreview(null);
    },
    beforeUpload: (file) => {
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
        setFile(file);
        setImagePreview(URL.createObjectURL(file));
      }

      return false;
    },
    data: { file },
  };

  return (
    <div style={{ minWidth: 350, display: "flex", flexDirection: "column" }}>
      <Typography.Paragraph type="secondary">İçerik görseli (w:800 h:450)</Typography.Paragraph>
      <Dragger {...uploadProps} maxCount={1}>
        {imagePreview ? (
          <div style={{ position: "relative" }}>
            <img src={imagePreview} alt="Preview" style={{ width: "100%", height: 200 }} />
            <div style={{ position: "absolute", top: 5, right: 5 }}>
              <Button
                icon={<CloseOutlined />}
                style={{ zIndex: 20 }}
                onClick={(event) => {
                  event.stopPropagation();
                  setFile(null);
                  form.setFieldsValue({ imageUrl: "" });
                  setImagePreview(null);
                }}
              />
            </div>
          </div>
        ) : (
          <>
            <p className="ant-upload-drag-icon">
              <PictureOutlined />
            </p>
            <p className="ant-upload-text">
              Görsel yüklemek için tıklayın ya da sürükleyip bu alana bırakın.
            </p>
            <p className="ant-upload-hint">
              İzinli dosya türleri: .jpg, .jpeg, .png, .svg, .webp, .gif - Maks. 3MB
            </p>
          </>
        )}
      </Dragger>
    </div>
  );
};

export default observer(ArticleImageUploader);
