import axios from 'axios';
import { API_URL } from '../../lib/api';

export async function deleteSubcategory(id: string): Promise<void> {
 const {data} =await axios.delete(`${API_URL}/subcategories/${id}`);
 console.log(data);
 
} 