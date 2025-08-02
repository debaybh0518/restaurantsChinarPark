import { useEffect, useState } from 'react';
import * as kotsApi from '../services/kots';

// Placeholder for KOTPage
export default function KOTPage() {
  const [kots, setKOTs] = useState([]);
  const [form, setForm] = useState({ order_id: '', status: '' });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchKOTs = async () => {
    setLoading(true);
    setKOTs(await kotsApi.getKOTs());
    setLoading(false);
  };

  useEffect(() => { fetchKOTs(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (editing) {
      await kotsApi.updateKOT(editing.kot_id, form);
    } else {
      await kotsApi.createKOT(form);
    }
    setForm({ order_id: '', status: '' });
    setEditing(null);
    fetchKOTs();
  };

  const handleEdit = kot => {
    setEditing(kot);
    setForm({ order_id: kot.order_id, status: kot.status });
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-xl mb-4">Kitchen Order Tickets (KOT)</h2>
      <form className="mb-6 flex gap-2" onSubmit={handleSubmit}>
        <input className="border p-2 flex-1" name="order_id" placeholder="Order ID" value={form.order_id} onChange={handleChange} required />
        <input className="border p-2 flex-1" name="status" placeholder="Status" value={form.status} onChange={handleChange} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">{editing ? 'Update' : 'Add'}</button>
        {editing && <button className="ml-2 px-2" onClick={() => { setEditing(null); setForm({ order_id: '', status: '' }); }} type="button">Cancel</button>}
      </form>
      {loading ? <div>Loading...</div> : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">KOT ID</th>
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {kots.map(k => (
              <tr key={k.kot_id}>
                <td className="p-2 border">{k.kot_id}</td>
                <td className="p-2 border">{k.order_id}</td>
                <td className="p-2 border">{k.status}</td>
                <td className="p-2 border">
                  <button className="text-blue-600 mr-2" onClick={() => handleEdit(k)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}