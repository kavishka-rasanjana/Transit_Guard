// ============================================================
// COMPLAINT DETAIL PAGE
// Shows full details of a single complaint including:
// - Passenger info, bus details, violation category
// - Priority and status badges
// - GPS location on a mini Leaflet map (FR-15)
// - Evidence attachments
// - Timeline of status changes
// ============================================================

import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Bus,
  MapPin,
  Calendar,
  AlertTriangle,
  Clock,
  Route,
  Image,
  FileText,
  Navigation,
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Header from '../components/layout/Header';
import { mockComplaints } from '../data/mockData';

// Fix Leaflet default marker icon issue with bundlers
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function ComplaintDetail() {
  const { id } = useParams();
  const complaint = mockComplaints.find((c) => c.id === id);

  if (!complaint) {
    return (
      <div>
        <Header title="Complaint Not Found" />
        <div className="p-6">
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <FileText size={48} className="mx-auto text-slate-300 mb-4" />
            <h2 className="text-lg font-semibold text-slate-700">Complaint not found</h2>
            <p className="text-sm text-slate-400 mt-1">The complaint ID "{id}" does not exist.</p>
            <Link
              to="/complaints"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Complaints
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Timeline mock (based on status)
  const timelineSteps = [
    {
      status: 'Submitted',
      date: complaint.submittedAt,
      done: true,
      description: 'Complaint submitted by passenger via QR code flow.',
    },
    {
      status: 'Pending',
      date: complaint.submittedAt,
      done: true,
      description: 'Routed to provincial admin for review.',
    },
    {
      status: 'In Review',
      date: complaint.updatedAt || '',
      done: ['In Review', 'Resolved', 'Rejected'].includes(complaint.status),
      description: 'Provincial admin is reviewing the complaint.',
    },
    {
      status: complaint.status === 'Rejected' ? 'Rejected' : 'Resolved',
      date:
        complaint.status === 'Resolved' || complaint.status === 'Rejected'
          ? complaint.updatedAt || ''
          : '',
      done: ['Resolved', 'Rejected'].includes(complaint.status),
      description:
        complaint.status === 'Rejected'
          ? 'Complaint was rejected after review.'
          : 'Complaint was resolved successfully.',
    },
  ];

  return (
    <div>
      <Header title={`Complaint ${complaint.id}`} subtitle={complaint.violationCategory} />

      <div className="p-6">
        {/* Back button */}
        <Link
          to="/complaints"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-4 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to All Complaints
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ---- Left Column: Details ---- */}
          <div className="lg:col-span-2 space-y-6">
            {/* Complaint Info Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">{complaint.violationCategory}</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Submitted on {new Date(complaint.submittedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Priority Badge */}
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      complaint.priority === 'High'
                        ? 'bg-red-100 text-red-700'
                        : complaint.priority === 'Medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    <AlertTriangle size={12} />
                    {complaint.priority} Priority
                  </span>
                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      complaint.status === 'Pending'
                        ? 'bg-amber-50 text-amber-700'
                        : complaint.status === 'In Review'
                        ? 'bg-blue-50 text-blue-700'
                        : complaint.status === 'Resolved'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    <Clock size={12} />
                    {complaint.status}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <User size={18} className="text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Passenger Name</p>
                    <p className="text-sm font-semibold text-slate-700">{complaint.passengerName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <Bus size={18} className="text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Bus Number</p>
                    <p className="text-sm font-semibold text-slate-700">{complaint.busNumber}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <Route size={18} className="text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Route Number</p>
                    <p className="text-sm font-semibold text-slate-700">
                      {complaint.routeNumber || 'Not provided'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <Navigation size={18} className="text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Province</p>
                    <p className="text-sm font-semibold text-slate-700">{complaint.province}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <Calendar size={18} className="text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Submitted At</p>
                    <p className="text-sm font-semibold text-slate-700">
                      {new Date(complaint.submittedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <MapPin size={18} className="text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">GPS Coordinates</p>
                    <p className="text-sm font-semibold text-slate-700">
                      {complaint.gpsLocation
                        ? `${complaint.gpsLocation.latitude.toFixed(4)}, ${complaint.gpsLocation.longitude.toFixed(4)}`
                        : 'Not available'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {complaint.description && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Description</h3>
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg">
                    {complaint.description}
                  </p>
                </div>
              )}

              {/* Evidence */}
              {complaint.evidenceUrls && complaint.evidenceUrls.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Image size={16} />
                    Evidence Attachments
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {complaint.evidenceUrls.map((url, idx) => (
                      <div
                        key={idx}
                        className="aspect-video bg-slate-100 rounded-lg border border-slate-200 overflow-hidden"
                      >
                        <img
                          src={url}
                          alt={`Evidence ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* GPS Location Map (FR-15) */}
            {complaint.gpsLocation && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <MapPin size={16} className="text-blue-500" />
                  Complaint Location
                </h3>
                <div className="rounded-lg overflow-hidden border border-slate-200" style={{ height: '300px' }}>
                  <MapContainer
                    center={[complaint.gpsLocation.latitude, complaint.gpsLocation.longitude]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[complaint.gpsLocation.latitude, complaint.gpsLocation.longitude]}>
                      <Popup>
                        <div className="text-xs">
                          <strong>{complaint.id}</strong>
                          <br />
                          {complaint.violationCategory}
                          <br />
                          {complaint.busNumber}
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            )}
          </div>

          {/* ---- Right Column: Timeline & Status ---- */}
          <div className="space-y-6">
            {/* Status Timeline */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Case Timeline</h3>
              <div className="space-y-0">
                {timelineSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-3">
                    {/* Timeline line + dot */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full border-2 shrink-0 ${
                          step.done
                            ? 'bg-blue-600 border-blue-600'
                            : 'bg-white border-slate-300'
                        }`}
                      ></div>
                      {idx < timelineSteps.length - 1 && (
                        <div
                          className={`w-0.5 h-16 ${
                            step.done ? 'bg-blue-200' : 'bg-slate-200'
                          }`}
                        ></div>
                      )}
                    </div>
                    {/* Content */}
                    <div className="pb-6">
                      <p
                        className={`text-sm font-semibold ${
                          step.done ? 'text-slate-700' : 'text-slate-400'
                        }`}
                      >
                        {step.status}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{step.description}</p>
                      {step.done && step.date && (
                        <p className="text-xs text-slate-300 mt-1">
                          {new Date(step.date).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Info Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
              <h3 className="text-sm font-semibold mb-3 opacity-90">System Admin View</h3>
              <p className="text-xs leading-relaxed opacity-75">
                As System Admin, you can view all complaint details including GPS locations.
                Case management (replies, status updates) is handled by the respective Provincial Admin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
