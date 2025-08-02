import { useEffect, useState } from 'react';
import * as inventoryApi from '../services/inventory';

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [form, setForm] = useState({ name: '', quantity: '', unit: '', branch_id: '', low_stock_threshold: '' });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchInventory = async () => {
    setLoading(true);
    setInventory(await inventoryApi.getInventory());
    setLoading(false);
  };

  useEffect(() => { fetchInventory(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (editing) {
      await inventoryApi.updateInventory(editing.inventory_id, form);
    } else {
      await inventoryApi.createInventory(form);
    }
    setForm({ name: '', quantity: '', unit: '', branch_id: '', low_stock_threshold: '' });
    setEditing(null);
    fetchInventory();
  };

  const handleEdit = item => {
    setEditing(item);
    setForm({ name: item.name, quantity: item.quantity, unit: item.unit, branch_id: item.branch_id, low_stock_threshold: item.low_stock_threshold });
  };

  const handleDelete = async id => {
    if (window.confirm('Delete this inventory item?')) {
      await inventoryApi.deleteInventory(id);
      fetchInventory();
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-xl mb-4">Inventory</h2>
      <form className="mb-6 flex flex-wrap gap-2" onSubmit={handleSubmit}>
        <input className="border p-2 flex-1" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input className="border p-2 flex-1" name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange} required />
        <input className="border p-2 flex-1" name="unit" placeholder="Unit" value={form.unit} onChange={handleChange} />
        <input className="border p-2 flex-1" name="branch_id" placeholder="Branch ID" value={form.branch_id} onChange={handleChange} required />
        <input className="border p-2 flex-1" name="low_stock_threshold" placeholder="Low Stock Threshold" value={form.low_stock_threshold} onChange={handleChange} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">{editing ? 'Update' : 'Add'}</button>
        {editing && <button className="ml-2 px-2" onClick={() => { setEditing(null); setForm({ name: '', quantity: '', unit: '', branch_id: '', low_stock_threshold: '' }); }} type="button">Cancel</button>}
      </form>
      {loading ? <div>Loading...</div> : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Unit</th>
              <th className="p-2 border">Branch ID</th>
              <th className="p-2 border">Low Stock</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(i => (
              <tr key={i.inventory_id}>
                <td className="p-2 border">{i.inventory_id}</td>
                <td className="p-2 border">{i.name}</td>
                <td className="p-2 border">{i.quantity}</td>
                <td className="p-2 border">{i.unit}</td>
                <td className="p-2 border">{i.branch_id}</td>
                <td className="p-2 border">{i.low_stock_threshold}</td>
                <td className="p-2 border">
                  <button className="text-blue-600 mr-2" onClick={() => handleEdit(i)}>Edit</button>
                  <button className="text-red-600" onClick={() => handleDelete(i.inventory_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}