import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/auth';

export default function OnboardingPage({ onClose }) {
  const [form, setForm] = useState({ company: '', companyPhone: '', name: '', email: '', password: '', branches: 1 });
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (!form.company || !form.companyPhone || !form.name || !form.email || !form.password || !form.branches) return 'All fields are required';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return 'Invalid email';
    if (form.password.length < 6) return 'Password must be at least 6 characters';
    if (isNaN(form.branches) || form.branches < 1 || form.branches > 20) return 'Branches must be between 1 and 20';
    if (!/^\+?\d{6,20}$/.test(form.companyPhone)) return 'Invalid company phone number';
    return '';
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);
    setError('');
    setStep(2); // Show super admin onboarding form
  };

  // Super admin onboarding form fields
  const [superForm, setSuperForm] = useState({ phone: '', address: '' });
  const [superError, setSuperError] = useState('');
  const handleSuperChange = e => setSuperForm({ ...superForm, [e.target.name]: e.target.value });
  const handleSuperSubmit = async e => {
    e.preventDefault();
    if (!superForm.phone || !superForm.address) return setSuperError('All fields required');
    setSuperError('');
    setLoading(true);
    try {
      // Backend integration: register company and super admin
      const res = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        company: form.company,
        companyPhone: form.companyPhone,
        phone: superForm.phone,
        address: superForm.address,
        branches: form.branches
      });
      // Save intended branch count in localStorage for post-login use
      localStorage.setItem('intendedBranches', form.branches);
      navigate('/login');
    } catch (err) {
      setSuperError(err?.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-50 font-sans relative">
      {onClose && (
        <button className="absolute top-4 right-4 text-2xl text-slate-400 hover:text-pink-500 z-10" onClick={onClose} aria-label="Close">&times;</button>
      )}
      {step === 1 && (
        <form className="bg-white p-8 rounded shadow w-96 border border-sky-100 relative" onSubmit={handleSubmit}>
          <h2 className="text-2xl mb-4 text-sky-700 font-semibold">Onboarding</h2>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <label className="block mb-1 text-slate-700 font-medium" htmlFor="company">Company Name</label>
          <input className="border p-2 w-full mb-2 rounded text-slate-700 bg-sky-50" id="company" name="company" placeholder="Company Name" value={form.company} onChange={handleChange} required />
          <label className="block mb-1 text-slate-700 font-medium" htmlFor="companyPhone">Company Phone</label>
          <input className="border p-2 w-full mb-2 rounded text-slate-700 bg-sky-50" id="companyPhone" name="companyPhone" placeholder="Company Phone" value={form.companyPhone} onChange={handleChange} required />
          <label className="block mb-1 text-slate-700 font-medium" htmlFor="name">Admin Name</label>
          <input className="border p-2 w-full mb-2 rounded text-slate-700 bg-sky-50" id="name" name="name" placeholder="Admin Name" value={form.name} onChange={handleChange} required />
          <label className="block mb-1 text-slate-700 font-medium" htmlFor="email">Admin Email</label>
          <input className="border p-2 w-full mb-2 rounded text-slate-700 bg-sky-50" id="email" name="email" type="email" placeholder="Admin Email" value={form.email} onChange={handleChange} required />
          <label className="block mb-1 text-slate-700 font-medium" htmlFor="password">Password</label>
          <input className="border p-2 w-full mb-2 rounded text-slate-700 bg-sky-50" id="password" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <label className="block mb-1 text-slate-700 font-medium" htmlFor="branches">Number of Branches</label>
          <input className="border p-2 w-full mb-4 rounded text-slate-700 bg-sky-50" id="branches" name="branches" type="number" min="1" max="20" placeholder="Number of Branches" value={form.branches} onChange={handleChange} required />
          <button className="bg-sky-600 hover:bg-sky-700 text-white w-full py-2 rounded font-semibold transition" type="submit">Continue</button>
        </form>
      )}
      {step === 2 && (
        <form className="bg-white p-8 rounded shadow w-96 border border-sky-100 relative" onSubmit={handleSuperSubmit}>
          <h2 className="text-2xl mb-4 text-sky-700 font-semibold">Super Admin Onboarding</h2>
          {superError && <div className="text-red-500 mb-2">{superError}</div>}
          <label className="block mb-1 text-slate-700 font-medium" htmlFor="phone">Phone</label>
          <input className="border p-2 w-full mb-2 rounded text-slate-700 bg-sky-50" id="phone" name="phone" placeholder="Phone" value={superForm.phone} onChange={handleSuperChange} required />
          <label className="block mb-1 text-slate-700 font-medium" htmlFor="address">Address</label>
          <input className="border p-2 w-full mb-4 rounded text-slate-700 bg-sky-50" id="address" name="address" placeholder="Address" value={superForm.address} onChange={handleSuperChange} required />
          <button className="bg-sky-600 hover:bg-sky-700 text-white w-full py-2 rounded font-semibold transition" type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Finish Onboarding'}</button>
        </form>
      )}
    </div>
  );
}