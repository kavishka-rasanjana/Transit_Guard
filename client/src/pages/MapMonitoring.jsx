// ============================================================
// MAP MONITORING PAGE
// National map view of Sri Lanka with all complaint markers.
// Implements FR-16: System Admin map view across all provinces,
// supporting filtering/aggregating by status and priority.
// Uses Leaflet + OpenStreetMap.
// ============================================================

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Filter, Eye, RotateCcw } from 'lucide-react';
import Header from '../components/layout/Header';
import { mockComplaints } from '../data/mockData';
import { STATUSES, PROVINCES } from '../js';

// Fix Leaflet default marker icon
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom colored marker icons for different priorities
function createColoredIcon(color) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
}

const PRIORITY_ICONS = {
  High: createColoredIcon('#ef4444'),
  Medium: createColoredIcon('#f59e0b'),
  Low: createColoredIcon('#3b82f6'),
};

// Sri Lanka center coordinates
const SRI_LANKA_CENTER = [7.8731, 80.7718];
const DEFAULT_ZOOM = 8;

export default function MapMonitoring() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [provinceFilter, setProvinceFilter] = useState('All');

  // Filter complaints that have GPS data
  const filteredComplaints = useMemo(() => {
    return mockComplaints.filter((c) => {
      if (!c.gpsLocation) return false;
      if (statusFilter !== 'All' && c.status !== statusFilter) return false;
      if (priorityFilter !== 'All' && c.priority !== priorityFilter) return false;
      if (provinceFilter !== 'All' && c.province !== provinceFilter) return false;
      return true;
    });
  }, [statusFilter, priorityFilter, provinceFilter]);

  // Count stats for the filtered view
  const stats = useMemo(() => {
    const withGps = mockComplaints.filter((c) => c.gpsLocation);
    return {
      total: withGps.length,
      shown: filteredComplaints.length,
      pending: filteredComplaints.filter((c) => c.status === 'Pending').length,
      inReview: filteredComplaints.filter((c) => c.status === 'In Review').length,
      resolved: filteredComplaints.filter((c) => c.status === 'Resolved').length,
      rejected: filteredComplaints.filter((c) => c.status === 'Rejected').length,
    };
  }, [filteredComplaints]);

  const resetFilters = () => {
    setStatusFilter('All');
    setPriorityFilter('All');
    setProvinceFilter('All');
  };

  return (
    <div>
      {/* Top nav bar only */}
      <Header />

      <div className="p-6">
        {/* ---- PAGE HEADING (moved down like EZInventory UI) ---- */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Map Monitoring</h1>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* ---- Left: Filters Panel ---- */}
          <div className="xl:col-span-1 space-y-4">
            {/* Filters Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Filter size={16} />
                  Map Filters
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-xs text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw size={12} />
                  Reset
                </button>
              </div>

              <div className="space-y-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All Statuses</option>
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Priority Filter */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Priority</label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All Priorities</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                {/* Province Filter */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Province</label>
                  <select
                    value={provinceFilter}
                    onChange={(e) => setProvinceFilter(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All Provinces</option>
                    {PROVINCES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Map Statistics</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Showing</span>
                  <span className="font-semibold text-slate-700">{stats.shown} of {stats.total}</span>
                </div>
                <div className="h-px bg-slate-100"></div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    Pending
                  </span>
                  <span className="font-medium text-slate-600">{stats.pending}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    In Review
                  </span>
                  <span className="font-medium text-slate-600">{stats.inReview}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    Resolved
                  </span>
                  <span className="font-medium text-slate-600">{stats.resolved}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                    Rejected
                  </span>
                  <span className="font-medium text-slate-600">{stats.rejected}</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Marker Legend</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-sm shrink-0"></span>
                  <span className="text-slate-600">High Priority</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow-sm shrink-0"></span>
                  <span className="text-slate-600">Medium Priority</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-sm shrink-0"></span>
                  <span className="text-slate-600">Low Priority</span>
                </div>
              </div>
            </div>
          </div>

          {/* ---- Right: Map ---- */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden" style={{ height: 'calc(100vh - 180px)' }}>
              <MapContainer
                center={SRI_LANKA_CENTER}
                zoom={DEFAULT_ZOOM}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {filteredComplaints.map((complaint) => (
                  <Marker
                    key={complaint.id}
                    position={[complaint.gpsLocation.latitude, complaint.gpsLocation.longitude]}
                    icon={PRIORITY_ICONS[complaint.priority]}
                  >
                    <Popup>
                      <div className="text-xs space-y-1 min-w-[180px]">
                        <div className="flex items-center justify-between">
                          <strong className="text-blue-600">{complaint.id}</strong>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                              complaint.priority === 'High'
                                ? 'bg-red-100 text-red-700'
                                : complaint.priority === 'Medium'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {complaint.priority}
                          </span>
                        </div>
                        <p className="font-medium">{complaint.violationCategory}</p>
                        <p className="text-slate-500">Bus: {complaint.busNumber}</p>
                        <p className="text-slate-500">Province: {complaint.province}</p>
                        <p className="text-slate-500">
                          Status:{' '}
                          <span
                            className={`font-medium ${
                              complaint.status === 'Pending'
                                ? 'text-amber-600'
                                : complaint.status === 'In Review'
                                ? 'text-blue-600'
                                : complaint.status === 'Resolved'
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {complaint.status}
                          </span>
                        </p>
                        <Link
                          to={`/complaints/${complaint.id}`}
                          className="inline-flex items-center gap-1 mt-1 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          <Eye size={12} />
                          View Details
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
