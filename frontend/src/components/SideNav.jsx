import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, UserGroupIcon, ClipboardDocumentListIcon, BanknotesIcon, TableCellsIcon, ChartBarIcon, Cog6ToothIcon, ArrowLeftOnRectangleIcon, BuildingStorefrontIcon, UsersIcon, BellAlertIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';
import logo from '../../dist/assets/rannaghor360-logo.png'; // Adjust the path as necessary

const navItems = [
	{
		label: 'Home',
		icon: HomeIcon,
		path: '/',
		roles: ['super_admin', 'branch_admin', 'cashier', 'store_manager', 'user', 'chef'],
	},
	{
		label: 'Dashboard',
		icon: ChartBarIcon,
		path: '/dashboard',
		roles: ['super_admin', 'branch_admin', 'cashier', 'store_manager', 'user', 'chef'],
	},
	{
		label: 'Companies',
		icon: BuildingStorefrontIcon,
		path: '/companies',
		roles: ['super_admin'],
	},
	{
		label: 'Branches',
		icon: BuildingStorefrontIcon,
		path: '/branches',
		roles: ['super_admin', 'branch_admin'],
	},
	{
		label: 'Users',
		icon: UsersIcon,
		path: '/users',
		roles: ['super_admin', 'branch_admin'],
	},
	{
		label: 'Menu',
		icon: ClipboardDocumentListIcon,
		path: '/menu',
		roles: ['super_admin', 'branch_admin'],
	},
	{
		label: 'KOT',
		icon: Cog6ToothIcon,
		path: '/kot',
		roles: ['super_admin', 'branch_admin', 'chef'],
	},
	{
		label: 'Inventory',
		icon: BanknotesIcon,
		path: '/inventory',
		roles: ['super_admin', 'store_manager'],
	},
	{
		label: 'Payments',
		icon: BanknotesIcon,
		path: '/payments',
		roles: ['super_admin', 'cashier'],
	},
	{
		label: 'Tables',
		icon: TableCellsIcon,
		path: '/tables',
		roles: ['super_admin', 'branch_admin', 'user'],
	},
	{
		label: 'Reservations',
		icon: TableCellsIcon,
		path: '/reservations',
		roles: ['super_admin', 'branch_admin', 'user'],
	},
	{
		label: 'Notifications',
		icon: BellAlertIcon,
		path: '/notifications',
		roles: ['super_admin', 'branch_admin'],
	},
	{
		label: 'Reports',
		icon: ChartBarIcon,
		path: '/reports',
		roles: ['super_admin', 'branch_admin'],
	},
];

const getUserRole = (user) => user?.role || user?.Role?.name || '';

export default function SideNav({ collapsed, setCollapsed }) {
	const { user, logout } = useAuth();
	const location = useLocation();
	const [company, setCompany] = useState(null);
	const [branch, setBranch] = useState(null);
	const [openSections, setOpenSections] = useState([true, true, true, true]);
	const { theme, setTheme } = useTheme();
	const userRole = getUserRole(user);

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

	useEffect(() => {
		if (user) {
			console.log('user.role:', userRole);
			console.log('navItems roles:', navItems.map(item => ({ label: item.label, roles: item.roles })));
		}
	}, [user, userRole]);

	const toggleSection = idx => {
		setOpenSections(openSections => openSections.map((open, i) => i === idx ? !open : open));
	};

	// Group nav items by section, remove Dashboard section
	const sections = [
		{
			heading: '',
			items: navItems.filter(item => ['Home', 'Dashboard'].includes(item.label)),
		},
		{
			heading: 'Management',
			items: navItems.filter(item => ['Companies', 'Branches', 'Users', 'Menu'].includes(item.label)),
		},
		{
			heading: 'Operations',
			items: navItems.filter(item => ['KOT', 'Inventory', 'Payments', 'Tables', 'Reservations'].includes(item.label)),
		},
		{
			heading: 'Reports & More',
			items: navItems.filter(item => ['Notifications', 'Reports'].includes(item.label)),
		},
	];

	return (
		<div className={`h-screen ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-gray-100 text-sky-800'} flex flex-col shadow-lg ${collapsed ? 'w-16' : 'w-64'} transition-all duration-200`}>
			<div className="flex flex-col gap-1 items-start justify-between p-4 border-b border-sky-200 dark:border-sky-700">
				<div className="flex items-center gap-2 w-full">
					<img src={logo} alt="Rannaghor360 Logo" className="w-8 h-8 rounded bg-white p-1" />
					{!collapsed && <span className={`font-extrabold text-xl tracking-wide ${theme === 'dark' ? 'text-white' : 'text-sky-800'}`}>Rannaghor360</span>}
				</div>
				{!collapsed && user && (
					<div className={`mt-2 text-xs ${theme === 'dark' ? 'text-sky-100' : 'text-sky-800'}`}> 
						<div><b>{user.name}</b> {user.role && <span>({user.role})</span>}</div>
						{company && <div>Company: <b>{company.name}</b></div>}
						{branch && <div>Branch: <b>{branch.name}</b></div>}
						{user.email && <div>Email: {user.email}</div>}
					</div>
				)}
				<button onClick={() => setCollapsed(!collapsed)} className="focus:outline-none absolute top-4 right-4">
					<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5" />
					</svg>
				</button>
			</div>
			<nav className="flex-1 mt-4 overflow-y-auto">
				{sections.map((section, idx) => (
					<div key={section.heading} className="mb-2">
						{section.heading && !collapsed && (
							<div
								className={`px-4 py-1 text-xs font-bold uppercase tracking-wider mb-1 cursor-pointer flex items-center justify-between
									${theme === 'dark' ? 'text-sky-200' : 'text-sky-900'}`}
								onClick={() => toggleSection(idx)}
							>
								{section.heading}
								<span className="ml-2">{openSections[idx] ? '−' : '+'}</span>
							</div>
						)}
						{openSections[idx] && section.items && section.items.length > 0 && section.items.filter(item => user && item.roles.includes(userRole)).map(item => {
							const Icon = item.icon;
							const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
							return (
								<Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-2 my-1 rounded transition-colors font-medium
									${active ? 'bg-sky-700 text-white' : theme === 'dark' ? 'hover:bg-sky-700 text-sky-100' : 'hover:bg-sky-700 text-sky-900'}
								`} tabIndex={0}>
									<Icon className="w-6 h-6" />
									{!collapsed && <span>{item.label}</span>}
								</Link>
							);
						})}
					</div>
				))}
			</nav>
			<div className="p-4 border-t border-sky-700">
				<button onClick={logout} className="flex items-center gap-3 w-full text-left hover:text-red-400 font-semibold">
					<ArrowLeftOnRectangleIcon className="w-6 h-6" />
					{!collapsed && <span>Logout</span>}
				</button>
			</div>
		</div>
	);
}