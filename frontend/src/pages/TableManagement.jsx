import { useEffect, useState } from 'react';
import TableService from '../services/TableService';

export default function TableManagement() {
  const [tables, setTables] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', capacity: '', status: 'Available', layout_x: 0, layout_y: 0 });
  const [partySize, setPartySize] = useState('');
  const [assignedTable, setAssignedTable] = useState(null);

  useEffect(() => {
    TableService.getAll().then(res => setTables(res.data));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (editing) {
      TableService.update(editing, form).then(() => window.location.reload());
    } else {
      TableService.create(form).then(() => window.location.reload());
    }
  };

  const handleEdit = t => {
    setEditing(t.id);
    setForm({ name: t.name, capacity: t.capacity, status: t.status, layout_x: t.layout_x, layout_y: t.layout_y });
  };

  const handleDelete = id => {
    TableService.remove(id).then(() => window.location.reload());
  };

  const handleAssign = e => {
    e.preventDefault();
    TableService.assign(Number(partySize)).then(res => setAssignedTable(res.data)).catch(() => setAssignedTable(null));
  };

  const handleStatus = (id, status) => {
    TableService.updateStatus(id, status).then(() => window.location.reload());
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Table Management</h1>
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2 flex-wrap">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Table Name" className="border p-2" required />
        <input name="capacity" value={form.capacity} onChange={handleChange} placeholder="Capacity" type="number" className="border p-2" required />
        <select name="status" value={form.status} onChange={handleChange} className="border p-2">
          <option>Available</option>
          <option>Reserved</option>
          <option>Occupied</option>
          <option>Cleaning</option>
        </select>
        <input name="layout_x" value={form.layout_x} onChange={handleChange} placeholder="Layout X" type="number" className="border p-2" />
        <input name="layout_y" value={form.layout_y} onChange={handleChange} placeholder="Layout Y" type="number" className="border p-2" />
        <button type="submit" className="bg-sky-600 text-white px-4 py-2 rounded">{editing ? 'Update' : 'Add'} Table</button>
        {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '', capacity: '', status: 'Available', layout_x: 0, layout_y: 0 }); }} className="ml-2 text-red-500">Cancel</button>}
      </form>
      <form onSubmit={handleAssign} className="mb-4 flex gap-2">
        <input value={partySize} onChange={e => setPartySize(e.target.value)} placeholder="Party Size" type="number" className="border p-2" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Assign Table</button>
        {assignedTable && <span className="ml-4">Assigned: {assignedTable.name} (Capacity: {assignedTable.capacity})</span>}
      </form>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Capacity</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Layout</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tables.map(t => (
              <tr key={t.id} className={
                t.status === 'Available' ? 'bg-green-50' :
                t.status === 'Reserved' ? 'bg-yellow-50' :
                t.status === 'Occupied' ? 'bg-red-50' :
                t.status === 'Cleaning' ? 'bg-blue-50' : ''
              }>
                <td className="p-2 border font-semibold">{t.name}</td>
                <td className="p-2 border">{t.capacity}</td>
                <td className="p-2 border">
                  <span className={`px-2 py-1 rounded text-xs font-bold
                    ${t.status === 'Available' ? 'bg-green-200 text-green-900' :
                      t.status === 'Reserved' ? 'bg-yellow-200 text-yellow-900' :
                      t.status === 'Occupied' ? 'bg-red-200 text-red-900' :
                      t.status === 'Cleaning' ? 'bg-blue-200 text-blue-900' : ''}`}>{t.status}</span>
                  <select value={t.status} onChange={e => handleStatus(t.id, e.target.value)} className="ml-2 border p-1 text-xs">
                    <option>Available</option>
                    <option>Reserved</option>
                    <option>Occupied</option>
                    <option>Cleaning</option>
                  </select>
                </td>
                <td className="p-2 border">({t.layout_x}, {t.layout_y})</td>
                <td className="p-2 border">
                  <button onClick={() => handleEdit(t)} className="text-blue-600 mr-2">Edit</button>
                  <button onClick={() => handleDelete(t.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}