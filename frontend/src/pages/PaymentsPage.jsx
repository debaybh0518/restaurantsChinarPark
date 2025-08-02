import { useEffect, useState } from 'react';
import * as paymentsApi from '../services/payments';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({ order_id: '', method: '', amount: '' });
  const [loading, setLoading] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    setPayments(await paymentsApi.getPayments());
    setLoading(false);
  };

  useEffect(() => { fetchPayments(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleInitiate = async e => {
    e.preventDefault();
    await paymentsApi.initiatePayment(form);
    setForm({ order_id: '', method: '', amount: '' });
    fetchPayments();
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-xl mb-4">Payments</h2>
      <form className="mb-6 flex gap-2" onSubmit={handleInitiate}>
        <input className="border p-2 flex-1" name="order_id" placeholder="Order ID" value={form.order_id} onChange={handleChange} required />
        <input className="border p-2 flex-1" name="method" placeholder="Method" value={form.method} onChange={handleChange} required />
        <input className="border p-2 flex-1" name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Initiate Payment</button>
      </form>
      {loading ? <div>Loading...</div> : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Method</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">BillDesk Txn</th>
              <th className="p-2 border">Created</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.payment_id}>
                <td className="p-2 border">{p.payment_id}</td>
                <td className="p-2 border">{p.order_id}</td>
                <td className="p-2 border">{p.status}</td>
                <td className="p-2 border">{p.method}</td>
                <td className="p-2 border">{p.amount}</td>
                <td className="p-2 border">{p.billdesk_txn_id}</td>
                <td className="p-2 border">{p.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}