import { useEffect, useState } from 'react';
import * as notificationsApi from '../services/notifications';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [form, setForm] = useState({ user_id: '', type: 'email', message: '' });
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    setNotifications(await notificationsApi.getNotifications());
    setLoading(false);
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    await notificationsApi.createNotification(form);
    setForm({ user_id: '', type: 'email', message: '' });
    fetchNotifications();
  };

  const handleDelete = async id => {
    if (window.confirm('Delete this notification?')) {
      await notificationsApi.deleteNotification(id);
      fetchNotifications();
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-xl mb-4">Notifications</h2>
      <form className="mb-6 flex gap-2" onSubmit={handleSubmit}>
        <input className="border p-2 flex-1" name="user_id" placeholder="User ID" value={form.user_id} onChange={handleChange} />
        <select className="border p-2 flex-1" name="type" value={form.type} onChange={handleChange}>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
        </select>
        <input className="border p-2 flex-1" name="message" placeholder="Message" value={form.message} onChange={handleChange} required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Send</button>
      </form>
      {loading ? <div>Loading...</div> : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">User ID</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Message</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Sent At</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map(n => (
              <tr key={n.notification_id}>
                <td className="p-2 border">{n.notification_id}</td>
                <td className="p-2 border">{n.user_id}</td>
                <td className="p-2 border">{n.type}</td>
                <td className="p-2 border">{n.message}</td>
                <td className="p-2 border">{n.status}</td>
                <td className="p-2 border">{n.sent_at}</td>
                <td className="p-2 border">
                  <button className="text-red-600" onClick={() => handleDelete(n.notification_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}