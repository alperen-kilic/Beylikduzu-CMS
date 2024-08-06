import { Divider, Form, FormInstance, Input, Switch } from "antd";
import { NewsFormValues } from "../../../models/news";
import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";
import { Editor as TinyMCEEditor } from "tinymce";
import { observer } from "mobx-react-lite";

type Props = {
  form: FormInstance;
};

const NewsForm = ({ form }: Props) => {
  const editorRef = useRef<TinyMCEEditor | null>(null);

  return (
    <>
      <Form.Item name={"id"} noStyle>
        <Input type="hidden" />
      </Form.Item>
      <Form.Item name={"imageUrl"} noStyle>
        <Input type="hidden" />
      </Form.Item>
      <Form.Item<NewsFormValues> label="Durumu" name="isActive" valuePropName="checked">
        <Switch checkedChildren="Aktif" unCheckedChildren="Pasif" />
      </Form.Item>
      <Divider orientation="left">Haber Detayları</Divider>
      <Form.Item<NewsFormValues> label="Başlık" name="title">
        <Input />
      </Form.Item>
      <Form.Item<NewsFormValues> label="Kısa Açıklama" name="description">
        <Input />
      </Form.Item>
      <Form.Item<NewsFormValues>
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
};

export default observer(NewsForm);
