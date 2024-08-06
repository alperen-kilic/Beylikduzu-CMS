import { createContext, useContext } from "react";
import CommonStore from "./commonStore";
import NewsStore from "./newsStore";
import ImageStore from "./imagesStore";
import NotificationStore from "./notificationStore";
import CategoriesStore from "./categoriesStore";
import ArticlesStore from "./articlesStore";
import AreasStore from "./areasStore";
import UserStore from "./userStore";

interface Store {
  userStore: UserStore;
  newsStore: NewsStore;
  commonStore: CommonStore;
  imageStore: ImageStore;
  notificationStore: NotificationStore;
  categoriesStore: CategoriesStore;
  articlesStore: ArticlesStore;
  areasStore: AreasStore;
}

export const store: Store = {
  userStore: new UserStore(),
  newsStore: new NewsStore(),
  commonStore: new CommonStore(),
  imageStore: new ImageStore(),
  notificationStore: new NotificationStore(),
  categoriesStore: new CategoriesStore(),
  articlesStore: new ArticlesStore(),
  areasStore: new AreasStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
