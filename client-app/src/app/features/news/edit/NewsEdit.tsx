import { Col, Form, FormProps, Row } from "antd";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NewsForm from "./NewsForm";
import NewsDetailsColumn from "./NewsDetailsColumn";
import { NewsFormValues } from "../../../models/news";
import { useStore } from "../../../stores/store";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../layout/LoadingComponent";

const NewsEdit = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const newsId = params.get("newsId");
  const [form] = Form.useForm();
  const { newsStore } = useStore();
  const { loadNewsById, loadingInitial, updateNews, createNews, clearSelectedNews } = newsStore;

  useEffect(() => {
    if (newsId) {
      loadNewsById(Number(newsId)).then((news) => {
        form.setFieldsValue(news);
      });
    } else {
      form.setFieldsValue({ isActive: true });
    }

    return () => clearSelectedNews();
  }, [newsId, loadNewsById, clearSelectedNews]);

  const onFinish: FormProps<NewsFormValues>["onFinish"] = (values) => {
    if (newsId) {
      form.setFieldValue("id", Number(newsId));
      updateNews(values);
    } else {
      createNews(values);
    }
  };

  if (loadingInitial) return <LoadingComponent />;

  return (
    <Form form={form} onFinish={onFinish} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
      <Row gutter={50}>
        <Col xs={24} lg={16}>
          <NewsForm form={form} />
        </Col>
        <Col xs={24} lg={8}>
          <NewsDetailsColumn form={form} />
        </Col>
      </Row>
    </Form>
  );
};

export default observer(NewsEdit);
