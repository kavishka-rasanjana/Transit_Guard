// ============================================================
// LAYOUT COMPONENT
// Main layout wrapper that combines Sidebar + Header + content.
// Used for all authenticated pages.
// ============================================================

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area - shifts based on sidebar width */}
      <main
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {/* Outlet renders the matched child route's component */}
        <Outlet />
      </main>
    </div>
  );
}
  ù