import api from "../lib/axiosInstance";

export const importTransactions = async (data: any,accountId: number) => {
  const response = await api.post("/transactions/import-transactions", {
    transactions: data,  // ← wrap it in an object
    accountId
  });
  return response.data;
};

export const getTransactions = async (page=1) => {
  const response = await api.get(`/transactions/getTransactions?page=${page}&limit=20`);
  return response.data;
};