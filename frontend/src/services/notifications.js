import api from './api';

export const getNotifications = async () => {
  const res = await api.get('/notifications');
  return res.data;
};

export const createNotification = async (data) => {
  const res = await api.post('/notifications/email', data); // or /notifications/sms
  return res.data;
};

export const deleteNotification = async (id) => {
  const res = await api.delete(`/notifications/${id}`);
  return res.data;
};