
import api from "../lib/axiosInstance";

export const getStats = async (period = "6 months") => {
  const response = await api.get(`/dashboard/stats?period=${period}`);
  return response.data;
}



