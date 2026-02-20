// ============================================================
// REPORTS PAGE
// National-level reporting for System Admin.
// Shows: complaint trends, province comparisons, violation
// category breakdown, and export options.
// ============================================================

import { useState } from 'react';
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
  LineChart,
  Line,
} from 'recharts';
import { FileText, Calendar } from 'lucide-react';
import Header from '../components/layout/Header';
import { mockComplaints, getProvinceStats, getMonthlyTrend } from '../data/mockData';
import { VIOLATION_CATEGORIES } from '../js';

const COLORS = ['#3b82f6', '#f59e0b'];

export default function Reports() {
  const [dateRange, setDateRange] = useState('last30');
  const provinceStats = getProvinceStats();
  const monthlyTrend = getMonthlyTrend();

  // Violation category breakdown
  const violationData = VIOLATION_CATEGORIES.map((category, idx) => ({
    name: category,
    count: mockComplaints.filter((c) => c.violationCategory === category).length,
    color: idx % 2 === 0 ? COLORS[0] : COLORS[1],
  }));

  // Status distribution data
  const statusData = [
    { name: 'Pending', value: mockComplaints.filter((c) => c.status === 'Pending').length, color: '#f59e0b' },
    { name: 'In Review', value: mockComplaints.filter((c) => c.status === 'In Review').length, color: '#3b82f6' },
    { name: 'Resolved', value: mockComplaints.filter((c) => c.status === 'Resolved').length, color: '#22c55e' },
    { name: 'Rejected', value: mockComplaints.filter((c) => c.status === 'Rejected').length, color: '#ef4444' },
  ];

  // Province comparison data for bar chart
  const provinceBarData = provinceStats.map((ps) => ({
    name: ps.province.length > 10 ? ps.province.substring(0, 10) + '...' : ps.province,
    fullName: ps.province,
    total: ps.total,
    pending: ps.pending,
    resolved: ps.resolved,
  }));

  // Mock export function
  const handleExport = (format) => {
    alert(`Export as ${format} will be available when the .NET backend is connected.`);
  };

  return (
    <div>
      {/* Top nav bar only */}
      <Header />

      <div className="p-6 space-y-6">
        {/* ---- PAGE HEADING (moved down like EZInventory UI) ---- */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
        </div>

        {/* ---- Top Controls ---- */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Calendar size={16} className="text-slate-400" />
              <span>Date Range:</span>
            </div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="last7">Last 7 Days</option>
              <option value="last30">Last 30 Days</option>
              <option value="last90">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport('PDF')}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <FileText size={16} />
              Export PDF
            </button>
          </div>
        </div>

        {/* ---- Row 1: Trend + Status ---- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Complaint Trend Line Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-1">Complaint Trend</h3>
            <p className="text-xs text-slate-400 mb-4">Monthly complaints vs resolved cases</p>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                <Line
                  type="monotone"
                  dataKey="complaints"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Total Complaints"
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Resolved"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Status Distribution Pie */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-1">Status Distribution</h3>
            <p className="text-xs text-slate-400 mb-2">Current case status breakdown</p>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="45%"
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ fontSize: '11px', color: '#64748b' }}>{value}</span>
                  )}
                />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ---- Row 2: Province Comparison ---- */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-1">Province Comparison</h3>
          <p className="text-xs text-slate-400 mb-4">Complaint volumes by province</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={provinceBarData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                labelFormatter={(_label, payload) => payload?.[0]?.payload?.fullName || _label}
              />
              <Legend iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Total" />
              <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Pending" />
              <Bar dataKey="resolved" fill="#22c55e" radius={[4, 4, 0, 0]} name="Resolved" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ---- Row 3: Violation Category Breakdown ---- */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-1">Violation Category Breakdown</h3>
          <p className="text-xs text-slate-400 mb-4">Number of complaints per violation type</p>
          <div className="space-y-3">
            {violationData
              .sort((a, b) => b.count - a.count)
              .map((item) => {
                const maxCount = Math.max(...violationData.map((d) => d.count));
                const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                return (
                  <div key={item.name} className="flex items-center gap-4">
                    <span className="text-xs text-slate-600 w-40 shrink-0 truncate">{item.name}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
                      <div
                        className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 8)}%`, backgroundColor: item.color }}
                      >
                        <span className="text-xs text-white font-semibold">{item.count}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* ---- Summary Table ---- */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-800">Detailed Province Summary</h3>
            <p className="text-xs text-slate-400 mt-0.5">Complete breakdown with resolution rates</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500">
                  <th className="text-left px-5 py-3 font-medium">Province</th>
                  <th className="text-center px-3 py-3 font-medium">Total</th>
                  <th className="text-center px-3 py-3 font-medium">Pending</th>
                  <th className="text-center px-3 py-3 font-medium">In Review</th>
                  <th className="text-center px-3 py-3 font-medium">Resolved</th>
                  <th className="text-center px-3 py-3 font-medium">Rejected</th>
                  <th className="text-center px-3 py-3 font-medium">Resolution Rate</th>
                </tr>
              </thead>
              <tbody>
                {provinceStats.map((ps) => {
                  const resolutionRate =
                    ps.total > 0
                      ? Math.round((ps.resolved / ps.total) * 100)
                      : 0;
                  return (
                    <tr key={ps.province} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 font-medium text-slate-700">{ps.province}</td>
                      <td className="text-center px-3 py-3 font-semibold">{ps.total}</td>
                      <td className="text-center px-3 py-3 text-amber-600">{ps.pending}</td>
                      <td className="text-center px-3 py-3 text-blue-600">{ps.inReview}</td>
                      <td className="text-center px-3 py-3 text-green-600">{ps.resolved}</td>
                      <td className="text-center px-3 py-3 text-red-600">{ps.rejected}</td>
                      <td className="text-center px-3 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 bg-slate-100 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-green-500 transition-all"
                              style={{ width: `${resolutionRate}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium text-slate-600">{resolutionRate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
