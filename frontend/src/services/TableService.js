import api from '../services/api';

const TableService = {
  getAll: () => api.get('/tables'),
  create: (data) => api.post('/tables', data),
  update: (id, data) => api.put(`/tables/${id}`, data),
  remove: (id) => api.delete(`/tables/${id}`),
  assign: (partySize) => api.post('/tables/assign', { partySize }),
  updateStatus: (id, status) => api.patch(`/tables/${id}/status`, { status }),
};

export default TableService;