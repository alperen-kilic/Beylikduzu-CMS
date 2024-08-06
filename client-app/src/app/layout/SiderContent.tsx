import { Avatar, Button, Menu, Typography } from "antd";
import { items } from "../utils/MenuItems";
import { useStore } from "../stores/store";
import { LogoutOutlined } from "@ant-design/icons";

const { Title } = Typography;

type Props = {
  collapseHandler: () => void;
};

const SiderContent = ({ collapseHandler }: Props) => {
  const { userStore } = useStore();
  const { user } = userStore;
  return (
    <div className="sider">
      <div className="sider-logo">
        <img src="/assets/logo-light.png" alt="Beylikdüzü Belediyesi Logo" />
        <Avatar
          className="avatar"
          size={80}
          src={<img src={"/assets/avatar.jpg"} alt="avatar" />}
        />
      </div>
      <Title className="title" level={5}>
        {user?.email}
      </Title>
      <Menu items={items} theme="dark" mode="inline" onClick={() => collapseHandler()} />
      <Button
        icon={<LogoutOutlined />}
        type="link"
        danger
        onClick={() => userStore.logout()}
        style={{ width: "100%", display: "flex", marginLeft: "13px", alignItems: "center" }}
      >
        Çıkış Yap
      </Button>
    </div>
  );
};

export default SiderContent;
