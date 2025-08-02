import api from './api';

export const getPayments = async () => {
  const res = await api.get('/payments');
  return res.data;
};

export const initiatePayment = async (data) => {
  const res = await api.post('/payments/initiate', data);
  return res.data;
};

export const confirmPayment = async (data) => {
  const res = await api.post('/payments/confirm', data);
  return res.data;
};