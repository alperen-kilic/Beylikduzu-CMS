import { Button, Card, Flex, FormInstance, Space } from "antd";
import NewsInformation from "./NewsInformation";
import NewsImageUploader from "./NewsImageUploader";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../stores/store";
import { Link } from "react-router-dom";

type Props = {
  form: FormInstance;
};

const NewsDetailsColumn = ({ form }: Props) => {
  const { imageStore, newsStore } = useStore();
  const { uploadImage } = imageStore;
  const { loading, selectedNews } = newsStore;

  const handleSubmit = async () => {
    const imageUrl = await uploadImage();
    if (imageUrl) {
      form.setFieldsValue({ imageUrl });
    }
    form.submit();
  };
  return (
    <Space
      direction="vertical"
      size="middle"
      style={{ display: "flex" }}
      className="edit-right-column"
    >
      <Card className="edit-right-1">
        <Flex vertical gap="middle">
          <Button
            type="primary"
            size="large"
            onClick={() => handleSubmit()}
            loading={loading || imageStore.loading}
          >
            Kaydet
          </Button>
          <Link to="/haberler" style={{ width: "100%" }}>
            <Button
              id="back"
              type="default"
              size="large"
              style={{ width: "100%" }}
              loading={loading || imageStore.loading}
            >
              Geri Dön
            </Button>
          </Link>
        </Flex>
      </Card>
      {selectedNews && (
        <Card className="edit-right-2" style={{ overflowX: "auto" }}>
          <NewsInformation />
        </Card>
      )}
      <Card style={{ overflowX: "auto" }} className="edit-right-3">
        <NewsImageUploader form={form} />
      </Card>
    </Space>
  );
};

export default observer(NewsDetailsColumn);
