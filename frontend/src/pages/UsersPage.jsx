import { useEffect, useState } from 'react';
import * as usersApi from '../services/users';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', role_id: '', company_id: '', branch_id: '' });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setUsers(await usersApi.getUsers());
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (editing) {
      await usersApi.updateUser(editing.user_id, form);
    } else {
      await usersApi.createUser(form);
    }
    setForm({ name: '', email: '', role_id: '', company_id: '', branch_id: '' });
    setEditing(null);
    fetchUsers();
  };

  const handleEdit = user => {
    setEditing(user);
    setForm({ name: user.name, email: user.email, role_id: user.role_id, company_id: user.company_id, branch_id: user.branch_id });
  };

  const handleDelete = async id => {
    if (window.confirm('Delete this user?')) {
      await usersApi.deleteUser(id);
      fetchUsers();
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-xl mb-4">Users</h2>
      <form className="mb-6 flex flex-wrap gap-2" onSubmit={handleSubmit}>
        <input className="border p-2 flex-1" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input className="border p-2 flex-1" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input className="border p-2 flex-1" name="role_id" placeholder="Role ID" value={form.role_id} onChange={handleChange} required />
        <input className="border p-2 flex-1" name="company_id" placeholder="Company ID" value={form.company_id} onChange={handleChange} required />
        <input className="border p-2 flex-1" name="branch_id" placeholder="Branch ID" value={form.branch_id} onChange={handleChange} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">{editing ? 'Update' : 'Add'}</button>
        {editing && <button className="ml-2 px-2" onClick={() => { setEditing(null); setForm({ name: '', email: '', role_id: '', company_id: '', branch_id: '' }); }} type="button">Cancel</button>}
      </form>
      {loading ? <div>Loading...</div> : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role ID</th>
              <th className="p-2 border">Company ID</th>
              <th className="p-2 border">Branch ID</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.user_id}>
                <td className="p-2 border">{u.user_id}</td>
                <td className="p-2 border">{u.name}</td>
                <td className="p-2 border">{u.email}</td>
                <td className="p-2 border">{u.role_id}</td>
                <td className="p-2 border">{u.company_id}</td>
                <td className="p-2 border">{u.branch_id}</td>
                <td className="p-2 border">
                  <button className="text-blue-600 mr-2" onClick={() => handleEdit(u)}>Edit</button>
                  <button className="text-red-600" onClick={() => handleDelete(u.user_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}