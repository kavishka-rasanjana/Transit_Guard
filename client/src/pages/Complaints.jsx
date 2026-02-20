// ============================================================
// COMPLAINTS LIST PAGE
// Shows all complaints across Sri Lanka with filtering,
// sorting, and search capabilities.
// Implements FR-09 (System Admin View-All), FR-12 (Priority),
// FR-13 (High priority at top), FR-14 (Status workflow).
// ============================================================

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, SortDesc, Eye, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../components/layout/Header';
import { mockComplaints } from '../data/mockData';
import { STATUSES, PROVINCES, VIOLATION_CATEGORIES } from '../js';

const ITEMS_PER_PAGE = 10;

export default function Complaints() {
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [provinceFilter, setProvinceFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Sort state - default: high priority first, then by date
  const [sortBy, setSortBy] = useState('priority');

  // Filter and sort complaints
  const filteredComplaints = useMemo(() => {
    let result = [...mockComplaints];

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.id.toLowerCase().includes(term) ||
          c.passengerName.toLowerCase().includes(term) ||
          c.busNumber.toLowerCase().includes(term) ||
          c.violationCategory.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      result = result.filter((c) => c.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'All') {
      result = result.filter((c) => c.priority === priorityFilter);
    }

    // Province filter
    if (provinceFilter !== 'All') {
      result = result.filter((c) => c.province === provinceFilter);
    }

    // Category filter
    if (categoryFilter !== 'All') {
      result = result.filter((c) => c.violationCategory === categoryFilter);
    }

    // Sort
    const priorityOrder = { High: 0, Medium: 1, Low: 2 };
    const statusOrder = { Pending: 0, 'In Review': 1, Resolved: 2, Rejected: 3 };

    result.sort((a, b) => {
      if (sortBy === 'priority') {
        const diff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (diff !== 0) return diff;
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      } else if (sortBy === 'date') {
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      } else {
        const diff = statusOrder[a.status] - statusOrder[b.status];
        if (diff !== 0) return diff;
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      }
    });

    return result;
  }, [searchTerm, statusFilter, priorityFilter, provinceFilter, categoryFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredComplaints.length / ITEMS_PER_PAGE);
  const paginatedComplaints = filteredComplaints.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  const handleFilterChange = (setter, value) => {
    setter(value);
    setCurrentPage(1);
  };

  return (
    <div>
      {/* Top nav bar only */}
      <Header />

      <div className="p-6 space-y-4">
        {/* ---- PAGE HEADING (moved down like EZInventory UI) ---- */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">All Complaints</h1>
        </div>

        {/* ---- Search & Filter Controls ---- */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by ID, name, bus number, or category..."
                value={searchTerm}
                onChange={(e) => handleFilterChange(setSearchTerm, e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Toggle Filters */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                showFilters
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Filter size={16} />
              Filters
            </button>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <SortDesc size={16} className="text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="priority">Sort: Priority</option>
                <option value="date">Sort: Newest First</option>
                <option value="status">Sort: Status</option>
              </select>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Statuses</option>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Priority</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => handleFilterChange(setPriorityFilter, e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Province</label>
                <select
                  value={provinceFilter}
                  onChange={(e) => handleFilterChange(setProvinceFilter, e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Provinces</option>
                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Violation Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => handleFilterChange(setCategoryFilter, e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Categories</option>
                  {VIOLATION_CATEGORIES.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* ---- Complaints Table ---- */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <th className="text-left px-5 py-3 font-medium">ID</th>
                  <th className="text-left px-3 py-3 font-medium">Passenger</th>
                  <th className="text-left px-3 py-3 font-medium">Bus No.</th>
                  <th className="text-left px-3 py-3 font-medium">Violation</th>
                  <th className="text-center px-3 py-3 font-medium">Priority</th>
                  <th className="text-center px-3 py-3 font-medium">Status</th>
                  <th className="text-left px-3 py-3 font-medium">Province</th>
                  <th className="text-center px-3 py-3 font-medium">GPS</th>
                  <th className="text-left px-3 py-3 font-medium">Date</th>
                  <th className="text-center px-3 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedComplaints.map((complaint) => (
                  <tr key={complaint.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs font-medium text-blue-600">
                      {complaint.id}
                    </td>
                    <td className="px-3 py-3 text-slate-700 font-medium">
                      {complaint.passengerName}
                    </td>
                    <td className="px-3 py-3 text-slate-600">{complaint.busNumber}</td>
                    <td className="px-3 py-3 text-slate-600 max-w-[150px] truncate">
                      {complaint.violationCategory}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          complaint.priority === 'High'
                            ? 'bg-red-100 text-red-700'
                            : complaint.priority === 'Medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {complaint.priority}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          complaint.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700'
                            : complaint.status === 'In Review'
                            ? 'bg-blue-50 text-blue-700'
                            : complaint.status === 'Resolved'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {complaint.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-600">{complaint.province}</td>
                    <td className="px-3 py-3 text-center">
                      {complaint.gpsLocation ? (
                        <MapPin size={16} className="inline text-green-500" />
                      ) : (
                        <span className="text-xs text-slate-300">N/A</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-slate-500 text-xs">
                      {new Date(complaint.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <Link
                        to={`/complaints/${complaint.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        <Eye size={14} />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-slate-50">
            <p className="text-xs text-slate-500">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredComplaints.length)} of{' '}
              {filteredComplaints.length} complaints
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
