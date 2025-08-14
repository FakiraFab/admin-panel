import axios from "axios";

import { API_URL } from "../constant";

interface PaginationParams {
  page?: number;
  limit?: number;
}


export const fetchProducts = async ({ page = 1, limit = 10 }: PaginationParams = {}) => {
  const { data } = await axios.get(`${API_URL}/products`, {
    params: { page, limit }
  });
  return {
    data: data.data,
    total: data.total,
    totalPages: Math.ceil(data.total / limit)
  };
};

export const fetchCategories = async ({ page = 1, limit = 10 }: PaginationParams = {}) => {
  const { data } = await axios.get(`${API_URL}/categories`, {
    params: { page, limit }
  });
  return {
    data: data.data,
    total: data.pagination.total,
    totalPages: Math.ceil(data.pagination.total / limit)
  };
};

export const fetchSubcategories = async ({ page = 1, limit = 10, categoryId }: PaginationParams & { categoryId?: string } = {}) => {
  const url = categoryId ? `${API_URL}/subcategories?category=${categoryId}` : `${API_URL}/subcategories`;
  const { data } = await axios.get(url, {
    params: { page, limit }
  });
  return {
    data: data.data, // Array of subcategories
    total: data.pagination.total, // Use pagination.total
    totalPages: Math.ceil(data.pagination.total / limit) // Use pagination.total
  };
};

export const addProduct = async (product: any) => {
  const { data } = await axios.post(`${API_URL}/products`, product);
  console.log(data.data);
  return data.data;
};

export const addCategory = async (category: any) => {
  const { data } = await axios.post(`${API_URL}/categories`, category);
  return data.data;
};

export const addSubcategory = async (subcategory: any) => {
  const { data } = await axios.post(`${API_URL}/subcategories`, subcategory);
  return data.data;
};

export const updateProduct = async(id:string,data:any)=>{
  const res = await axios.patch(`${API_URL}/products/${id}`,data);
  return res.data.data;
}

export const updateCategory = async (id: string, data: any) => {
  const res = await axios.patch(`${API_URL}/categories/${id}`, data);
  return res.data.data;
};

export const deleteProduct = async (id: string) => {
  const res = await axios.delete(`${API_URL}/products/${id}`);
  return res.data.data;
};

export const updateSubcategory = async (id: string, data: any) => {
  const res = await axios.patch(`${API_URL}/subcategories/${id}`, data);
  return res.data.data;
};

// Banner API functions
export const fetchBanners = async ({ page = 1, limit = 10 }: PaginationParams = {}) => {
  const { data } = await axios.get(`${API_URL}/banners`, {
    params: { page, limit }
  });
  return {
    data: data.data,
    total: data.pagination?.total || 0,
    totalPages: Math.ceil((data.pagination?.total || 0) / limit)
  };
};

export const addBanner = async (banner: any) => {
  const { data } = await axios.post(`${API_URL}/banners`, banner);
  return data.data;
};

export const updateBanner = async (id: string, banner: any) => {
  const { data } = await axios.patch(`${API_URL}/banners/${id}`, banner);
  return data.data;
};

export const deleteBanner = async (id: string) => {
  const { data } = await axios.delete(`${API_URL}/banners/${id}`);
  return data.data;
};

// Fixed inquiry API functions to use consistent base URL
export const fetchInquiries = async (
  { page = 1, limit = 10 }: PaginationParams = {}
): Promise<{ data: any[]; total: number; totalPages: number }> => {
  const response = await axios.get(`${API_URL}/inquiry`, {
    params: { page, limit }
  });
  const resData = response.data || {};
  const pagination = resData.pagination || {};
  const total: number =
    typeof pagination.total === 'number'
      ? pagination.total
      : typeof resData.total === 'number'
        ? resData.total
        : typeof resData.totalItems === 'number'
          ? resData.totalItems
          : 0;
  const totalPages: number =
    typeof pagination.pages === 'number' && pagination.pages > 0
      ? pagination.pages
      : Math.ceil((total || 0) / limit);
  return {
    data: resData.data || [],
    total,
    totalPages
  };
};

export const deleteInquiry = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/inquiry/${id}`);
};

export const updateInquiry = async (id: string, data: any) => {
  const response = await axios.patch(`${API_URL}/inquiries/${id}`, data);
  return response.data;
};

// Workshop API functions
export const fetchWorkshops = async ({ page = 1, limit = 10 }: PaginationParams = {}) => {
  const { data } = await axios.get(`${API_URL}/workshop/workshops`, {
    params: { page, limit }
  });
  return {
    data: data.data,
    totalPages: data.pagination?.pages || Math.ceil((data.pagination?.total || 0) / limit),
    pagination: data.pagination
    
  };
};

export const addWorkshop = async (workshop: any) => {
  const { data } = await axios.post(`${API_URL}/workshop/create`, workshop);
  return data.data;
};

export const updateWorkshop = async (id: string, workshop: any) => {
  const { data } = await axios.patch(`${API_URL}/workshop/workshops/${id}`, workshop);
  return data.data;
};

export const deleteWorkshop = async (id: string) => {
  const { data } = await axios.delete(`${API_URL}/workshop/workshops/${id}`);
  return data.data;
};

// Workshop Registration API functions
export const fetchRegistrations = async ({ page = 1, limit = 10 }: PaginationParams = {}) => {
  const { data } = await axios.get(`${API_URL}/workshop`, {
    params: { page, limit }
  });
  return {
    data: data.data,
    total: data.pagination?.total || 0,
    totalPages: data.pagination?.pages || Math.ceil((data.pagination?.total || 0) / limit),
    pagination: data.pagination
  };
};

export const updateRegistration = async (id: string, status: string) => {
  const { data } = await axios.patch(`${API_URL}/workshop/${id}`, { status });
  console.log(data.data)
  return data.data;
};

// Reels API functions
export const fetchReels = async ({ page = 1, limit = 10 }: PaginationParams = {}) => {
  const { data } = await axios.get(`${API_URL}/reels`, {
    params: { page, limit }
  });
  const pagination = data.pagination || {};
  const total: number =
    typeof pagination.total === 'number'
      ? pagination.total
      : typeof data.total === 'number'
        ? data.total
        : typeof data.totalItems === 'number'
          ? data.totalItems
          : 0;
  const totalPages: number =
    typeof pagination.pages === 'number' && pagination.pages > 0
      ? pagination.pages
      : Math.ceil((total || 0) / limit);
  return {
    data: data.data,
    total,
    totalPages
  };
};

export const addReel = async (reel: any) => {
  const { data } = await axios.post(`${API_URL}/reels`, reel);
  return data.data;
};

export const updateReel = async (id: string, reel: any) => {
  const { data } = await axios.patch(`${API_URL}/reels/${id}`, reel);
  return data.data;
};

export const deleteReel = async (id: string) => {
  const { data } = await axios.delete(`${API_URL}/reels/${id}`);
  return data.data;
};

export const toggleReelVisibility = async (id: string) => {
  const { data } = await axios.patch(`${API_URL}/reels/${id}/toggle-visibility`);
  return data.data;
};