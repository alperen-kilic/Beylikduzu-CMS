import { observer } from "mobx-react-lite";
import { useStore } from "../stores/store";

import { Typography } from "antd";

const { Title } = Typography;

const ServerError = observer(() => {
  const { commonStore } = useStore();
  return (
    <>
      <Title>Sunucu Hatası</Title>
      <Title type="danger" level={5}>
        {commonStore.error?.message}
      </Title>
      {commonStore.error?.details && (
        <>
          <Title type="warning" level={4}>
            Stack trace
          </Title>
          <code style={{ marginTop: "10px" }}>{commonStore.error.details}</code>
        </>
      )}
    </>
  );
});

export default ServerError;
