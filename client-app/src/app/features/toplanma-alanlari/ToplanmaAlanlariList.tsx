import { Button, Flex, Popconfirm, Table, TableProps, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useStore } from "../../stores/store";
import { observer } from "mobx-react-lite";
import { Area } from "../../models/area";

const ToplanmaAlanlariList = observer(() => {
  const { areasStore } = useStore();
  const { areas, deleteArea, pagingParams, pagination, loadingInitial } = areasStore;

  const columns: TableProps<Area>["columns"] = [
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
      title: "Toplanma Alanı Adı",
      dataIndex: "title",
      key: "title",
      render: (text) => <p>{text}</p>,
      sorter: (a, b) => a.title.localeCompare(b.title),
      width: 300,
    },
    {
      title: "Adres",
      dataIndex: "address",
      key: "address",
      render: (text) => <p>{text}</p>,
      sorter: (a, b) => a.title.localeCompare(b.title),
      width: 300,
    },
    {
      title: "İşlemler",
      dataIndex: "actions",
      render: (_, record) => (
        <Flex wrap="wrap" gap="small">
          <Link to={`duzenle?id=${record.id}`}>
            <Tooltip title="Düzenle">
              <Button type="primary" shape="circle" icon={<EditOutlined />} />
            </Tooltip>
          </Link>
          <Popconfirm
            title="Toplanma alanını silmek istediğinize emin misiniz?"
            onConfirm={() => deleteArea(record.id!)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Flex>
      ),
      width: 100,
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
        showTotal: (total) => `Toplam ${total} alan`,
        onChange: (page, pageSize) => {
          areasStore.setPagingParams({ pageNumber: page, pageSize });
          areasStore.loadAreas();
        },
      }}
      scroll={{ x: 500 }}
      loading={loadingInitial}
      columns={columns}
      dataSource={areas}
      rowKey={(record) => record.id!.toString()}
    />
  );
});

export default ToplanmaAlanlariList;
