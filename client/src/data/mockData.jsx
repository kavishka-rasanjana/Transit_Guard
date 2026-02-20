// ============================================================
// MOCK DATA
// Realistic sample data for the System Admin dashboard.
// This will be replaced by API calls to the .NET backend later.
// ============================================================

import { PROVINCES } from '../js';

// --- GPS coordinate ranges per province (approximate centers) ---
const PROVINCE_COORDS = {
  'Western': { lat: 6.9271, lng: 79.8612 },
  'Central': { lat: 7.2906, lng: 80.6337 },
  'Southern': { lat: 6.0535, lng: 80.2210 },
  'Northern': { lat: 9.6615, lng: 80.0255 },
  'Eastern': { lat: 7.7310, lng: 81.6747 },
  'North Western': { lat: 7.7580, lng: 80.1875 },
  'North Central': { lat: 8.3114, lng: 80.4037 },
  'Uva': { lat: 6.8844, lng: 81.0567 },
  'Sabaragamuwa': { lat: 6.7056, lng: 80.3847 },
};

// Helper to generate a random GPS offset
function randomOffset() {
  return (Math.random() - 0.5) * 0.5;
}

// --- Mock Complaints (50 complaints across all provinces) ---
const violationOptions = [
  { category: 'Reckless driving', priority: 'High' },
  { category: 'Harassment', priority: 'High' },
  { category: 'Overloading', priority: 'Medium' },
  { category: 'Overcharging', priority: 'Medium' },
  { category: 'Not issuing tickets', priority: 'Medium' },
  { category: 'Not giving correct change', priority: 'Low' },
  { category: 'Skipping stops', priority: 'Low' },
  { category: 'Rude behavior', priority: 'Low' },
  { category: 'Loud music', priority: 'Low' },
];

const statuses = ['Pending', 'In Review', 'Resolved', 'Rejected'];
const passengerNames = [
  'Kamal Perera', 'Nimal Fernando', 'Sunethra Silva', 'Amara Jayawardena',
  'Ruwan Bandara', 'Dilani Kumari', 'Priya Rajapaksa', 'Asanka Gunawardena',
  'Tharushi Mendis', 'Chamara Wijesinghe', 'Lakmal Rathnayake', 'Sanduni Herath',
  'Nuwan Dissanayake', 'Malini Samarasinghe', 'Janaka Weerasinghe', 'Himali Gunathilaka',
  'Rohitha Wickramasinghe', 'Gayani Abeykoon', 'Saman Kumara', 'Pavithra Nanayakkara',
  'Dinesh Ratnayake', 'Iresha Karunanayake', 'Chathura Liyanage', 'Nadeesha Jayasuriya',
  'Mahinda Ekanayake', 'Rashmi Weerakoon', 'Lahiru Thilakarathne', 'Anusha Seneviratne',
  'Kasun Madushanka', 'Dilhara Pathirana', 'Thilina Jayasinghe', 'Samanthi Wickremasinghe',
  'Buddhika Palliyaguru', 'Chathurika Ranaweera', 'Isuru Priyadarshana', 'Nadeeka Gamage',
  'Charith Asalanka', 'Kumudini Rajapakse', 'Sachith Pathirana', 'Hasini Perera',
  'Dimuthu Attanayake', 'Oshadi Hewavitharana', 'Ruwanga Samarawickrama', 'Nisansala Kumari',
  'Ashan Priyadarshana', 'Dilrukshi Rajakaruna', 'Thushara Jayathilaka', 'Rasika Perera',
  'Ishara Madushan', 'Pathumi Karunaratne',
];

