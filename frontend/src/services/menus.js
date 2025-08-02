import api from './api';

export const getMenus = async () => {
  const res = await api.get('/menus');
  return res.data;
};

export const createMenu = async (data) => {
  const res = await api.post('/menus', data);
  return res.data;
};

export const updateMenu = async (id, data) => {
  const res = await api.put(`/menus/${id}`, data);
  return res.data;
};

export const deleteMenu = async (id) => {
  const res = await api.delete(`/menus/${id}`);
  return res.data;
};