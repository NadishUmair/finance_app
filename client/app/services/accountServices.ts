import api from "../lib/axiosInstance";

export const createAccount = async (data: {
  name: string;
  organizationId: number;
}) => {
  const response = await api.post("/accounts/create", data);
  return response.data;
};

export const getAccounts = async (organizationId: number) => {
  const response = await api.get(`/accounts/${organizationId}`);
  return response.data;
};