function generateComplaints() {
  const complaints = [];

  for (let i = 0; i < 50; i++) {
    const province = PROVINCES[i % 9];
    const violation = violationOptions[i % violationOptions.length];
    const status = statuses[i % 4];
    const coords = PROVINCE_COORDS[province];
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    complaints.push({
      id: `CMP-${String(i + 1).padStart(4, '0')}`,
      passengerName: passengerNames[i],
      busNumber: `${['NA', 'NB', 'NC', 'WP', 'EP', 'SP', 'CP', 'NW', 'SG'][i % 9]}-${1000 + Math.floor(Math.random() * 9000)}`,
      routeNumber: i % 3 === 0 ? undefined : `${Math.floor(Math.random() * 400) + 1}`,
      violationCategory: violation.category,
      priority: violation.priority,
      status: status,
      province: province,
      description: getDescription(violation.category),
      evidenceUrls: i % 4 === 0 ? ['https://placehold.co/400x300?text=Evidence+Photo'] : undefined,
      gpsLocation: i % 5 === 0 ? undefined : {
        latitude: coords.lat + randomOffset(),
        longitude: coords.lng + randomOffset(),
      },
      submittedAt: date.toISOString(),
      updatedAt: status !== 'Pending' ? new Date(date.getTime() + 86400000).toISOString() : undefined,
    });
  }

  return complaints;
}

function getDescription(category) {
  const descriptions = {
    'Reckless driving': 'The bus driver was driving very fast and overtaking dangerously on a narrow road.',
    'Harassment': 'The conductor was verbally harassing a female passenger regarding the fare.',
    'Overloading': 'The bus had far more passengers than capacity, people were hanging out of the door.',
    'Overcharging': 'The conductor charged Rs. 80 for a route that should cost Rs. 45.',
    'Not issuing tickets': 'No ticket was issued after collecting the fare from passengers.',
    'Not giving correct change': 'The conductor kept Rs. 20 extra and refused to return the change.',
    'Skipping stops': 'The bus skipped 3 designated bus stops without stopping.',
    'Rude behavior': 'The conductor was very rude when asked about the route, using offensive language.',
    'Loud music': 'Extremely loud music was playing in the bus causing discomfort to passengers.',
  };
  return descriptions[category];
}

export const mockComplaints = generateComplaints();

// --- Mock Provincial Admins ---
export const mockProvincialAdmins = PROVINCES.map((province, i) => ({
  id: `PA-${String(i + 1).padStart(3, '0')}`,
  name: [
    'Anura Wijesekara', 'Kumari Jayawardena', 'Sunil Rathnayake',
    'Malika Fernando', 'Roshan Karunaratne', 'Deepa Gunasinghe',
    'Sampath Ekanayake', 'Nishanthi Perera', 'Pradeep Wickramasinghe',
  ][i],
  email: `admin.${province.toLowerCase().replace(/\s/g, '')}@transport.gov.lk`,
  province: province,
  isActive: i !== 3, // Northern admin inactive for demo
  createdAt: '2025-06-01T00:00:00Z',
  lastLogin: i !== 3 ? new Date(Date.now() - Math.random() * 7 * 86400000).toISOString() : undefined,
}));

// --- Computed Dashboard Stats ---
export function getDashboardStats() {
  return {
    totalComplaints: mockComplaints.length,
    pendingComplaints: mockComplaints.filter(c => c.status === 'Pending').length,
    inReviewComplaints: mockComplaints.filter(c => c.status === 'In Review').length,
    resolvedComplaints: mockComplaints.filter(c => c.status === 'Resolved').length,
    rejectedComplaints: mockComplaints.filter(c => c.status === 'Rejected').length,
    highPriority: mockComplaints.filter(c => c.priority === 'High').length,
    mediumPriority: mockComplaints.filter(c => c.priority === 'Medium').length,
    lowPriority: mockComplaints.filter(c => c.priority === 'Low').length,
  };
}

export function getProvinceStats() {
  return PROVINCES.map(province => {
    const provinceComplaints = mockComplaints.filter(c => c.province === province);
    return {
      province,
      total: provinceComplaints.length,
      pending: provinceComplaints.filter(c => c.status === 'Pending').length,
      inReview: provinceComplaints.filter(c => c.status === 'In Review').length,
      resolved: provinceComplaints.filter(c => c.status === 'Resolved').length,
      rejected: provinceComplaints.filter(c => c.status === 'Rejected').length,
    };
  });
}

// --- Monthly trend data for charts ---
export function getMonthlyTrend() {
  const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
  return months.map((month, i) => ({
    month,
    complaints: Math.floor(Math.random() * 30) + 20 + i * 3,
    resolved: Math.floor(Math.random() * 20) + 10 + i * 2,
  }));
}
