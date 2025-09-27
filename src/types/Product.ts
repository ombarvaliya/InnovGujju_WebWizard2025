export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: number;
  originalPrice?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  stockStatus: "in-stock" | "low-stock" | "out-of-stock";
  tags: string[];
  features: string[];
}
