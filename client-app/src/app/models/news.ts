import { Gallery } from "./gallery";

export interface INews {
  id: number | undefined;
  title: string;
  slug: string;
  description: string;
  fullText: string;
  imageUrl: string;
  isActive: boolean;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  gallery?: Gallery;
}

export class News implements INews {
  constructor(init: NewsFormValues) {
    this.id = init.id!;
    this.title = init.title;
    this.description = init.description;
    this.fullText = init.fullText;
    this.imageUrl = init.imageUrl;
    this.isActive = init.isActive;
    this.slug = init.slug;
  }
  id: number | undefined;
  title: string;
  description: string;
  fullText: string;
  imageUrl: string;
  isActive: boolean;
  slug: string;
  createdAt?: Date | null = null;
  updatedAt?: Date | null = null;
  gallery?: Gallery = { id: 0, galleryImages: [] };
}

export class NewsFormValues {
  id: number | undefined = undefined;
  title: string = "";
  slug: string = "";
  description: string = "";
  fullText: string = "";
  imageUrl: string = "";
  isActive: boolean = true;

  constructor(news?: NewsFormValues) {
    if (news) {
      this.id = news.id;
      this.title = news.title;
      this.description = news.description;
      this.fullText = news.fullText;
      this.imageUrl = news.imageUrl;
      this.isActive = news.isActive;
      this.slug = news.slug;
    }
  }
}
