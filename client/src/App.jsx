// ============================================================
// APP.TSX - Root Application Component
// Sets up React Router with all routes.
// Uses Layout component for authenticated pages and
// standalone Login page.
// ============================================================

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Complaints from './pages/Complaints';
import ComplaintDetail from './pages/ComplaintDetail';
import MapMonitoring from './pages/MapMonitoring';
import Accounts from './pages/Accounts';
import Reports from './pages/Reports';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login page - standalone (no sidebar/header) */}
        <Route path="/login" element={<Login />} />

        {/* Authenticated routes - wrapped in Layout (sidebar + header) */}
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/complaints/:id" element={<ComplaintDetail />} />
          <Route path="/map" element={<MapMonitoring />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
