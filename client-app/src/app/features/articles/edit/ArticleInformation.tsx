import { Descriptions, Typography } from "antd";
import Link from "antd/es/typography/Link";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../stores/store";
import { format } from "date-fns";

const ArticleInformation = () => {
  const { articlesStore } = useStore();
  const { selectedArticle } = articlesStore;

  const printTimes = () => {
    return (
      <>
        <Descriptions.Item label="Oluşturulma Tarihi">
          {format(selectedArticle!.createdAt as Date, "dd.MM.yyyy HH:mm")}
        </Descriptions.Item>
        <Descriptions.Item label="Güncellenme Tarihi">
          {format(selectedArticle!.updatedAt as Date, "dd.MM.yyyy HH:mm")}
        </Descriptions.Item>
      </>
    );
  };

  const checkActive = () => {
    if (!selectedArticle) {
      return "";
    }

    return selectedArticle.isActive ? (
      <Typography.Text type="success" strong>
        Aktif
      </Typography.Text>
    ) : (
      <Typography.Text type="danger" strong>
        Pasif
      </Typography.Text>
    );
  };

  return (
    <Descriptions title="Sayfa Bilgisi" bordered column={1} style={{ minWidth: 350 }}>
      <Descriptions.Item label="Durumu">{checkActive()}</Descriptions.Item>
      <Descriptions.Item label="Sayfa Linki">
        <Link
          href={`https://beylikduzuhazir.vercel.app/makaleler/${selectedArticle!.id}/${
            selectedArticle!.slug
          }`}
          target="_blank"
        >
          /makaleler/{selectedArticle!.id}/{selectedArticle!.slug}
        </Link>
      </Descriptions.Item>
      {selectedArticle && printTimes()}
    </Descriptions>
  );
};

export default observer(ArticleInformation);
