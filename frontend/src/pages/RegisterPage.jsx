import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', name: '', company: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form className="bg-white p-8 rounded shadow w-80" onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-4">Register</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <input className="border p-2 w-full mb-2" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input className="border p-2 w-full mb-2" name="company" placeholder="Company Name" value={form.company} onChange={handleChange} required />
        <input className="border p-2 w-full mb-2" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input className="border p-2 w-full mb-4" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button className="bg-blue-600 text-white w-full py-2 rounded" type="submit">Register</button>
      </form>
    </div>
  );
}