// ============================================================
// DASHBOARD PAGE
// System Admin national overview dashboard.
// Shows: total case counts, priority breakdown, province
// stats table, complaint trend chart, and recent complaints.
// Implements FR-09 (View All) and FR-18 (Case Totals).
// ============================================================

import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  FileText,
  BarChart3,
  Search,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import Header from '../components/layout/Header';
import { getDashboardStats, getProvinceStats, getMonthlyTrend, mockComplaints } from '../data/mockData';

// Colors for priority levels
const PRIORITY_COLORS = {
  High: '#ef4444',
  Medium: '#f59e0b',
  Low: '#3b82f6',
};

export default function Dashboard() {
  const stats = getDashboardStats();
  const provinceStats = getProvinceStats();
  const monthlyTrend = getMonthlyTrend();

  // Data for the priority pie chart
  const priorityData = [
    { name: 'High', value: stats.highPriority, color: PRIORITY_COLORS.High },
    { name: 'Medium', value: stats.mediumPriority, color: PRIORITY_COLORS.Medium },
    { name: 'Low', value: stats.lowPriority, color: PRIORITY_COLORS.Low },
  ];

  // Recent complaints (last 5)
  const recentComplaints = [...mockComplaints]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  return (
    <div>
      {/* Top nav bar (dark) */}
      <Header />

      <div className="p-6 space-y-6">
        {/* ---- PAGE HEADING + SEARCH (moved down like EZInventory UI) ---- */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search complaints..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* ---- Status Summary Cards ---- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Complaints</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{stats.totalComplaints}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <FileText size={24} className="text-slate-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs text-green-600">
              <TrendingUp size={14} />
              <span>+12% from last month</span>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Pending</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">{stats.pendingComplaints}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                <Clock size={24} className="text-amber-500" />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3">Awaiting provincial review</p>
          </div>

          {/* Resolved */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Resolved</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.resolvedComplaints}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <CheckCircle2 size={24} className="text-green-500" />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3">Successfully addressed</p>
          </div>

          {/* High Priority */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">High Priority</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{stats.highPriority}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                <AlertTriangle size={24} className="text-red-500" />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3">Require immediate attention</p>
          </div>
        </div>

        {/* ---- Charts Row ---- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Trend Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Monthly Complaint Trend</h3>
                <p className="text-xs text-slate-400 mt-0.5">Last 7 months overview</p>
              </div>
              <BarChart3 size={20} className="text-slate-400" />
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyTrend} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="complaints" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Total Complaints" />
                <Bar dataKey="resolved" fill="#22c55e" radius={[4, 4, 0, 0]} name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Priority Pie Chart */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-1">Priority Distribution</h3>
            <p className="text-xs text-slate-400 mb-2">Breakdown by priority level</p>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="45%"
                  outerRadius={85}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{value}</span>
                  )}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ---- Province Breakdown Table ---- */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Province Breakdown</h3>
              <p className="text-xs text-slate-400 mt-0.5">Case counts by province and status</p>
            </div>
            <Link
              to="/complaints"
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500">
                  <th className="text-left px-5 py-3 font-medium">Province</th>
                  <th className="text-center px-3 py-3 font-medium">Total</th>
                  <th className="text-center px-3 py-3 font-medium">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span> Pending
                    </span>
                  </th>
                  <th className="text-center px-3 py-3 font-medium">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span> In Review
                    </span>
                  </th>
                  <th className="text-center px-3 py-3 font-medium">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-400"></span> Resolved
                    </span>
                  </th>
                  <th className="text-center px-3 py-3 font-medium">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-400"></span> Rejected
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {provinceStats.map((ps) => (
                  <tr key={ps.province} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-slate-700">{ps.province}</td>
                    <td className="text-center px-3 py-3 font-semibold text-slate-800">{ps.total}</td>
                    <td className="text-center px-3 py-3">
                      <span className="inline-flex items-center justify-center min-w-[24px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">
                        {ps.pending}
                      </span>
                    </td>
                    <td className="text-center px-3 py-3">
                      <span className="inline-flex items-center justify-center min-w-[24px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                        {ps.inReview}
                      </span>
                    </td>
                    <td className="text-center px-3 py-3">
                      <span className="inline-flex items-center justify-center min-w-[24px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                        {ps.resolved}
                      </span>
                    </td>
                    <td className="text-center px-3 py-3">
                      <span className="inline-flex items-center justify-center min-w-[24px] px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-xs font-medium">
                        {ps.rejected}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ---- Recent Complaints ---- */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Recent Complaints</h3>
              <p className="text-xs text-slate-400 mt-0.5">Latest submissions across all provinces</p>
            </div>
            <Link
              to="/complaints"
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentComplaints.map((complaint) => (
              <Link
                key={complaint.id}
                to={`/complaints/${complaint.id}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      complaint.priority === 'High'
                        ? 'bg-red-500'
                        : complaint.priority === 'Medium'
                        ? 'bg-amber-500'
                        : 'bg-blue-500'
                    }`}
                  ></div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {complaint.id} - {complaint.violationCategory}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {complaint.busNumber} &middot; {complaint.province} &middot; {complaint.passengerName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
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
                  <span className="text-xs text-slate-400 hidden sm:block">
                    {new Date(complaint.submittedAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
