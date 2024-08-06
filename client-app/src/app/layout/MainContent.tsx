import { Outlet, ScrollRestoration } from "react-router-dom";
import { Layout, theme, notification, ConfigProvider } from "antd";

const { Header, Content, Footer, Sider } = Layout;

import SiderContent from "./SiderContent";
import { observer } from "mobx-react-lite";
import { APIProvider } from "@vis.gl/react-google-maps";
import "./styles.css";
import { useState } from "react";

const MainContent = () => {
  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [, contextHolder] = notification.useNotification();

  const collapseHandler = () => {
    setCollapsed(!collapsed);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Image: {
            /* here is your component tokens */
            zIndexPopupBase: 9999,
          },
        },
      }}
    >
      <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY as string}>
        <ScrollRestoration />
        {contextHolder}
        <Layout hasSider style={{ minHeight: "100vh" }}>
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            width={275}
            style={{
              height: "100vh",
              position: "fixed",
              left: 0,
              top: 0,
              bottom: 0,
            }}
          >
            <SiderContent collapseHandler={collapseHandler} />
          </Sider>
          <Layout>
            <Header style={{ padding: 0, background: colorBgContainer }} />
            <Content style={{ margin: "24px 16px 0" }}>
              <div
                style={{
                  padding: 24,
                  minHeight: 360,
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
                }}
              >
                <Outlet />
              </div>
            </Content>
            <Footer style={{ textAlign: "center" }}>
              Beylikdüzü Belediyesi ©{new Date().getFullYear()} Bilgi İşlem Müdürlüğü
            </Footer>
          </Layout>
        </Layout>
      </APIProvider>
    </ConfigProvider>
  );
};

export default observer(MainContent);
