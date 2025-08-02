import api from '../services/api';
import { useEffect, useState, useRef } from 'react';

export default function MenuAdmin() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', description: '', category_id: '', image_url: '', is_active: true });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editing, setEditing] = useState(null);
  const [image, setImage] = useState(null);
  const fileInputRef = useRef();
  const [bulkFile, setBulkFile] = useState(null);

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data));
    fetchItems();
  }, [page, search, filter]);

  function fetchItems() {
    api.get(`/menu-items?page=${page}&search=${search}&category=${filter}`).then(res => {
      setItems(res.data.items);
      setTotal(res.data.total);
    });
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleImageChange(e) {
    setImage(e.target.files[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.price || !form.description || !form.category_id || Number(form.price) <= 0) return;
    let image_url = form.image_url;
    if (image) {
      const data = new FormData();
      data.append('image', image);
      const res = await api.post(`/menu-items/${editing || ''}/image`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      image_url = res.data.image_url;
    }
    const req = editing ? api.put(`/menu-items/${editing}`, { ...form, image_url }) : api.post('/menu-items', { ...form, image_url });
    req.then(() => {
      setForm({ name: '', price: '', description: '', category_id: '', image_url: '', is_active: true });
      setEditing(null);
      setImage(null);
      fetchItems();
    });
  }

  function handleEdit(item) {
    setEditing(item.id);
    setForm({ name: item.name, price: item.price, description: item.description, category_id: item.category_id, image_url: item.image_url, is_active: item.is_active });
  }

  function handleDelete(id) {
    api.delete(`/menu-items/${id}`).then(fetchItems);
  }

  function handleBulkChange(e) {
    setBulkFile(e.target.files[0]);
  }

  async function handleBulkUpload(e) {
    e.preventDefault();
    if (!bulkFile) return;
    const data = new FormData();
    data.append('file', bulkFile);
    await api.post('/menu-items/bulk-upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    setBulkFile(null);
    fetchItems();
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Menu Management</h1>
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2 flex-wrap">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="border p-2" required />
        <select name="category_id" value={form.category_id} onChange={handleChange} className="border p-2" required>
          <option value="">Select Category</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" min="0.01" step="0.01" className="border p-2" required />
        <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border p-2" required />
        <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} />
        <button type="submit" className="bg-sky-600 text-white px-4 py-2 rounded">{editing ? 'Update' : 'Add'} Item</button>
        {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '', price: '', description: '', category_id: '', image_url: '', is_active: true }); setImage(null); }} className="ml-2 text-red-500">Cancel</button>}
      </form>
      <form onSubmit={handleBulkUpload} className="mb-4 flex gap-2">
        <input type="file" accept=".csv" onChange={handleBulkChange} />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Bulk Upload CSV</button>
      </form>
      <div className="mb-4 flex gap-2">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name" className="border p-2" />
        <select value={filter} onChange={e => setFilter(e.target.value)} className="border p-2">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Image</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td className="p-2 border">{item.image_url && <img src={item.image_url} alt={item.name} className="w-12 h-12 object-cover" />}</td>
              <td className="p-2 border">{item.name}</td>
              <td className="p-2 border">{categories.find(c => c.id === item.category_id)?.name || ''}</td>
              <td className="p-2 border">{item.price}</td>
              <td className="p-2 border">{item.description}</td>
              <td className="p-2 border">{item.is_active ? 'Active' : 'Inactive'}</td>
              <td className="p-2 border">
                <button onClick={() => handleEdit(item)} className="text-blue-600 mr-2">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex gap-2">
        <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 border rounded">Prev</button>
        <span>Page {page}</span>
        <button disabled={page * 10 >= total} onClick={() => setPage(page + 1)} className="px-3 py-1 border rounded">Next</button>
      </div>
    </div>
  );
}