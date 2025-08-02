import { useEffect, useState } from 'react';
import * as tablesApi from '../services/tables';

export default function TablesPage() {
  const [tables, setTables] = useState([]);
  const [form, setForm] = useState({ name: '', status: '', branch_id: '' });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTables = async () => {
    setLoading(true);
    setTables(await tablesApi.getTables());
    setLoading(false);
  };

  useEffect(() => { fetchTables(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (editing) {
      await tablesApi.updateTable(editing.table_id, form);
    } else {
      await tablesApi.createTable(form);
    }
    setForm({ name: '', status: '', branch_id: '' });
    setEditing(null);
    fetchTables();
  };

  const handleEdit = table => {
    setEditing(table);
    setForm({ name: table.name, status: table.status, branch_id: table.branch_id });
  };

  const handleDelete = async id => {
    if (window.confirm('Delete this table?')) {
      await tablesApi.deleteTable(id);
      fetchTables();
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-xl mb-4">Tables</h2>
      <form className="mb-6 flex gap-2" onSubmit={handleSubmit}>
        <input className="border p-2 flex-1" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input className="border p-2 flex-1" name="status" placeholder="Status" value={form.status} onChange={handleChange} />
        <input className="border p-2 flex-1" name="branch_id" placeholder="Branch ID" value={form.branch_id} onChange={handleChange} required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">{editing ? 'Update' : 'Add'}</button>
        {editing && <button className="ml-2 px-2" onClick={() => { setEditing(null); setForm({ name: '', status: '', branch_id: '' }); }} type="button">Cancel</button>}
      </form>
      {loading ? <div>Loading...</div> : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Branch ID</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tables.map(t => (
              <tr key={t.table_id}>
                <td className="p-2 border">{t.table_id}</td>
                <td className="p-2 border">{t.name}</td>
                <td className="p-2 border">{t.status}</td>
                <td className="p-2 border">{t.branch_id}</td>
                <td className="p-2 border">
                  <button className="text-blue-600 mr-2" onClick={() => handleEdit(t)}>Edit</button>
                  <button className="text-red-600" onClick={() => handleDelete(t.table_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}