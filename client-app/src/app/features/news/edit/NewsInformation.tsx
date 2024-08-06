import { Descriptions, Typography } from "antd";
import Link from "antd/es/typography/Link";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../stores/store";
import { format } from "date-fns";

const NewsInformation = () => {
  const { newsStore } = useStore();
  const { selectedNews } = newsStore;

  const printTimes = () => {
    return (
      <>
        <Descriptions.Item label="Oluşturulma Tarihi">
          {format(selectedNews!.createdAt as Date, "dd.MM.yyyy HH:mm")}
        </Descriptions.Item>
        <Descriptions.Item label="Güncellenme Tarihi">
          {format(selectedNews!.updatedAt as Date, "dd.MM.yyyy HH:mm")}
        </Descriptions.Item>
      </>
    );
  };

  const checkActive = () => {
    if (!selectedNews) {
      return "";
    }

    return selectedNews.isActive ? (
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
          href={`https://beylikduzuhazir.vercel.app/haberler/${selectedNews!.id}/${
            selectedNews!.slug
          }`}
          target="_blank"
        >
          /haberler/{selectedNews!.id}/{selectedNews!.slug}
        </Link>
      </Descriptions.Item>
      {selectedNews && printTimes()}
    </Descriptions>
  );
};

export default observer(NewsInformation);
