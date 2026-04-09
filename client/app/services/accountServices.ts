import api from "../lib/axiosInstance";

export const createAccount = async (data: {
  name: string;
  organizationId: number;
}) => {
  const response = await api.post("/setup/create-account", data);
  return response.data;
};

export const getAccounts = async () => {
  const response = await api.get("/setup/accounts");
  return response.data;
};