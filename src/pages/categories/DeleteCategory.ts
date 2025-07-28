import axios from 'axios';
import { API_URL } from '../../constant';

export async function deleteCategory(id: string): Promise<void> {
  
  const {data} = await axios.delete(`${API_URL}/categories/${id}`);
  console.log(data);

} 