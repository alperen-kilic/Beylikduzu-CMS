import { useEffect } from "react";
import { useStore } from "../../../stores/store";
import NewsList from "./NewsList";
import { observer } from "mobx-react-lite";
import { PagingParams } from "../../../models/pagination";
import LoadingComponent from "../../../layout/LoadingComponent";

const NewsDashboard = () => {
  const { newsStore } = useStore();
  const { loadNews, newsRegistry, setPagingParams, pagination } = newsStore;

  useEffect(() => {
    if (newsRegistry.size <= 1) {
      loadNews();
      if (pagination) {
        setPagingParams(new PagingParams(pagination.currentPage + 1));
      }
    }
  }, []);

  if (newsRegistry.size <= 1 && !pagination) return <LoadingComponent />;

  return <NewsList />;
};

export default observer(NewsDashboard);
