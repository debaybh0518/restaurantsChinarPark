import { useEffect, useState } from 'react';
import * as reservationsApi from '../services/reservations';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [form, setForm] = useState({ customer_name: '', customer_phone: '', table_id: '', branch_id: '', status: '', reserved_at: '' });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReservations = async () => {
    setLoading(true);
    setReservations(await reservationsApi.getReservations());
    setLoading(false);
  };

  useEffect(() => { fetchReservations(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (editing) {
      await reservationsApi.updateReservation(editing.reservation_id, form);
    } else {
      await reservationsApi.createReservation(form);
    }
    setForm({ customer_name: '', customer_phone: '', table_id: '', branch_id: '', status: '', reserved_at: '' });
    setEditing(null);
    fetchReservations();
  };

  const handleEdit = reservation => {
    setEditing(reservation);
    setForm({ customer_name: reservation.customer_name, customer_phone: reservation.customer_phone, table_id: reservation.table_id, branch_id: reservation.branch_id, status: reservation.status, reserved_at: reservation.reserved_at });
  };

  const handleDelete = async id => {
    if (window.confirm('Delete this reservation?')) {
      await reservationsApi.deleteReservation(id);
      fetchReservations();
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-xl mb-4">Reservations</h2>
      <form className="mb-6 flex flex-wrap gap-2" onSubmit={handleSubmit}>
        <input className="border p-2 flex-1" name="customer_name" placeholder="Customer Name" value={form.customer_name} onChange={handleChange} required />
        <input className="border p-2 flex-1" name="customer_phone" placeholder="Customer Phone" value={form.customer_phone} onChange={handleChange} required />
        <input className="border p-2 flex-1" name="table_id" placeholder="Table ID" value={form.table_id} onChange={handleChange} required />
        <input className="border p-2 flex-1" name="branch_id" placeholder="Branch ID" value={form.branch_id} onChange={handleChange} required />
        <input className="border p-2 flex-1" name="status" placeholder="Status" value={form.status} onChange={handleChange} />
        <input className="border p-2 flex-1" name="reserved_at" placeholder="Reserved At (YYYY-MM-DD HH:mm)" value={form.reserved_at} onChange={handleChange} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">{editing ? 'Update' : 'Add'}</button>
        {editing && <button className="ml-2 px-2" onClick={() => { setEditing(null); setForm({ customer_name: '', customer_phone: '', table_id: '', branch_id: '', status: '', reserved_at: '' }); }} type="button">Cancel</button>}
      </form>
      {loading ? <div>Loading...</div> : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Customer</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Table ID</th>
              <th className="p-2 border">Branch ID</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Reserved At</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(r => (
              <tr key={r.reservation_id}>
                <td className="p-2 border">{r.reservation_id}</td>
                <td className="p-2 border">{r.customer_name}</td>
                <td className="p-2 border">{r.customer_phone}</td>
                <td className="p-2 border">{r.table_id}</td>
                <td className="p-2 border">{r.branch_id}</td>
                <td className="p-2 border">{r.status}</td>
                <td className="p-2 border">{r.reserved_at}</td>
                <td className="p-2 border">
                  <button className="text-blue-600 mr-2" onClick={() => handleEdit(r)}>Edit</button>
                  <button className="text-red-600" onClick={() => handleDelete(r.reservation_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}