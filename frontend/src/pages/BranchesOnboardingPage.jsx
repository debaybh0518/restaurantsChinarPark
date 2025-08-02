import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../services/api';

export default function BranchesOnboardingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const maxBranches = location.state?.branches || 1;
  const [branches, setBranches] = useState([{ name: '', address: '' }]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (idx, e) => {
    const updated = [...branches];
    updated[idx][e.target.name] = e.target.value;
    setBranches(updated);
  };

  const addBranch = () => {
    if (branches.length < maxBranches) setBranches([...branches, { name: '', address: '' }]);
  };
  const removeBranch = idx => {
    if (branches.length > 1) setBranches(branches.filter((_, i) => i !== idx));
  };

  const validate = () => {
    if (branches.length < 1 || branches.length > maxBranches) return 'Invalid number of branches';
    for (const b of branches) {
      if (!b.name || !b.address) return 'All branch fields required';
    }
    return '';
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);
    setError('');
    setLoading(true);
    try {
      // Set onboarding flag only during onboarding
      const isOnboarding = location.state?.branches ? true : false;
      const url = isOnboarding ? '/companies/branches/bulk?onboarding=true' : '/companies/branches/bulk';
      await api.post(url, { branches });
      navigate('/login');
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to save branches');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-50 font-sans">
      <form className="bg-white p-8 rounded shadow w-full max-w-lg border border-sky-100" onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-4 text-sky-700 font-semibold">Branch Details</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {branches.map((b, idx) => (
          <div key={idx} className="mb-4 bg-sky-50 p-4 rounded border border-sky-100">
            <div className="flex gap-2 mb-2">
              <input className="border p-2 flex-1 rounded text-slate-700" name="name" placeholder={`Branch Name #${idx+1}`} value={b.name} onChange={e => handleChange(idx, e)} required />
              <input className="border p-2 flex-1 rounded text-slate-700" name="address" placeholder="Address" value={b.address} onChange={e => handleChange(idx, e)} required />
              {branches.length > 1 && <button type="button" className="text-red-500 ml-2" onClick={() => removeBranch(idx)}>&times;</button>}
            </div>
          </div>
        ))}
        <div className="flex gap-2 mb-4">
          <button type="button" className="bg-sky-200 text-sky-700 px-4 py-1 rounded font-semibold" onClick={addBranch} disabled={branches.length >= maxBranches}>Add Branch</button>
          <span className="text-slate-500 text-sm">{branches.length} / {maxBranches}</span>
        </div>
        <button className="bg-sky-600 hover:bg-sky-700 text-white w-full py-2 rounded font-semibold transition" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Finish'}</button>
      </form>
    </div>
  );
}