import { Col, Row, Table } from "antd";
import { dashboardColumns } from "../news/dashboard/NewsDashboardModel";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/store";
import { useEffect } from "react";
import LoadingComponent from "../../layout/LoadingComponent";

const Dashboard = observer(() => {
  const { newsStore, articlesStore } = useStore();

  const { loadNews, newsRegistry, newsByDate, loadingInitial } = newsStore;
  const { loadArticles, articlesRegistry, articlesByDate } = articlesStore;

  useEffect(() => {
    if (newsRegistry.size <= 1) {
      loadNews();
    }
    if (articlesRegistry.size <= 1) {
      loadArticles();
    }
  }, [articlesRegistry.size, loadArticles, loadNews, newsRegistry.size]);

  if (loadingInitial) return <LoadingComponent />;

  return (
    <Row gutter={[40, 40]}>
      <Col xs={24} lg={12}>
        <Table
          columns={dashboardColumns}
          bordered
          pagination={false}
          dataSource={newsByDate.slice(0, 5)}
          rowKey={(record) => record.title}
          title={() => <h3>Son Haberler</h3>}
        />
      </Col>
      <Col xs={24} lg={12}>
        <Table
          columns={dashboardColumns}
          bordered
          pagination={false}
          dataSource={articlesByDate.slice(0, 5)}
          rowKey={(record) => record.title}
          title={() => <h3>Son Makaleler</h3>}
        />
      </Col>
    </Row>
  );
});

export default Dashboard;
