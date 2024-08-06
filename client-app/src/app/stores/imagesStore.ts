import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { message, UploadFile } from "antd";
import { RcFile } from "antd/es/upload";
import { store } from "./store";
import { GalleryImage } from "../models/image";
import { Gallery } from "../models/gallery";

export default class ImageStore {
  loading = false;
  loadingInitial = false;
  gallery: Gallery | null = null;
  file: UploadFile | null = null;
  fileList: UploadFile[] | null = [];

  constructor() {
    makeAutoObservable(this);
  }

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  setLoading = (state: boolean) => {
    this.loading = state;
  };

  setFile = (file: UploadFile | null) => {
    this.file = file;
    this.setLoading(false);
  };

  setFileList = (fileList: UploadFile[] | null) => {
    this.fileList = fileList;
    this.setLoading(false);
  };

  uploadImage = async () => {
    this.setLoading(true);
    if (!this.file) {
      this.setLoading(false);
      return null;
    }
    const formData = new FormData();
    formData.append("File", this.file as RcFile);
    try {
      const imagePath = await agent.Images.upload(formData);
      runInAction(() => {
        this.file = null;
      });
      return imagePath;
    } catch (err) {
      console.log(err);
    } finally {
      this.setLoading(false);
    }
  };

  addToFileList = (file: UploadFile) => {
    this.setFileList([...(this.fileList as UploadFile[]), file]);
  };

  uploadImagesToGallery = async (id: string, fileList: UploadFile[]) => {
    this.setFileList(fileList);
    if (!this.fileList || this.fileList.length === 0) {
      this.setLoading(false);
      return null;
    }
    this.setLoading(true);
    const formData = new FormData();
    this.fileList.forEach((file) => {
      formData.append(`FileList`, file as RcFile);
    });
    try {
      await agent.Images.uploadToGallery(formData, id);
      runInAction(() => {
        this.fileList = null;
      });
      message.success("Resimler başarıyla yüklendi.");
      store.newsStore.forceLoadNews(Number(id));
    } catch (err) {
      console.log(err);
    } finally {
      this.setLoading(false);
    }
  };

  uploadToMainGallery = async (id: string, fileList: UploadFile[]) => {
    this.setFileList(fileList);
    if (!this.fileList || this.fileList.length === 0) {
      this.setLoading(false);
      return null;
    }
    this.setLoading(true);
    const formData = new FormData();
    this.fileList.forEach((file) => {
      formData.append(`FileList`, file as RcFile);
    });
    try {
      await agent.Images.uploadToGallery(formData, id);
      runInAction(() => {
        this.fileList = null;
        this.getGallery(Number(id));
      });
      message.success("Resimler başarıyla yüklendi.");
    } catch (err) {
      console.log(err);
    } finally {
      this.setLoading(false);
    }
  };

  deleteImage = async (publicId: number) => {
    try {
      await agent.Images.delete(publicId);
    } catch (err) {
      console.log(err);
    }
  };

  getGallery = async (id: number) => {
    this.setLoadingInitial(true);
    try {
      const gallery = await agent.Images.getGallery(id);
      runInAction(() => {
        this.gallery = gallery;
      });
    } catch (err) {
      console.log(err);
    } finally {
      this.setLoadingInitial(false);
    }
  };

  clearGallery = () => {
    this.gallery = null;
  };

  setGalleryOrders = async (galleryImages: GalleryImage[]) => {
    this.setLoading(true);
    const newsId = store.newsStore.selectedNews?.id;
    if (newsId) {
      try {
        await agent.Images.setGalleryOrders(galleryImages, newsId);
        runInAction(() => {
          this.setLoading(false);
        });
        message.success("Resimlerin sıralaması başarıyla güncellendi.");
      } catch (err) {
        console.log(err);
      } finally {
        this.setLoading(false);
      }
    }
  };

  setMainGalleryOrders = async (galleryImages: GalleryImage[], id: number) => {
    this.setLoading(true);

    if (galleryImages.length > 0) {
      try {
        await agent.Images.setGalleryOrders(galleryImages, Number(id));
        runInAction(() => {
          this.setLoading(false);
        });
        message.success("Resimlerin sıralaması başarıyla güncellendi.");
      } catch (err) {
        console.log(err);
      } finally {
        this.setLoading(false);
      }
    }
  };
}
