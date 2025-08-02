import { useEffect, useState } from 'react';
import * as branchesApi from '../services/branches';

export default function BranchesPage() {
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({ name: '', company_id: '' });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBranches = async () => {
    setLoading(true);
    setBranches(await branchesApi.getBranches());
    setLoading(false);
  };

  useEffect(() => { fetchBranches(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (editing) {
      await branchesApi.updateBranch(editing.branch_id, form);
    } else {
      await branchesApi.createBranch(form);
    }
    setForm({ name: '', company_id: '' });
    setEditing(null);
    fetchBranches();
  };

  const handleEdit = branch => {
    setEditing(branch);
    setForm({ name: branch.name, company_id: branch.company_id });
  };

  const handleDelete = async id => {
    if (window.confirm('Delete this branch?')) {
      await branchesApi.deleteBranch(id);
      fetchBranches();
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-xl mb-4">Branches</h2>
      <form className="mb-6 flex gap-2" onSubmit={handleSubmit}>
        <input className="border p-2 flex-1" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input className="border p-2 flex-1" name="company_id" placeholder="Company ID" value={form.company_id} onChange={handleChange} required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">{editing ? 'Update' : 'Add'}</button>
        {editing && <button className="ml-2 px-2" onClick={() => { setEditing(null); setForm({ name: '', company_id: '' }); }} type="button">Cancel</button>}
      </form>
      {loading ? <div>Loading...</div> : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Company ID</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {branches.map(b => (
              <tr key={b.branch_id}>
                <td className="p-2 border">{b.branch_id}</td>
                <td className="p-2 border">{b.name}</td>
                <td className="p-2 border">{b.company_id}</td>
                <td className="p-2 border">
                  <button className="text-blue-600 mr-2" onClick={() => handleEdit(b)}>Edit</button>
                  <button className="text-red-600" onClick={() => handleDelete(b.branch_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}