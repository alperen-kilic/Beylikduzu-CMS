import { Divider, Form, FormInstance, Input, Select, Switch } from "antd";
import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";
import { Editor as TinyMCEEditor } from "tinymce";
import { observer } from "mobx-react-lite";
import { ArticleFormValues } from "../../../models/article";
import { useStore } from "../../../stores/store";

type Props = {
  form: FormInstance;
};

const ArticleForm = observer(({ form }: Props) => {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const { categoriesStore } = useStore();
  const { categories } = categoriesStore;

  return (
    <>
      <Form.Item name={"id"} noStyle>
        <Input type="hidden" />
      </Form.Item>
      <Form.Item name={"imageUrl"} noStyle>
        <Input type="hidden" />
      </Form.Item>
      <Form.Item<ArticleFormValues> label="Durumu" name="isActive" valuePropName="checked">
        <Switch checkedChildren="Aktif" unCheckedChildren="Pasif" />
      </Form.Item>
      <Divider orientation="left">Makale Detayları</Divider>
      <Form.Item<ArticleFormValues> label="Başlık" name="title">
        <Input />
      </Form.Item>
      <Form.Item<ArticleFormValues> label="Kategori" name={"categoryId"}>
        <Select>
          {categories.map((category) => (
            <Select.Option key={category.id} value={category.id}>
              {category.title}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item<ArticleFormValues>
        name="fullText"
        getValueFromEvent={() => editorRef.current?.getContent()}
        label=" "
        colon={false}
      >
        <Editor
          apiKey={import.meta.env.VITE_EDITOR_API_KEY as string}
          onInit={(_evt, editor) => (editorRef.current = editor)}
          init={{
            plugins:
              "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker",
            toolbar:
              "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
            language: "tr",
            menubar: "edit view insert format table tools",
          }}
          onEditorChange={(fullText) => form.setFieldsValue({ fullText })}
        />
      </Form.Item>
    </>
  );
});

export default ArticleForm;
