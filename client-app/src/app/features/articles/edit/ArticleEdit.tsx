import { Col, Form, FormProps, Row } from "antd";
import { observer } from "mobx-react-lite";
import { useLocation } from "react-router-dom";
import { useStore } from "../../../stores/store";
import { useEffect } from "react";
import { ArticleFormValues } from "../../../models/article";
import LoadingComponent from "../../../layout/LoadingComponent";
import ArticleForm from "./ArticleForm";
import ArticleDetailsColumn from "./ArticleDetailsColumn";

const ArticleEdit = observer(() => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const articleId = params.get("articleId");
  const [form] = Form.useForm();
  const { articlesStore, categoriesStore } = useStore();
  const { loadArticleById, loadingInitial, updateArticle, createArticle, clearSelectedArticle } =
    articlesStore;
  const { loadCategories } = categoriesStore;

  useEffect(() => {
    loadCategories();
    if (articleId) {
      loadArticleById(Number(articleId)).then((article) => {
        form.setFieldsValue(article);
      });
    } else {
      form.setFieldsValue({ isActive: true });
    }

    return () => clearSelectedArticle();
  }, [articleId, loadArticleById, clearSelectedArticle, form]);

  const onFinish: FormProps<ArticleFormValues>["onFinish"] = (values) => {
    if (articleId) {
      form.setFieldValue("id", Number(articleId));
      updateArticle(values);
    } else {
      createArticle(values);
    }
  };

  if (loadingInitial) return <LoadingComponent />;

  return (
    <Form form={form} onFinish={onFinish} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
      <Row gutter={50}>
        <Col xs={24} lg={16}>
          <ArticleForm form={form} />
        </Col>
        <Col xs={24} lg={8}>
          <ArticleDetailsColumn form={form} />
        </Col>
      </Row>
    </Form>
  );
});

export default ArticleEdit;
