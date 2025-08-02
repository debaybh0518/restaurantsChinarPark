import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { useEffect, useState } from 'react';

const getUserRole = (user) => user?.role || user?.Role?.name || '';

export default function Home() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const userRole = getUserRole(user);
  const [company, setCompany] = useState(null);
  const [branch, setBranch] = useState(null);

  useEffect(() => {
    if (user?.company_id) {
      api.get(`/companies/${user.company_id}`)
        .then(res => setCompany(res.data))
        .catch(() => setCompany(null));
    }
    if (user?.branch_id) {
      api.get(`/branches?company_id=${user.company_id}`)
        .then(res => {
          const found = res.data.find(b => b.branch_id === user.branch_id);
          setBranch(found);
        })
        .catch(() => setBranch(null));
    }
  }, [user]);

  return (
    <div className={`flex-1 overflow-y-auto p-8 min-h-screen`}> 
      <div className="flex justify-end mb-4">
        <label className="flex items-center gap-2 cursor-pointer text-base font-medium">
          <input type="radio" name="theme" value="light" checked={theme === 'light'} onChange={() => setTheme('light')} /> Light
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-base font-medium ml-4">
          <input type="radio" name="theme" value="dark" checked={theme === 'dark'} onChange={() => setTheme('dark')} /> Dark
        </label>
      </div>
      <div className="rounded-xl shadow-xl p-8 mb-8 bg-gradient-to-br from-sky-50 via-white to-sky-200 dark:from-slate-800 dark:via-slate-900 dark:to-slate-700 border border-slate-200 dark:border-slate-700">
        <h1 className="text-3xl font-bold mb-2 tracking-tight">Welcome, <span className="text-sky-600 dark:text-sky-300">{user.name}</span> {userRole && <span className="text-base font-normal">({userRole})</span>}</h1>
        <div className="text-lg mb-2">{company && <>Company: <b>{company.name}</b> </>} {branch && <>| Branch: <b>{branch.name}</b></>} </div>
        <div className="text-sm text-slate-500 dark:text-slate-300">{user.email}</div>
      </div>
      <div className="rounded-xl shadow-xl p-8 mb-8 bg-gradient-to-br from-sky-50 via-white to-sky-200 dark:from-slate-800 dark:via-slate-900 dark:to-slate-700 border border-slate-200 dark:border-slate-700">
        <h1 className="text-3xl font-bold mb-4 tracking-tight text-sky-700 dark:text-sky-300">Welcome to Rannaghor360!</h1>
        <p className="text-lg mb-4">This platform offers a complete restaurant management solution. Here are the features you can access:</p>
        <ul className="list-disc ml-8 text-base mb-4">
          <li>Company & Branch Management</li>
          <li>User & Role Management</li>
          <li>Menu, KOT, and Table Management</li>
          <li>Inventory & Payments</li>
          <li>Reservations & Notifications</li>
          <li>Comprehensive Reports</li>
        </ul>
        <div className="mb-4">
          <b>How to onboard:</b>
          <ol className="list-decimal ml-8 mt-2 text-base">
            <li>Login as Super Admin and add your company and branches.</li>
            <li>Add users and assign roles to staff.</li>
            <li>Set up your menu, tables, and inventory.</li>
            <li>Start managing orders, payments, and reservations!</li>
          </ol>
        </div>
        <a href="/onboarding-guide.pdf" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 px-6 py-2 bg-sky-600 text-white rounded shadow hover:bg-sky-700 font-semibold">Download Onboarding Guide (PDF)</a>
      </div>
    </div>
  );
}