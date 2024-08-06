import { makeAutoObservable, runInAction } from "mobx";
import { Article, ArticleFormValues } from "../models/article";
import { Pagination, PagingParams } from "../models/pagination";
import agent from "../api/agent";
import { router } from "../router/Routes";
import { store } from "./store";

export default class ArticlesStore {
  articlesRegistry = new Map<number, Article>();
  selectedArticle: Article | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;
  pagination: Pagination | null = null;
  pagingParams = new PagingParams();

  constructor() {
    makeAutoObservable(this);
  }

  setPagingParams = (pagingParams: PagingParams) => {
    this.pagingParams = pagingParams;
  };

  private setArticle = (article: Article) => {
    this.articlesRegistry.set(article.id!, article);
  };

  private getArticle = (id: number) => {
    return this.articlesRegistry.get(id);
  };

  clearSelectedArticle = () => {
    this.selectedArticle = undefined;
  };

  setPagination = (pagination: Pagination) => {
    this.pagination = pagination;
  };

  get axiosParams() {
    const params = new URLSearchParams();
    params.append("pageNumber", this.pagingParams.pageNumber.toString());
    params.append("pageSize", this.pagingParams.pageSize.toString());
    return params;
  }

  get articlesByDate() {
    return Array.from(this.articlesRegistry.values());
  }

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  loadArticles = async () => {
    this.setLoadingInitial(true);
    this.articlesRegistry.clear();
    try {
      const result = await agent.Articles.list(this.axiosParams);
      result.data.forEach((article) => {
        this.setArticle(article);
      });
      this.setPagination(result.pagination);
      this.setLoadingInitial(false);
    } catch (err) {
      console.log(err);
      this.setLoadingInitial(false);
    }
  };

  forceLoadArticle = async (id: number) => {
    try {
      const article = await agent.Articles.details(id);
      this.setArticle(article);
      runInAction(() => (this.selectedArticle = article));
    } catch (err) {
      console.log(err);
    }
  };

  loadArticleById = async (id: number) => {
    let article = this.getArticle(id);
    if (article) {
      this.selectedArticle = article;
      return article;
    } else {
      this.setLoadingInitial(true);
      try {
        article = await agent.Articles.details(id);
        this.setArticle(article);
        runInAction(() => (this.selectedArticle = article));
        return article;
      } catch (err) {
        console.log(err);
      } finally {
        runInAction(() => (this.loadingInitial = false));
      }
    }
  };

  createArticle = async (article: ArticleFormValues) => {
    try {
      this.loading = true;
      article.id = undefined;
      const createdArticle = await agent.Articles.create(article);
      runInAction(() => {
        this.pagination!.totalItems += 1;
        if (
          this.pagination!.totalItems >
          this.pagination!.itemsPerPage * this.pagination!.totalPages
        ) {
          this.pagination!.totalPages += 1;
        }
        this.setArticle(createdArticle);
        router.navigate("/makaleler");
        store.notificationStore.openNotification("success", "Makale başarıyla eklendi.", "");
        this.loading = false;
      });
    } catch (err) {
      if (err instanceof Array) {
        for (const error of err) {
          store.notificationStore.openNotification("error", error, "");
        }
      } else store.notificationStore.openNotification("error", "Makale eklenemedi.", "");
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateArticle = async (article: ArticleFormValues) => {
    try {
      this.loading = true;
      await agent.Articles.update(article);
      runInAction(() => {
        if (article.id) {
          const updatedArticle = { ...this.getArticle(article.id), ...article };
          this.articlesRegistry.set(article.id, updatedArticle as Article);
          this.selectedArticle = updatedArticle as Article;
        }
        router.navigate("/makaleler");
        store.notificationStore.openNotification("success", "Makale başarıyla güncellendi.", "");
        this.loading = false;
      });
    } catch (err) {
      if (err instanceof Array) {
        for (const error of err) {
          store.notificationStore.openNotification("error", error, "");
        }
      } else store.notificationStore.openNotification("error", "Makale güncellenemedi.", "");
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  deleteArticle = async (id: number) => {
    this.loading = true;
    try {
      await agent.Articles.delete(id);
      runInAction(() => {
        this.articlesRegistry.delete(id);
        this.loading = false;
      });
    } catch (err) {
      console.log(err);
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}
