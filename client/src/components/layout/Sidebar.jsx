// ============================================================
// SIDEBAR COMPONENT
// Navigation sidebar for the System Admin dashboard.
// Shows logo, nav links, and logout button.
// ============================================================

import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquareWarning,
  Map,
  Users,
  FileBarChart,
  LogOut,
  Bus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// Navigation items for System Admin
const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/complaints', icon: MessageSquareWarning, label: 'Complaints' },
  { to: '/map', icon: Map, label: 'Map Monitoring' },
  { to: '/accounts', icon: Users, label: 'Accounts' },
  { to: '/reports', icon: FileBarChart, label: 'Reports' },
];

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-slate-900 text-white flex flex-col transition-all duration-300 z-50 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-700">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 shrink-0">
          <Bus size={22} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-lg font-bold leading-tight">Transport</h1>
            <p className="text-xs text-slate-400 leading-tight">Complaint System</p>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              } ${collapsed ? 'justify-center' : ''}`
            }
          >
            <item.icon size={20} className="shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <button
      onClick={onToggle}
      className="flex items-center justify-center gap-2 px-3 py-3 mx-3 mb-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-sm"
        >
        <span>{'<<'}</span>
      </button>

      {/* Logout */}
      <div className="border-t border-slate-700 px-3 py-3">
        <NavLink
          to="/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-red-600/20 hover:text-red-400 transition-colors"
        >
        <span>Logout</span>
        </NavLink>
      </div>
    </aside>
  );
}
