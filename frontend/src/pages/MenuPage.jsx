import { useEffect, useState } from 'react';
import * as menusApi from '../services/menus';

export default function MenuPage() {
  const [menus, setMenus] = useState([]);
  const [form, setForm] = useState({ name: '', category: '', branch_id: '' });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMenus = async () => {
    setLoading(true);
    setMenus(await menusApi.getMenus());
    setLoading(false);
  };

  useEffect(() => { fetchMenus(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (editing) {
      await menusApi.updateMenu(editing.menu_id, form);
    } else {
      await menusApi.createMenu(form);
    }
    setForm({ name: '', category: '', branch_id: '' });
    setEditing(null);
    fetchMenus();
  };

  const handleEdit = menu => {
    setEditing(menu);
    setForm({ name: menu.name, category: menu.category, branch_id: menu.branch_id });
  };

  const handleDelete = async id => {
    if (window.confirm('Delete this menu?')) {
      await menusApi.deleteMenu(id);
      fetchMenus();
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-xl mb-4">Menus</h2>
      <form className="mb-6 flex gap-2" onSubmit={handleSubmit}>
        <input className="border p-2 flex-1" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input className="border p-2 flex-1" name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <input className="border p-2 flex-1" name="branch_id" placeholder="Branch ID" value={form.branch_id} onChange={handleChange} required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">{editing ? 'Update' : 'Add'}</button>
        {editing && <button className="ml-2 px-2" onClick={() => { setEditing(null); setForm({ name: '', category: '', branch_id: '' }); }} type="button">Cancel</button>}
      </form>
      {loading ? <div>Loading...</div> : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Branch ID</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {menus.map(m => (
              <tr key={m.menu_id}>
                <td className="p-2 border">{m.menu_id}</td>
                <td className="p-2 border">{m.name}</td>
                <td className="p-2 border">{m.category}</td>
                <td className="p-2 border">{m.branch_id}</td>
                <td className="p-2 border">
                  <button className="text-blue-600 mr-2" onClick={() => handleEdit(m)}>Edit</button>
                  <button className="text-red-600" onClick={() => handleDelete(m.menu_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}