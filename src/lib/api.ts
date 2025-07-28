import axios from "axios";

export const API_URL = "http://localhost:5000/api";

export const fetchProducts = async () => {
  const { data } = await axios.get(`${API_URL}/products`);
  return data.data;
};

export const fetchCategories = async () => {
  const { data } = await axios.get(`${API_URL}/categories`);
  return data.data;
};

export const fetchSubcategories = async (categoryId?: string) => {
  // If categoryId is provided, filter by category
  console.log(categoryId)
  const url = categoryId ? `${API_URL}/subcategories?category=${categoryId}` : `${API_URL}/subcategories`;
  const { data } = await axios.get(url);
  return data.data;
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

// Fixed inquiry API functions to use consistent base URL
export const fetchInquiries = async () => {
  const response = await axios.get(`${API_URL}/inquiry`);
  return response.data;
};

export const deleteInquiry = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/inquiry/${id}`);
};

export const updateInquiry = async (id: string, data: any) => {
  const response = await axios.patch(`${API_URL}/inquiries/${id}`, data);
  return response.data;
};