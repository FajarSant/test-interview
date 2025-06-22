// src/types/article.ts

export interface Category {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  userId: string;
  categoryId: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  category: Category; // Menghubungkan artikel dengan kategori
  user: {
    id: string;
    username: string;
  };
}
