import { makeAutoObservable, runInAction } from "mobx";
import { News as NewsModel, NewsFormValues } from "../models/news";
import { Pagination, PagingParams } from "../models/pagination";
import { store } from "./store";
import agent from "../api/agent";
import { router } from "../router/Routes";

export default class NewsStore {
  newsRegistry = new Map<number, NewsModel>();
  selectedNews: NewsModel | undefined = undefined;
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

  get axiosParams() {
    const params = new URLSearchParams();
    params.append("pageNumber", this.pagingParams.pageNumber.toString());
    params.append("pageSize", this.pagingParams.pageSize.toString());
    return params;
  }

  get newsByDate() {
    return Array.from(this.newsRegistry.values());
  }

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  loadNews = async () => {
    this.setLoadingInitial(true);
    this.newsRegistry.clear();
    try {
      const result = await agent.News.list(this.axiosParams);
      result.data.forEach((news) => {
        this.setNews(news);
      });
      this.setPagination(result.pagination);
      this.setLoadingInitial(false);
    } catch (err) {
      console.log(err);
      this.setLoadingInitial(false);
    }
  };

  setPagination = (pagination: Pagination) => {
    this.pagination = pagination;
  };

  forceLoadNews = async (id: number) => {
    try {
      const news = await agent.News.details(id);
      this.setNews(news);
      runInAction(() => (this.selectedNews = news));
    } catch (err) {
      console.log(err);
    }
  };

  loadNewsById = async (id: number) => {
    let news = this.getNews(id);
    if (news) {
      this.selectedNews = news;
      return news;
    } else {
      this.setLoadingInitial(true);
      try {
        news = await agent.News.details(id);
        this.setNews(news);
        runInAction(() => (this.selectedNews = news));

        this.setLoadingInitial(false);
        return news;
      } catch (err) {
        console.log(err);
        this.setLoadingInitial(false);
      }
    }
  };

  private setNews = (news: NewsModel) => {
    this.newsRegistry.set(news.id!, news);
  };

  private getNews = (id: number) => {
    return this.newsRegistry.get(id);
  };

  createNews = async (news: NewsModel) => {
    try {
      this.loading = true;
      news.id = undefined;
      const createdNews = await agent.News.create(news);
      runInAction(() => {
        this.pagination!.totalItems += 1;
        if (
          this.pagination!.totalItems >
          this.pagination!.itemsPerPage * this.pagination!.totalPages
        ) {
          this.pagination!.totalPages += 1;
        }
        this.setNews(createdNews);
        router.navigate("/haberler");
        store.notificationStore.openNotification("success", "Haber başarıyla eklendi.", "");
        this.loading = false;
      });
    } catch (err) {
      if (err instanceof Array) {
        for (const error of err) {
          store.notificationStore.openNotification("error", error, "");
        }
      } else store.notificationStore.openNotification("error", "Haber eklenemedi.", "");
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateNews = async (news: NewsFormValues) => {
    try {
      this.loading = true;
      await agent.News.update(news);
      runInAction(() => {
        if (news.id) {
          const updatedNews = { ...this.getNews(news.id), ...news };
          this.newsRegistry.set(news.id, updatedNews as NewsModel);
          this.selectedNews = updatedNews as NewsModel;
        }
        router.navigate("/haberler");
        store.notificationStore.openNotification("success", "Haber başarıyla güncellendi.", "");
        this.loading = false;
      });
    } catch (err) {
      if (err instanceof Array) {
        for (const error of err) {
          store.notificationStore.openNotification("error", error, "");
        }
      } else store.notificationStore.openNotification("error", "Haber güncellenemedi.", "");
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  deleteNews = async (id: number) => {
    this.loading = true;
    try {
      await agent.News.delete(id);
      runInAction(() => {
        this.newsRegistry.delete(id);
        this.loading = false;
      });
    } catch (err) {
      console.log(err);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  clearSelectedNews = () => {
    this.selectedNews = undefined;
  };
}
