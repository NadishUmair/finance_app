import api from "../lib/axiosInstance"; // ✅ not plain axios

export const createCategory = async (data: {
  name: string;
  organizationId: number;
}) => {
  const response = await api.post("/setup/create-category", data);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get(`/setup/categories`);
  return response.data;
};