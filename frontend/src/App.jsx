import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import MenuPage from './pages/MenuPage';
import KOTPage from './pages/KOTPage';
import InventoryPage from './pages/InventoryPage';
import PaymentsPage from './pages/PaymentsPage';
import TablesPage from './pages/TablesPage';
import ReportsPage from './pages/ReportsPage';
import CompaniesPage from './pages/CompaniesPage';
import BranchesPage from './pages/BranchesPage';
import UsersPage from './pages/UsersPage';
import ReservationsPage from './pages/ReservationsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import BranchesOnboardingPage from './pages/BranchesOnboardingPage';
import SideNav from './components/SideNav';
import { useState, useEffect } from 'react';
import { ThemeContext } from './contexts/ThemeContext';
import Home from './pages/Home';
import TableManagement from './pages/TableManagement';
import TableLayout from './pages/TableLayout';
import MenuAdmin from './pages/MenuAdmin';
import KOTAdmin from './pages/KOTAdmin';

function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex h-screen min-h-screen">
      <SideNav collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 overflow-y-auto p-8 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  useEffect(() => {
    document.documentElement.className = theme === 'dark' ? 'dark' : '';
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={
          <ProtectedRoute allowedRoles={["super_admin","branch_admin","cashier","store_manager","user","chef"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/branches" element={<BranchesPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/kot" element={<KOTPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/tables" element={<TableLayout />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/menu-admin" element={<MenuAdmin />} />
          <Route path="/kots-admin" element={<KOTAdmin />} />
        </Route>
        <Route path="/branches-setup" element={
          <ProtectedRoute allowedRoles={["super_admin"]}>
            <BranchesOnboardingPage />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </ThemeContext.Provider>
  );
}

export default function WrappedApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}