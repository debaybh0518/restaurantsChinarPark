import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';
import BranchesOnboardingPage from './BranchesOnboardingPage';

// Remove SideNav from Dashboard page, only show main content
export default function Dashboard() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [showBranchOnboarding, setShowBranchOnboarding] = useState(false);
  const [branchCheckDone, setBranchCheckDone] = useState(false);
  const [branchesReady, setBranchesReady] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  const [branches, setBranches] = useState([]);
  const [numBranches, setNumBranches] = useState(1);
  const [company, setCompany] = useState(null);
  const [branch, setBranch] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.company_id && !branchCheckDone) {
      api.get(`/companies/${user.company_id}/branches`).then(res => {
        const { branches, num_branches } = res.data;
        setBranches(branches);
        setNumBranches(num_branches || 1);
        if (Array.isArray(branches) && branches.length < (num_branches || 1)) {
          setShowBranchOnboarding(true);
          setBranchesReady(false);
          setCanSkip(true);
        } else {
          setShowBranchOnboarding(false);
          setBranchesReady(true);
        }
        setBranchCheckDone(true);
      }).catch(() => {
        setShowBranchOnboarding(false);
        setBranchesReady(true);
        setBranchCheckDone(true);
      });
    } else if (user && user.role !== 'super_admin') {
      setBranchesReady(true);
    }
  }, [user, branchCheckDone]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

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

  // Ensure user.role is available (fallback to user.Role?.name if needed)
  const userRole = user.role || user.Role?.name || '';

  if (!user) return null;
  if (showBranchOnboarding && user.role === 'super_admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-sky-50">
        <BranchesOnboardingPage
          maxBranches={numBranches - branches.length}
          onClose={() => {
            setShowBranchOnboarding(false);
            setBranchesReady(true);
          }}
        />
        {canSkip && (
          <button
            className="mt-4 px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 font-semibold"
            onClick={() => {
              setShowBranchOnboarding(false);
              setBranchesReady(true);
            }}
          >
            Skip for now
          </button>
        )}
      </div>
    );
  }
  if (!branchesReady) {
    return <div className="flex items-center justify-center h-screen bg-sky-50"><span className="text-sky-700 text-lg font-semibold">Loading...</span></div>;
  }
  return (
    <div className="flex-1 overflow-y-auto p-8 min-h-screen">
      {/* Dashboard analytics and charts go here */}
      <div className="rounded-xl shadow-xl p-8 mb-8 bg-gradient-to-br from-sky-50 via-white to-sky-200 dark:from-slate-800 dark:via-slate-900 dark:to-slate-700 border border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold mb-4 text-sky-700 dark:text-sky-300">Dashboard Analytics</h2>
        {/* Example: Replace with your analytics components/charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <div className="rounded-lg shadow-lg p-6 bg-white dark:bg-slate-800">
            <h3 className="text-lg font-semibold mb-2 text-sky-700 dark:text-sky-300">Sales Overview</h3>
            <div className="h-32 flex items-center justify-center text-slate-400">[Bar Chart]</div>
          </div>
          <div className="rounded-lg shadow-lg p-6 bg-white dark:bg-slate-800">
            <h3 className="text-lg font-semibold mb-2 text-sky-700 dark:text-sky-300">Orders</h3>
            <div className="h-32 flex items-center justify-center text-slate-400">[Line Chart]</div>
          </div>
          <div className="rounded-lg shadow-lg p-6 bg-white dark:bg-slate-800">
            <h3 className="text-lg font-semibold mb-2 text-sky-700 dark:text-sky-300">Revenue</h3>
            <div className="h-32 flex items-center justify-center text-slate-400">[Pie Chart]</div>
          </div>
        </div>
      </div>
    </div>
  );
}