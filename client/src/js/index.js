// ============================================================
// TYPE DEFINITIONS
// Based on the SRS document for the Public Transport
// Passenger Complaint & Management System
// ============================================================

// --- Enums ---

export const COMPLAINT_STATUSES = ['Pending', 'In Review', 'Resolved', 'Rejected'];

export const PRIORITIES = ['High', 'Medium', 'Low'];

export const VIOLATION_CATEGORIES = [
  'Reckless driving',
  'Harassment',
  'Overloading',
  'Overcharging',
  'Not issuing tickets',
  'Not giving correct change',
  'Skipping stops',
  'Rude behavior',
  'Loud music',
];

// --- Constants ---

// Map from violation category to priority (from Appendix B)
export const VIOLATION_PRIORITY_MAP = {
  'Reckless driving': 'High',
  'Harassment': 'High',
  'Overloading': 'Medium',
  'Overcharging': 'Medium',
  'Not issuing tickets': 'Medium',
  'Not giving correct change': 'Low',
  'Skipping stops': 'Low',
  'Rude behavior': 'Low',
  'Loud music': 'Low',
};

// All provinces in Sri Lanka
export const PROVINCES = [
  'Western',
  'Central',
  'Southern',
  'Northern',
  'Eastern',
  'North Western',
  'North Central',
  'Uva',
  'Sabaragamuwa',
];

// All statuses
export const STATUSES = [
  'Pending',
  'In Review',
  'Resolved',
  'Rejected',
];
