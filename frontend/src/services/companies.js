import api from './api';

export const getCompanies = async () => {
  const res = await api.get('/companies');
  return res.data;
};

export const createCompany = async (data) => {
  const res = await api.post('/companies', data);
  return res.data;
};

export const updateCompany = async (id, data) => {
  const res = await api.put(`/companies/${id}`, data);
  return res.data;
};

export const deleteCompany = async (id) => {
  const res = await api.delete(`/companies/${id}`);
  return res.data;
};