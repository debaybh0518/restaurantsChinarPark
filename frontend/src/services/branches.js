import api from './api';

export const getBranches = async () => {
  const res = await api.get('/companies'); // Should be /branches if backend supports
  return res.data;
};

export const createBranch = async (data) => {
  const res = await api.post('/companies', data); // Should be /branches if backend supports
  return res.data;
};

export const updateBranch = async (id, data) => {
  const res = await api.put(`/companies/${id}`, data); // Should be /branches/:id if backend supports
  return res.data;
};

export const deleteBranch = async (id) => {
  const res = await api.delete(`/companies/${id}`); // Should be /branches/:id if backend supports
  return res.data;
};