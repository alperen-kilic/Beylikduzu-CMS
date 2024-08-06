import { makeAutoObservable, runInAction } from "mobx";
import { Category } from "../models/category";
import agent from "../api/agent";
import { router } from "../router/Routes";
import { store } from "./store";

export default class CategoriesStore {
  categoriesRegistry = new Map<number, Category>();
  selectedCategory: Category | undefined = undefined;
  loading = false;
  loadingInitial = false;

  constructor() {
    makeAutoObservable(this);
  }

  get categories() {
    return Array.from(this.categoriesRegistry.values());
  }

  private setCategory = (category: Category) => {
    this.categoriesRegistry.set(category.id!, category);
  };

  private getCategory = (id: number) => {
    return this.categoriesRegistry.get(id);
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  loadCategories = async () => {
    this.setLoadingInitial(true);
    this.categoriesRegistry.clear();
    try {
      const categories = await agent.Categories.list();
      categories.forEach((category) => {
        this.setCategory(category);
      });
      this.setLoadingInitial(false);
    } catch (err) {
      console.log(err);
      this.setLoadingInitial(false);
    }
  };

  loadCategory = async (id: number) => {
    let category = this.getCategory(id);
    if (category) {
      this.selectedCategory = category;
      return category;
    } else {
      this.setLoadingInitial(true);
      try {
        category = await agent.Categories.details(id);
        this.setCategory(category);
        runInAction(() => (this.selectedCategory = category));

        this.setLoadingInitial(false);
        return category;
      } catch (err) {
        console.log(err);
        this.setLoadingInitial(false);
      }
    }
  };

  createCategory = async (category: Category) => {
    try {
      this.loading = true;
      category.id = undefined;
      const createdCategory = await agent.Categories.create(category);
      this.setCategory(createdCategory);
      router.navigate("/makaleler/kategoriler");
      store.notificationStore.openNotification("success", "Kategori başarıyla eklendi.", "");
      this.loading = false;
    } catch (err) {
      if (err instanceof Array) {
        for (const error of err) {
          store.notificationStore.openNotification("error", error, "");
        }
      } else store.notificationStore.openNotification("error", "Kategori eklenemedi.", "");
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateCategory = async (category: Category) => {
    try {
      this.loading = true;
      await agent.Categories.update(category);
      runInAction(() => {
        if (category.id) {
          const updatedCategory = { ...this.getCategory(category.id), ...category };
          this.categoriesRegistry.set(category.id, updatedCategory as Category);
          this.selectedCategory = updatedCategory as Category;
        }
        router.navigate("/makaleler/kategoriler");
        store.notificationStore.openNotification("success", "Kategori başarıyla güncellendi.", "");
        this.loading = false;
      });
    } catch (err) {
      if (err instanceof Array) {
        for (const error of err) {
          store.notificationStore.openNotification("error", error, "");
        }
      } else store.notificationStore.openNotification("error", "Kategori güncellenemedi.", "");
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  deleteCategory = async (id: number) => {
    this.loading = true;
    try {
      await agent.Categories.delete(id);
      runInAction(() => {
        this.categoriesRegistry.delete(id);
        this.loading = false;
      });
    } catch (err) {
      console.log(err);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  clearSelectedCategory = () => {
    this.selectedCategory = undefined;
  };
}
