export interface Category {
  name: string;
  price: number;
  accountCount: number;
}

export interface Account {
  id: string;
  game: string;
  server?: string;
  type: string;
  displayImage: string;
  detailImages: string[];
  totalAccountCount?: number;
  categories: Category[];
  createdAt?: unknown;
  updatedAt?: unknown;
}
