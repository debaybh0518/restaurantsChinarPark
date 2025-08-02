import api from './api';

export const getInventory = async () => {
  const res = await api.get('/inventory');
  return res.data;
};

export const createInventory = async (data) => {
  const res = await api.post('/inventory', data);
  return res.data;
};

export const updateInventory = async (id, data) => {
  const res = await api.put(`/inventory/${id}`, data);
  return res.data;
};

export const deleteInventory = async (id) => {
  const res = await api.delete(`/inventory/${id}`);
  return res.data;
};