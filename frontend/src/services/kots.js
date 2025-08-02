import api from './api';

export const getKOTs = async () => {
  const res = await api.get('/kots');
  return res.data;
};

export const createKOT = async (data) => {
  const res = await api.post('/kots', data);
  return res.data;
};

export const updateKOT = async (id, data) => {
  const res = await api.put(`/kots/${id}`, data);
  return res.data;
};