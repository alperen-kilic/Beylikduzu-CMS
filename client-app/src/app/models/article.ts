import { Category } from "./category";

export interface IArticle {
  id: number | undefined;
  title: string;
  fullText: string;
  imageUrl: string;
  slug: string;
  isActive: boolean;
  isDeleted: boolean;
  categoryId: number;
  category: Category;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export class Article implements IArticle {
  constructor(init: ArticleFormValues) {
    this.id = init.id!;
    this.title = init.title;
    this.fullText = init.fullText;
    this.imageUrl = init.imageUrl;
    this.isActive = init.isActive;
    this.isDeleted = init.isDeleted;
    this.categoryId = init.categoryId;
    this.category = init.category;
    this.slug = init.slug;
  }
  id: number | undefined;
  title: string;
  fullText: string;
  imageUrl: string;
  isActive: boolean;
  isDeleted: boolean;
  slug: string;
  categoryId: number;
  category: Category = { id: 0, title: "" };
  createdAt?: Date | null = null;
  updatedAt?: Date | null = null;
}

export class ArticleFormValues {
  id: number | undefined = undefined;
  title: string = "";
  fullText: string = "";
  imageUrl: string = "";
  slug: string = "";
  isActive: boolean = true;
  isDeleted: boolean = false;
  categoryId: number = 0;
  category: Category = { id: 0, title: "" };

  constructor(article?: ArticleFormValues) {
    if (article) {
      this.id = article.id;
      this.title = article.title;
      this.fullText = article.fullText;
      this.imageUrl = article.imageUrl;
      this.isActive = article.isActive;
      this.isDeleted = article.isDeleted;
      this.categoryId = article.categoryId;
      this.category = article.category;
      this.slug = article.slug;
    }
  }
}
