import { useLocation } from "react-router-dom";
import { useStore } from "../../../stores/store";
import { useEffect, useState } from "react";
import { Category } from "../../../models/category";
import { Button, Col, Form, FormProps, Input, Row } from "antd";
import LoadingComponent from "../../../layout/LoadingComponent";
import { observer } from "mobx-react-lite";

const CategoriesEdit = observer(() => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const categoryID = params.get("categoryId");
  const [form] = Form.useForm();

  const { categoriesStore } = useStore();
  const {
    loadCategory,
    loadingInitial,
    loading,
    updateCategory,
    createCategory,
    clearSelectedCategory,
  } = categoriesStore;

  const [category, setCategory] = useState<Category>();

  useEffect(() => {
    if (categoryID) {
      loadCategory(Number(categoryID)).then((category) => {
        form.setFieldsValue(category);
        setCategory(category);
      });
    }

    return () => clearSelectedCategory();
  }, [categoryID, loadCategory, clearSelectedCategory]);

  const onFinish: FormProps["onFinish"] = (values) => {
    if (categoryID) {
      updateCategory(values);
    } else {
      createCategory(values);
    }
  };

  if (loadingInitial) return <LoadingComponent />;

  return (
    <Form
      initialValues={category}
      form={form}
      layout="vertical"
      onFinish={onFinish}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
    >
      <Row gutter={50}>
        <Col xs={24} lg={16}>
          <Form.Item name={"id"} noStyle>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item
            label="Kategori Adı"
            name="title"
            rules={[{ required: true, message: "Kategori adı boş bırakılamaz!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Ekle
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
});

export default CategoriesEdit;
