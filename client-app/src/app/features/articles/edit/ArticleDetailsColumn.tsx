import { Button, Card, Flex, FormInstance, Space } from "antd";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../stores/store";
import { Link } from "react-router-dom";
import ArticleInformation from "./ArticleInformation";
import ArticleImageUploader from "./ArticleImageUploader";

type Props = {
  form: FormInstance;
};

const ArticleDetailsColumn = ({ form }: Props) => {
  const { imageStore, articlesStore } = useStore();
  const { uploadImage } = imageStore;
  const { loading, selectedArticle } = articlesStore;

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
          <Link to="/makaleler" style={{ width: "100%" }}>
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
      {selectedArticle && (
        <Card className="edit-right-2" style={{ overflowX: "auto" }}>
          <ArticleInformation />
        </Card>
      )}
      <Card style={{ overflowX: "auto" }} className="edit-right-3">
        <ArticleImageUploader form={form} />
      </Card>
    </Space>
  );
};

export default observer(ArticleDetailsColumn);
