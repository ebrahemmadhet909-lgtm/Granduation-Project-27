/* ==========================================================================
   ServiX — Static demo data (replace with API calls when a backend exists)
   ========================================================================== */
(function (global) {
  'use strict';

  const entry = (id, name, icon, group, desc, price, extra = {}) =>
    ({ id, name, icon, group, desc, price, ...extra });

  const CATALOG = Object.fromEntries([
    // Home & general
    entry('plumbing', 'Plumbing', '🔧', 'home', 'Repairs, installations and leak repairs.', '200 - 600 EGP', { href: 'plumbing.html' }),
    entry('electrical', 'Electrical', '⚡', 'home', 'Safe electrical repairs and installations.', '250 - 700 EGP'),
    entry('ac-maintenance', 'AC Maintenance', '❄️', 'home', 'Cooling, cleaning and AC repair services.', '300 - 800 EGP', { href: 'ac-maintenance.html' }),
    entry('cleaning', 'Cleaning', '🧹', 'home', 'Home and deep cleaning services.', '150 - 500 EGP'),
    entry('painting', 'Painting', '🎨', 'home', 'Interior and exterior painting.', '500 - 2,000 EGP'),
    entry('carpentry', 'Carpentry', '🪚', 'home', 'Furniture and wood repair.', '300 - 1,500 EGP', { href: 'carpentry.html' }),
    entry('appliance-repair', 'Appliance Repair', '🔌', 'home', 'Home appliance maintenance.', '200 - 700 EGP'),
    entry('general-maintenance', 'General Maintenance', '🛠️', 'home', 'All-around home repairs.', '250 - 500 EGP'),
    entry('home-services', 'Home Services', '🏠', 'home', 'Complete home care and maintenance.', '250 - 500 EGP', { href: 'home-services.html' }),
    // Top-level groups
    entry('car-services', 'Car Services', '🚗', 'car', 'Car maintenance and repair solutions.', 'From 250 EGP', { href: 'car-services.html' }),
    entry('medical-services', 'Medical Services', '➕', 'medical', 'Healthcare and home medical assistance.', 'From 200 EGP', { href: 'medical-services.html' }),
    entry('emergency', 'Emergency', '🚨', 'emergency', 'Quick help when you need it most.', 'Free call-out', { href: 'emergency.html' }),
    // Car sub-services
    entry('car-maintenance', 'Car Maintenance', '🚗', 'car', 'Complete vehicle inspection and regular maintenance', 'From 300 EGP', { status: 'Active' }),
    entry('engine-repair', 'Engine Repair', '⚙️', 'car', 'Engine diagnosis and professional repair', 'From 500 EGP', { status: 'Active' }),
    entry('oil-change', 'Oil Change', '🛢️', 'car', 'Engine oil replacement and filter service', 'From 250 EGP', { status: 'Active' }),
    entry('tire-replacement', 'Tire Replacement', '⭕', 'car', 'Professional tire services and wheel alignment', 'From 300 EGP', { status: 'Active' }),
    entry('car-battery', 'Car Battery', '🔋', 'car', 'Battery inspection and replacement service', 'From 400 EGP', { status: 'Pending' }),
    // Medical sub-services
    entry('doctor-visit', 'Doctor Visit', '🩺', 'medical', 'General medical consultation at your home', '300 - 600 EGP'),
    entry('nursing-care', 'Nursing Care', '👩‍⚕️', 'medical', 'Professional nursing at home and patient care', '200 - 500 EGP'),
    entry('lab-tests', 'Lab Tests', '🧪', 'medical', 'Blood tests and lab services with home visits', '150 - 800 EGP'),
    entry('dental-care', 'Dental Care', '🦷', 'medical', 'Dental checkups and oral health services', '250 - 900 EGP'),
    entry('home-healthcare', 'Home Healthcare', '🏥', 'medical', 'Healthcare in your home with trusted providers', '300 - 1,000 EGP')
  ].map(item => [item.id, item]));

  const COLLECTIONS = {
    home: ['plumbing', 'electrical', 'ac-maintenance', 'cleaning'],
    services: ['plumbing', 'electrical', 'ac-maintenance', 'cleaning', 'car-services', 'medical-services', 'home-services', 'emergency'],
    types: ['home-services', 'ac-maintenance', 'plumbing', 'electrical', 'painting', 'car-services', 'cleaning', 'emergency'],
    homeServices: ['plumbing', 'ac-maintenance', 'electrical', 'cleaning', 'painting', 'carpentry', 'appliance-repair', 'general-maintenance'],
    medical: ['doctor-visit', 'nursing-care', 'lab-tests', 'dental-care', 'home-healthcare'],
    car: ['car-maintenance', 'engine-repair', 'oil-change', 'tire-replacement', 'car-battery']
  };

  const RECORDS = {
    services: [
      { name: 'Emergency Ambulance', desc: 'Fast and reliable ambulance service for emergencies.', category: 'Emergency Services', tone: 'red', provider: 'City Ambulance Services', status: 'Active', price: '$0', note: '(Free)', icon: '🚑' },
      { name: 'Home Repair', desc: 'Plumbing, electrical and home maintenance services.', category: 'Home Services', tone: 'blue', provider: 'FixIt Pro', status: 'Active', price: '$25', note: '(Starting)', icon: '🛠️' },
      { name: 'Car Towing', desc: '24/7 car towing and roadside assistance.', category: 'Transportation', tone: 'purple', provider: 'Quick Tow', status: 'Active', price: '$30', note: '(Starting)', icon: '🚗' },
      { name: 'Doctor Home Visit', desc: 'Professional medical consultation at home.', category: 'Medical Services', tone: 'green', provider: 'HealthPlus', status: 'Active', price: '$50', note: '(Starting)', icon: '🩺' },
      { name: 'Electrical Repair', desc: 'Fix electrical issues and installations.', category: 'Home Services', tone: 'blue', provider: 'PowerFix', status: 'Active', price: '$40', note: '(Starting)', icon: '⚡' },
      { name: 'House Cleaning', desc: 'Professional cleaning for homes and offices.', category: 'Home Services', tone: 'blue', provider: 'CleanPro', status: 'Inactive', price: '$30', note: '(Starting)', icon: '🧹' },
      { name: 'Security Guard', desc: '24/7 security and protection services.', category: 'Security Services', tone: 'amber', provider: 'SafeGuard', status: 'Active', price: '$20', note: '(Starting)', icon: '🛡️' },
      { name: 'Garden Maintenance', desc: 'Gardening and landscaping services.', category: 'Home Services', tone: 'blue', provider: 'GreenLife', status: 'Active', price: '$35', note: '(Starting)', icon: '🌿' }
    ],
    requests: [
      { id: '#SR-4587', user: 'Ahmed Mohamed', email: 'ahmed@example.com', type: 'Car Service', location: 'Nasr City, Cairo', status: 'In Progress', priority: 'High', date: '2025/10/22 14:32' },
      { id: '#SR-4586', user: 'Sara Ali', email: 'sara@example.com', type: 'Medical Service', location: 'Maadi, Giza', status: 'Pending', priority: 'Medium', date: '2025/10/22 12:17' },
      { id: '#SR-4585', user: 'Omar Hassan', email: 'omar@example.com', type: 'Home Service', location: '6th October, Giza', status: 'Completed', priority: 'Low', date: '2025/10/21 16:45' },
      { id: '#SR-4584', user: 'Laila Ahmed', email: 'laila@example.com', type: 'Maintenance', location: 'Heliopolis, Cairo', status: 'In Progress', priority: 'Medium', date: '2025/10/21 11:03' },
      { id: '#SR-4583', user: 'Kareem Ibrahim', email: 'kareem@example.com', type: 'Medical Service', location: 'Dokki, Giza', status: 'Completed', priority: 'Low', date: '2025/10/20 18:27' },
      { id: '#SR-4582', user: 'Nour Gamal', email: 'nour@example.com', type: 'Car Service', location: 'New Cairo', status: 'Pending', priority: 'High', date: '2025/10/20 15:42' },
      { id: '#SR-4581', user: 'Tarek Mohamed', email: 'tarek@example.com', type: 'Home Service', location: 'Shubra, Cairo', status: 'In Progress', priority: 'Medium', date: '2025/10/19 13:10' },
      { id: '#SR-4580', user: 'Hend Salah', email: 'hend@example.com', type: 'Emergency', location: 'Nasr City, Cairo', status: 'Completed', priority: 'High', date: '2025/10/19 10:12' }
    ],
    users: [
      { name: 'Ahmed Mohamed', email: 'ahmed@example.com', phone: '+20 101 234 5678', role: 'Admin', status: 'Active', joined: '2025/10/12' },
      { name: 'Sara Ali', email: 'sara@example.com', phone: '+20 102 345 6789', role: 'User', status: 'Active', joined: '2025/10/11' },
      { name: 'Omar Hassan', email: 'omar@example.com', phone: '+20 103 456 7890', role: 'Service Provider', status: 'Pending', joined: '2025/10/10' },
      { name: 'Laila Ahmed', email: 'laila@example.com', phone: '+20 104 567 8901', role: 'User', status: 'Active', joined: '2025/10/09' },
      { name: 'Kareem Ibrahim', email: 'kareem@example.com', phone: '+20 105 678 9012', role: 'Service Provider', status: 'Active', joined: '2025/10/08' },
      { name: 'Nour Gamal', email: 'nour@example.com', phone: '+20 106 789 0123', role: 'User', status: 'Blocked', joined: '2025/10/07' },
      { name: 'Tarek Mohamed', email: 'tarek@example.com', phone: '+20 107 890 1234', role: 'Service Provider', status: 'Active', joined: '2025/10/06' },
      { name: 'Hend Salah', email: 'hend@example.com', phone: '+20 108 901 2345', role: 'User', status: 'Active', joined: '2025/10/05' }
    ],
    providers: [
      { id: '#P-001', name: 'Ahmed Hassan', email: 'ahmed.hassan@gmail.com', phone: '+20 100 123 4567', type: 'Car Services', status: 'Active', rating: '4.8' },
      { id: '#P-002', name: 'Omar Ali', email: 'omar.ali@gmail.com', phone: '+20 101 234 5678', type: 'Medical Services', status: 'Active', rating: '4.9' },
      { id: '#P-003', name: 'Omar Hassan', email: 'omar.hassan@gmail.com', phone: '+20 102 345 6789', type: 'Home Services', status: 'Pending', rating: '4.6' },
      { id: '#P-004', name: 'Mahmoud Ali', email: 'mahmoud.ali@gmail.com', phone: '+20 103 456 7890', type: 'Car Services', status: 'Active', rating: '4.7' },
      { id: '#P-005', name: 'Youssef Salem', email: 'youssef.salem@gmail.com', phone: '+20 104 567 8901', type: 'Medical Services', status: 'Active', rating: '4.8' },
      { id: '#P-006', name: 'Sarah Ahmed', email: 'sarah.ahmed@gmail.com', phone: '+20 105 678 9012', type: 'Car Services', status: 'Suspended', rating: '4.2' },
      { id: '#P-007', name: 'Tarek Mahmoud', email: 'tarek.mahmoud@gmail.com', phone: '+20 106 789 0123', type: 'Home Services', status: 'Active', rating: '4.6' },
      { id: '#P-008', name: 'Ali Ibrahim', email: 'ali.ibrahim@gmail.com', phone: '+20 107 890 1234', type: 'Plumbing', status: 'Active', rating: '4.5' }
    ],
    reports: [
      { id: '#RPT-001', name: 'Service Bookings', category: 'All Services', period: 'Oct 01 - Oct 31, 2025', total: '2,973', change: '+12.5%' },
      { id: '#RPT-002', name: 'User Activity', category: 'All Users', period: 'Oct 01 - Oct 31, 2025', total: '1,248', change: '+8.2%' },
      { id: '#RPT-003', name: 'Revenue Report', category: 'All Services', period: 'Oct 01 - Oct 31, 2025', total: '$26,680', change: '+18.3%' },
      { id: '#RPT-004', name: 'Provider Performance', category: 'All Providers', period: 'Oct 01 - Oct 31, 2025', total: '458', change: '+6.4%' },
      { id: '#RPT-005', name: 'Emergency Trends', category: 'Emergency', period: 'Oct 01 - Oct 31, 2025', total: '127', change: '+9.1%' }
    ],
    recent: [
      { icon: '🚗', title: 'Car Repair Request', sub: 'Car Services · Giza - 6th of October', time: '10 minutes ago', status: 'In Progress' },
      { icon: '🚑', title: 'Ambulance Request', sub: 'Emergency Request · Nasr City', time: '25 minutes ago', status: 'New' },
      { icon: '🔧', title: 'Plumbing Request', sub: 'Home Services · Maadi', time: '1 hour ago', status: 'In Progress' },
      { icon: '🛠️', title: 'Mechanic Request', sub: 'Car Services · Zamalek', time: '2 hours ago', status: 'Completed' }
    ]
  };

  global.ServixData = { CATALOG, COLLECTIONS, RECORDS };
})(window);
