import api from './api';

export const getReservations = async () => {
  const res = await api.get('/reservations');
  return res.data;
};

export const createReservation = async (data) => {
  const res = await api.post('/reservations', data);
  return res.data;
};

export const updateReservation = async (id, data) => {
  const res = await api.put(`/reservations/${id}`, data);
  return res.data;
};

export const deleteReservation = async (id) => {
  const res = await api.delete(`/reservations/${id}`);
  return res.data;
};