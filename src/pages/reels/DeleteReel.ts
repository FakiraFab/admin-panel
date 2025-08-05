import axios from "axios";
import { API_URL } from "../../constant";

export const deleteReel = async (id: string) => {
  const response = await axios.delete(`${API_URL}/reels/${id}`);
  return response.data;
}; 