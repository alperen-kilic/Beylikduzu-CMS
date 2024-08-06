import { Button, Flex, message, Popconfirm, Table, TableProps, Tooltip, Typography } from "antd";
import { News } from "../../../models/news";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined, PictureOutlined } from "@ant-design/icons";
import { useStore } from "../../../stores/store";
import { observer } from "mobx-react-lite";

const NewsList = () => {
  const { newsStore } = useStore();
  const { newsByDate, deleteNews, pagingParams, pagination, loadingInitial } = newsStore;

  const columns: TableProps<News>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <p>{text}</p>,
      sorter: (a, b) => a.id! - b.id!,
      align: "center",
      width: 100,
    },
    {
      title: "Başlık",
      dataIndex: "title",
      key: "title",
      render: (text) => <p>{text}</p>,
      sorter: (a, b) => a.title.localeCompare(b.title),
      width: 300,
    },
    {
      title: "Durum",
      dataIndex: "isActive",
      key: "isActive",
      render: (value) => (
        <>
          {value ? (
            <Typography.Text type="success" strong>
              Aktif
            </Typography.Text>
          ) : (
            <Typography.Text type="danger" strong>
              Pasif
            </Typography.Text>
          )}
        </>
      ),
      width: 100,
    },
    {
      title: "İşlemler",
      dataIndex: "actions",
      render: (_, record) => (
        <Flex wrap="wrap" gap="small">
          <Link to={`galeri?newsId=${record.id}`}>
            <Tooltip title="Galeri">
              <Button type="default" shape="circle" icon={<PictureOutlined />} />
            </Tooltip>
          </Link>
          <Link to={`duzenle?newsId=${record.id}`}>
            <Tooltip title="Düzenle">
              <Button type="primary" shape="circle" icon={<EditOutlined />} />
            </Tooltip>
          </Link>
          <Popconfirm
            title="Haberi sil"
            description="Bu haberi silmek istediğinize emin misiniz?"
            onConfirm={() => {
              deleteNews(record.id as number);
              message.success("Haber başarıyla silindi.");
            }}
            okText="Sil"
            cancelText="İptal"
          >
            <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Flex>
      ),
      width: 250,
    },
  ];
  return (
    <Table
      bordered
      pagination={{
        current: pagingParams.pageNumber,
        pageSize: pagingParams.pageSize,
        total: pagination?.totalItems,
        showSizeChanger: false,
        showTotal: (total) => `Toplam ${total} haber`,
        onChange: (page, pageSize) => {
          newsStore.setPagingParams({ pageNumber: page, pageSize });
          newsStore.loadNews();
        },
      }}
      scroll={{ x: 500 }}
      loading={loadingInitial}
      columns={columns}
      dataSource={newsByDate}
      rowKey={(record) => record.id!.toString()}
    />
  );
};

export default observer(NewsList);
