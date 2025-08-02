import { useEffect, useState } from 'react';
import * as companiesApi from '../services/companies';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({ name: '', contact: '' });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCompanies = async () => {
    setLoading(true);
    setCompanies(await companiesApi.getCompanies());
    setLoading(false);
  };

  useEffect(() => { fetchCompanies(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (editing) {
      await companiesApi.updateCompany(editing.company_id, form);
    } else {
      await companiesApi.createCompany(form);
    }
    setForm({ name: '', contact: '' });
    setEditing(null);
    fetchCompanies();
  };

  const handleEdit = company => {
    setEditing(company);
    setForm({ name: company.name, contact: company.contact });
  };

  const handleDelete = async id => {
    if (window.confirm('Delete this company?')) {
      await companiesApi.deleteCompany(id);
      fetchCompanies();
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-xl mb-4">Companies</h2>
      <form className="mb-6 flex gap-2" onSubmit={handleSubmit}>
        <input className="border p-2 flex-1" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input className="border p-2 flex-1" name="contact" placeholder="Contact" value={form.contact} onChange={handleChange} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">{editing ? 'Update' : 'Add'}</button>
        {editing && <button className="ml-2 px-2" onClick={() => { setEditing(null); setForm({ name: '', contact: '' }); }} type="button">Cancel</button>}
      </form>
      {loading ? <div>Loading...</div> : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Contact</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map(c => (
              <tr key={c.company_id}>
                <td className="p-2 border">{c.company_id}</td>
                <td className="p-2 border">{c.name}</td>
                <td className="p-2 border">{c.contact}</td>
                <td className="p-2 border">
                  <button className="text-blue-600 mr-2" onClick={() => handleEdit(c)}>Edit</button>
                  <button className="text-red-600" onClick={() => handleDelete(c.company_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}