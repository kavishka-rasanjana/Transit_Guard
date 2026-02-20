// ============================================================
// ACCOUNT MANAGEMENT PAGE
// System Admin manages Provincial Admin accounts.
// Features: list accounts, create new, edit, toggle active.
// From SRS: System Admin has "manage accounts" permission.
// ============================================================

import { useState } from 'react';
import {
  Plus,
  Search,
  Edit3,
  ToggleLeft,
  ToggleRight,
  UserCircle,
  Mail,
  MapPin,
  Clock,
  X,
} from 'lucide-react';
import Header from '../components/layout/Header';
import { mockProvincialAdmins } from '../data/mockData';
import { PROVINCES } from '../js';

export default function Accounts() {
  const [admins, setAdmins] = useState(mockProvincialAdmins);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formProvince, setFormProvince] = useState('Western');

  // Filtered admins
  const filteredAdmins = admins.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.province.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open modal for creating a new admin
  const openCreateModal = () => {
    setEditingAdmin(null);
    setFormName('');
    setFormEmail('');
    setFormProvince('Western');
    setShowModal(true);
  };

  // Open modal for editing an admin
  const openEditModal = (admin) => {
    setEditingAdmin(admin);
    setFormName(admin.name);
    setFormEmail(admin.email);
    setFormProvince(admin.province);
    setShowModal(true);
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingAdmin) {
      // Update existing
      setAdmins((prev) =>
        prev.map((a) =>
          a.id === editingAdmin.id
            ? { ...a, name: formName, email: formEmail, province: formProvince }
            : a
        )
      );
    } else {
      // Create new
      const newAdmin = {
        id: `PA-${String(admins.length + 1).padStart(3, '0')}`,
        name: formName,
        email: formEmail,
        province: formProvince,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      setAdmins((prev) => [...prev, newAdmin]);
    }

    setShowModal(false);
  };

  // Toggle active status
  const toggleActive = (id) => {
    setAdmins((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
  };

  return (
    <div>
      {/* Top nav bar only */}
      <Header />

      <div className="p-6 space-y-4">
        {/* ---- PAGE HEADING (moved down like EZInventory UI) ---- */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Account Management</h1>
        </div>

        {/* ---- Top Controls ---- */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search admins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Add Provincial Admin
          </button>
        </div>

        {/* ---- Admin Cards Grid ---- */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAdmins.map((admin) => (
            <div
              key={admin.id}
              className={`bg-white rounded-xl border p-5 transition-shadow hover:shadow-md ${
                admin.isActive ? 'border-slate-200' : 'border-red-200 bg-red-50/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center ${
                      admin.isActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <UserCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">{admin.name}</h3>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        admin.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {admin.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-mono">{admin.id}</span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail size={14} className="text-slate-400 shrink-0" />
                  <span className="truncate">{admin.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin size={14} className="text-slate-400 shrink-0" />
                  <span>{admin.province} Province</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock size={14} className="text-slate-400 shrink-0" />
                  <span className="text-xs">
                    Last login:{' '}
                    {admin.lastLogin
                      ? new Date(admin.lastLogin).toLocaleDateString()
                      : 'Never'}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => openEditModal(admin)}
                  className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Edit3 size={14} />
                  Edit
                </button>
                <button
                  onClick={() => toggleActive(admin.id)}
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                    admin.isActive
                      ? 'text-red-500 hover:text-red-600'
                      : 'text-green-600 hover:text-green-700'
                  }`}
                >
                  {admin.isActive ? (
                    <>
                      <ToggleRight size={16} />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <ToggleLeft size={16} />
                      Activate
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredAdmins.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <UserCircle size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="text-sm text-slate-500">No admin accounts found.</p>
          </div>
        )}
      </div>

      {/* ---- Create/Edit Modal ---- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-800">
                {editingAdmin ? 'Edit Provincial Admin' : 'Add Provincial Admin'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Enter full name"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="admin@transport.gov.lk"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assigned Province</label>
                <select
                  value={formProvince}
                  onChange={(e) => setFormProvince(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>{p} Province</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  {editingAdmin ? 'Save Changes' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
