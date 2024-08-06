import axios, { AxiosError, AxiosResponse } from "axios";
import { router } from "../router/Routes";
import { message } from "antd";
import { PaginatedResult } from "../models/pagination";
import { News as NewsModel, NewsFormValues } from "../models/news";
import { store } from "../stores/store";
import { GalleryImage } from "../models/image";
import { Category } from "../models/category";
import { Article, ArticleFormValues } from "../models/article";
import { Area } from "../models/area";
import { Gallery } from "../models/gallery";
import { User, UserFormValues } from "../models/user";

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

axios.defaults.baseURL = import.meta.env.VITE_API_URL as string;

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

axios.interceptors.request.use((config) => {
  const token = store.commonStore.token;
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  async (response) => {
    if (import.meta.env.DEV) await sleep(1000);
    const pagination = response.headers["pagination"];
    if (pagination) {
      response.data = new PaginatedResult(response.data, JSON.parse(pagination));
      return response as AxiosResponse<PaginatedResult<unknown>>;
    }
    return response;
  },
  (error: AxiosError) => {
    const { data, status, config, headers } = error.response as AxiosResponse;
    switch (status) {
      case 400:
        if (config.method === "get" && Object.prototype.hasOwnProperty.call(data.errors, "id")) {
          router.navigate("/not-found");
        }
        if (data.errors) {
          const modalStateErrors = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modalStateErrors.push(data.errors[key]);
            }
          }
          throw modalStateErrors.flat();
        } else {
          message.error(data);
        }
        break;
      case 401:
        if (
          status === 401 &&
          headers["www-authenticate"]?.startsWith('Bearer error="invalid_token')
        ) {
          // store.userStore.logout();
          message.error("Oturumun süresi doldu - tekrar giriş yapın.");
        }
        break;
      case 403:
        message.error("Yasaklı");
        break;
      case 404:
        router.navigate("/not-found");
        break;
      case 500:
        store.commonStore.setServerError(data);
        router.navigate("/server-error");
        break;
    }
    return Promise.reject(error);
  }
);

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: object) => axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: object) => axios.put<T>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Account = {
  current: () => requests.get<User>("/account"),
  login: (user: UserFormValues) => requests.post<User>("/account/login", user),
  refreshToken: () => requests.post<User>("/account/refreshToken", {}),
};

const News = {
  list: (params: URLSearchParams) =>
    axios.get<PaginatedResult<NewsModel[]>>("/news", { params }).then(responseBody),
  details: (id: number) => requests.get<NewsModel>(`/news/${id}`),
  create: (news: NewsFormValues) => requests.post<NewsModel>("/news", news),
  update: (news: NewsFormValues) => requests.put<void>(`/news/${news.id}`, news),
  delete: (id: number) => requests.del<void>(`/news/${id}`),
};

const Images = {
  upload: (formData: FormData) => requests.post<string>("/images", formData),
  uploadToGallery: (formData: FormData, id: string) =>
    requests.post<void>(`images/gallery/${id}`, formData),
  delete: (id: number) => requests.del<void>(`/images/gallery/${id}`),
  setGalleryOrders: (galleryImages: GalleryImage[], id: number) =>
    requests.put(`/images/gallery/${id}/setOrders`, galleryImages),
  getGallery: (id: number) => requests.get<Gallery>(`/images/gallery/${id}`),
};

const Categories = {
  list: () => requests.get<Category[]>("/categories"),
  details: (id: number) => requests.get<Category>(`/categories/${id}`),
  create: (category: Category) => requests.post<Category>("/categories", category),
  update: (category: Category) => requests.put<void>(`/categories/${category.id}`, category),
  delete: (id: number) => requests.del<void>(`/categories/${id}`),
};

const Articles = {
  list: (params: URLSearchParams) =>
    axios.get<PaginatedResult<Article[]>>("/articles", { params }).then(responseBody),
  details: (id: number) => requests.get<Article>(`/articles/${id}`),
  create: (article: ArticleFormValues) => requests.post<Article>("/articles", article),
  update: (article: ArticleFormValues) => requests.put<void>(`/articles/${article.id}`, article),
  delete: (id: number) => requests.del<void>(`/articles/${id}`),
};

const Areas = {
  list: (params: URLSearchParams) =>
    axios.get<PaginatedResult<Area[]>>("/toplanmaalanlari", { params }).then(responseBody),
  details: (id: number) => requests.get<Area>(`/toplanmaalanlari/${id}`),
  create: (area: Area) => requests.post<Area>("/toplanmaalanlari", area),
  update: (area: Area) => requests.put<void>(`/toplanmaalanlari/${area.id}`, area),
  delete: (id: number) => requests.del<void>(`/toplanmaalanlari/${id}`),
};

const agent = {
  Account,
  News,
  Images,
  Categories,
  Articles,
  Areas,
};

export default agent;
