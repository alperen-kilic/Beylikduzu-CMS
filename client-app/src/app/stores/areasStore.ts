import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { router } from "../router/Routes";
import { store } from "./store";
import { Area } from "../models/area";
import { Pagination, PagingParams } from "../models/pagination";

export default class AreasStore {
  areasRegistry = new Map<number, Area>();
  selectedArea: Area | undefined = undefined;
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

  get areas() {
    return Array.from(this.areasRegistry.values());
  }

  private setArea = (area: Area) => {
    this.areasRegistry.set(area.id!, area);
  };

  private getArea = (id: number) => {
    return this.areasRegistry.get(id);
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  loadAreas = async () => {
    this.setLoadingInitial(true);
    this.areasRegistry.clear();
    try {
      const result = await agent.Areas.list(this.axiosParams);
      result.data.forEach((area) => {
        this.setArea(area);
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

  loadArea = async (id: number) => {
    let area = this.getArea(id);
    if (area) {
      this.selectedArea = area;
      return area;
    } else {
      this.setLoadingInitial(true);
      try {
        area = await agent.Areas.details(id);
        this.setArea(area);
        runInAction(() => (this.selectedArea = area));

        this.setLoadingInitial(false);
        return area;
      } catch (err) {
        console.log(err);
        this.setLoadingInitial(false);
      }
    }
  };

  createArea = async (area: Area) => {
    try {
      this.loading = true;
      area.id = undefined;
      const createdArea = await agent.Areas.create(area);
      this.setArea(createdArea);
      router.navigate("/toplanma-alanlari");
      store.notificationStore.openNotification("success", "Toplanma alanı başarıyla eklendi.", "");
      this.loading = false;
    } catch (err) {
      if (err instanceof Array) {
        for (const error of err) {
          store.notificationStore.openNotification("error", error, "");
        }
      } else store.notificationStore.openNotification("error", "Toplanma alanı eklenemedi.", "");
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateArea = async (area: Area) => {
    try {
      this.loading = true;
      await agent.Areas.update(area);
      runInAction(() => {
        if (area.id) {
          const updatedArea = { ...this.getArea(area.id), ...area };
          this.areasRegistry.set(area.id, updatedArea as Area);
          this.selectedArea = updatedArea as Area;
        }
        router.navigate("/toplanma-alanlari");
        store.notificationStore.openNotification(
          "success",
          "Toplanma alanı başarıyla güncellendi.",
          ""
        );
        this.loading = false;
      });
    } catch (err) {
      if (err instanceof Array) {
        for (const error of err) {
          store.notificationStore.openNotification("error", error, "");
        }
      } else
        store.notificationStore.openNotification("error", "Toplanma alanı güncellenemedi.", "");
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  deleteArea = async (id: number) => {
    this.loading = true;
    try {
      await agent.Areas.delete(id);
      runInAction(() => {
        this.areasRegistry.delete(id);
        this.loading = false;
      });
    } catch (err) {
      console.log(err);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  clearSelectedArea = () => {
    this.selectedArea = undefined;
  };
}
