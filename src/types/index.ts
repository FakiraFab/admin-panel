export interface User {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  design: string;
  sizes: string[];
  length: number;
  description: string;
  images: string[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  description?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  customerName: string;
  products: Product[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  image: string;
  link?: string;
  isActive: boolean;
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}


export interface Enquiry {
  _id: string;
  userName: string;
  userEmail: string;
  whatsappNumber?: string;
  buyOption: 'Personal' | 'Wholesale' | 'Other';
  location: string;
  quantity: number;
  companyName?: string;
  product: Product;
  productName: string;
  productImage: string;
  variant?: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  message?: string;
  createdAt: string;
}

export interface InquiryResponse {
  success: boolean;
  data: Enquiry[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}