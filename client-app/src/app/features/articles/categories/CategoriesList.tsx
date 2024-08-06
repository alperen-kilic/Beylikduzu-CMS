import { Button, Flex, Popconfirm, Table, TableProps, Tooltip } from "antd";
import { useStore } from "../../../stores/store";
import { Category } from "../../../models/category";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";

const CategoriesList = observer(() => {
  const { categoriesStore } = useStore();
  const { categories, deleteCategory } = categoriesStore;

  const columns: TableProps<Category>["columns"] = [
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
      title: "İşlemler",
      dataIndex: "actions",
      render: (_, record) => (
        <Flex wrap="wrap" gap="small">
          <Link to={`duzenle?categoryId=${record.id}`}>
            <Tooltip title="Düzenle">
              <Button type="primary" shape="circle" icon={<EditOutlined />} />
            </Tooltip>
          </Link>
          <Popconfirm
            title="Kategoriyi silmek istediğinize emin misiniz?"
            onConfirm={() => deleteCategory(record.id!)}
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
      columns={columns}
      scroll={{ x: 500 }}
      dataSource={categories}
      rowKey={(record) => record.id!.toString()}
    />
  );
});

export default CategoriesList;
