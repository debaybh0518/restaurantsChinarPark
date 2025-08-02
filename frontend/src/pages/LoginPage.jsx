import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api'; // Adjust the import based on your project structure

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      // Check branches after login
      console.log('User after login:', user);
      if (user && user.company_id) {
        try {
          const res = await api.get(`/companies/${user.company_id}/branches`);
          console.log('Response data', res.data);
          const { num_branches, branches } = res.data;
          // Debug: log values
          console.log('num_branches:', num_branches, 'branches:', branches);
          if (Array.isArray(branches) && typeof num_branches === 'number' && branches.length < num_branches) {
            navigate('/branches-setup');
            return;
          }
        } catch (err) {
          // If error, fallback to dashboard
          console.error('Error fetching branches:', err);
        }
      }
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form className="bg-white p-8 rounded shadow w-80" onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-4">Login</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <input className="border p-2 w-full mb-2" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="border p-2 w-full mb-4" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="bg-blue-600 text-white w-full py-2 rounded" type="submit">Login</button>
      </form>
    </div>
  );
}