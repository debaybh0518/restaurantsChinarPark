import api from '../services/api';
import { useEffect, useState } from 'react';

const STATUS_COLORS = {
  Pending: 'bg-yellow-200',
  'In Progress': 'bg-blue-200',
  Ready: 'bg-green-200',
  Completed: 'bg-gray-200',
};

export default function KOTAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Poll every 5s for live updates
    return () => clearInterval(interval);
  }, []);

  function fetchOrders() {
    setLoading(true);
    api.get('/kots').then(res => {
      setOrders(res.data);
      setLoading(false);
    });
  }

  function updateStatus(id, status) {
    api.patch(`/kots/${id}/status`, { status }).then(fetchOrders);
  }

  function handleDelete(id) {
    api.delete(`/kots/${id}`).then(fetchOrders);
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Kitchen Order Tracking (KOT)</h1>
      {loading ? <div>Loading...</div> : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">Menu Items</th>
              <th className="p-2 border">Total Price</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Created</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className={STATUS_COLORS[order.status] || ''}>
                <td className="p-2 border">{order.id}</td>
                <td className="p-2 border">
                  <ul>
                    {order.MenuItems.map(mi => (
                      <li key={mi.id}>{mi.name} x {mi.OrderMenuItem.quantity}</li>
                    ))}
                  </ul>
                </td>
                <td className="p-2 border">{order.total_price.toFixed(2)}</td>
                <td className="p-2 border">
                  <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)}>
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Ready</option>
                    <option>Completed</option>
                  </select>
                </td>
                <td className="p-2 border">{new Date(order.created_at).toLocaleString()}</td>
                <td className="p-2 border">
                  <button onClick={() => handleDelete(order.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}