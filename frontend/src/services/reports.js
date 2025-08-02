import api from './api';

export const getSalesReport = async () => {
  const res = await api.get('/reports/sales');
  return res.data;
};

export const getKOTReport = async () => {
  const res = await api.get('/reports/kots');
  return res.data;
};

export const getInventoryReport = async () => {
  const res = await api.get('/reports/inventory');
  return res.data;
};