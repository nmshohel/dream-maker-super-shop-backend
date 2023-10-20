export type userFilterRequest = {
  searchTerm?: string;
};

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string; // You may want to omit this property if you remove it
  role: string; // You might use an enum or a more specific type for 'role'
  contactNo: string;
  address: string;
  shippingAddress: string;
  profileImg: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface UserMeta extends IUser {
  total: number;
  page: number;
  limit: number;
}
