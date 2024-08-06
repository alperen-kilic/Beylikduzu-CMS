import { useEffect } from "react";
import { useStore } from "../../../stores/store";
import { PagingParams } from "../../../models/pagination";
import LoadingComponent from "../../../layout/LoadingComponent";
import ArticlesList from "./ArticlesList";
import { observer } from "mobx-react-lite";

const ArticlesDashboard = observer(() => {
  const { articlesStore, categoriesStore } = useStore();
  const { loadArticles, articlesRegistry, setPagingParams, pagination } = articlesStore;
  const { loadCategories } = categoriesStore;

  useEffect(() => {
    if (articlesRegistry.size <= 1) {
      loadArticles();
      loadCategories();
      if (pagination) {
        setPagingParams(new PagingParams(pagination.currentPage + 1));
      }
    }
  }, []);

  if (articlesRegistry.size <= 1 && !pagination) return <LoadingComponent />;
  return <ArticlesList />;
});

export default ArticlesDashboard;
