import { observer } from "mobx-react-lite";
import { useStore } from "../../../stores/store";
import { Button, Flex, message, Popconfirm, Table, TableProps, Tooltip, Typography } from "antd";
import { Article } from "../../../models/article";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const ArticlesList = observer(() => {
  const { articlesStore } = useStore();
  const { articlesByDate, deleteArticle, pagingParams, pagination, loadingInitial } = articlesStore;

  const columns: TableProps<Article>["columns"] = [
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
      title: "Kategori",
      dataIndex: "category",
      key: "category",
      render: (category) => {
        return category?.title ? <p>{category.title}</p> : <p>Kategori Yok</p>;
      },
      width: 200,
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
          <Link to={`duzenle?articleId=${record.id}`}>
            <Tooltip title="Düzenle">
              <Button type="primary" shape="circle" icon={<EditOutlined />} />
            </Tooltip>
          </Link>
          <Popconfirm
            title="Makaleyi sil"
            description="Bu makaleyi silmek istediğinize emin misiniz?"
            onConfirm={() => {
              deleteArticle(record.id as number);
              message.success("Makale başarıyla silindi.");
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
        showTotal: (total) => `Toplam ${total} makale`,
        onChange: (page, pageSize) => {
          articlesStore.setPagingParams({ pageNumber: page, pageSize });
          articlesStore.loadArticles();
        },
      }}
      scroll={{ x: 500 }}
      loading={loadingInitial}
      columns={columns}
      dataSource={articlesByDate}
      rowKey={(record) => record.id!.toString()}
    />
  );
});

export default ArticlesList;
