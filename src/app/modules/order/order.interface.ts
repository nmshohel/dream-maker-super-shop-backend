export type OrderFilterRequest = {
  searchTerm?: string;
};

type Product = {
  productId: string;
  quantity: string;
};

export type OrderType = {
  product: Product[];
  orderType: string; // Assuming orderType can be any string, you can replace it with a more specific type if needed
};