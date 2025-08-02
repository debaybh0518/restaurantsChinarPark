import { useEffect, useState } from 'react';
import * as ordersApi from '../services/orders';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ branch_id: '', user_id: '', table_id: '', status: '', type: '', total: '' });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    setOrders(await ordersApi.getOrders());
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (editing) {
      await ordersApi.updateOrder(editing.order_id, form);
    } else {
      await ordersApi.createOrder(form);
    }
    setForm({ branch_id: '', user_id: '', table_id: '', status: '', type: '', total: '' });
    setEditing(null);
    fetchOrders();
  };

  const handleEdit = order => {
    setEditing(order);
    setForm({ branch_id: order.branch_id, user_id: order.user_id, table_id: order.table_id, status: order.status, type: order.type, total: order.total });
  };

  const handleDelete = async id => {
    if (window.confirm('Delete this order?')) {
      await ordersApi.deleteOrder(id);
      fetchOrders();
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-xl mb-4">Orders</h2>
      <form className="mb-6 flex flex-wrap gap-2" onSubmit={handleSubmit}>
        <input className="border p-2 flex-1" name="branch_id" placeholder="Branch ID" value={form.branch_id} onChange={handleChange} required />
        <input className="border p-2 flex-1" name="user_id" placeholder="User ID" value={form.user_id} onChange={handleChange} />
        <input className="border p-2 flex-1" name="table_id" placeholder="Table ID" value={form.table_id} onChange={handleChange} />
        <input className="border p-2 flex-1" name="status" placeholder="Status" value={form.status} onChange={handleChange} />
        <input className="border p-2 flex-1" name="type" placeholder="Type" value={form.type} onChange={handleChange} />
        <input className="border p-2 flex-1" name="total" placeholder="Total" value={form.total} onChange={handleChange} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">{editing ? 'Update' : 'Add'}</button>
        {editing && <button className="ml-2 px-2" onClick={() => { setEditing(null); setForm({ branch_id: '', user_id: '', table_id: '', status: '', type: '', total: '' }); }} type="button">Cancel</button>}
      </form>
      {loading ? <div>Loading...</div> : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Branch ID</th>
              <th className="p-2 border">User ID</th>
              <th className="p-2 border">Table ID</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.order_id}>
                <td className="p-2 border">{o.order_id}</td>
                <td className="p-2 border">{o.branch_id}</td>
                <td className="p-2 border">{o.user_id}</td>
                <td className="p-2 border">{o.table_id}</td>
                <td className="p-2 border">{o.status}</td>
                <td className="p-2 border">{o.type}</td>
                <td className="p-2 border">{o.total}</td>
                <td className="p-2 border">
                  <button className="text-blue-600 mr-2" onClick={() => handleEdit(o)}>Edit</button>
                  <button className="text-red-600" onClick={() => handleDelete(o.order_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}