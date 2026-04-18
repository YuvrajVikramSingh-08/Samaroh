export const mockEvents = [
  {
    id: 'evt-001',
    name: 'IPL Final 2026',
    date: '2026-05-28',
    time: '19:30',
    venue: 'Wankhede Stadium, Mumbai',
    totalCapacity: 33000,
    description: 'The grand finale of the 2026 Indian Premier League.',
    gridZones: [
      { id: 'z1', name: 'North Stand', type: 'Seating', capacity: 8000, x: 2, y: 0, w: 4, h: 2, color: 'bg-gray-700' },
      { id: 'z2', name: 'South Stand', type: 'Seating', capacity: 8000, x: 2, y: 8, w: 4, h: 2, color: 'bg-gray-700' },
      { id: 'z3', name: 'East Stand', type: 'Seating', capacity: 8500, x: 6, y: 2, w: 2, h: 6, color: 'bg-gray-700' },
      { id: 'z4', name: 'West Stand', type: 'Seating', capacity: 8500, x: 0, y: 2, w: 2, h: 6, color: 'bg-gray-700' },
      { id: 'z5', name: 'Pitch', type: 'Stage', capacity: 100, x: 2, y: 2, w: 4, h: 6, color: 'bg-primary' },
      { id: 'z6', name: 'Food Court A', type: 'Food', capacity: 500, x: 0, y: 0, w: 2, h: 2, color: 'bg-orange-500' },
      { id: 'z7', name: 'Medical Post 1', type: 'Medical', capacity: 50, x: 6, y: 8, w: 2, h: 2, color: 'bg-green-500' },
      { id: 'z8', name: 'Main Exit', type: 'Exit', capacity: 5000, x: 6, y: 0, w: 2, h: 2, color: 'bg-yellow-500' }
    ],
    registeredAttendees: [
      { id: 'a1', name: 'Rahul Sharma', email: 'rahul@example.com', rsvpCode: 'X7K2MQ9P', ticketType: 'VIP', status: 'Checked In', isAccessible: false },
      { id: 'a2', name: 'Priya Patel', email: 'priya@example.com', rsvpCode: 'A1B2C3D4', ticketType: 'General', status: 'Inside', isAccessible: true },
      { id: 'a3', name: 'Amit Singh', email: 'amit@example.com', rsvpCode: 'Z9Y8X7W6', ticketType: 'General', status: 'Not Arrived', isAccessible: false },
      { id: 'a4', name: 'Neha Gupta', email: 'neha@example.com', rsvpCode: 'M5N6O7P8', ticketType: 'Premium', status: 'Inside', isAccessible: true },
      { id: 'a5', name: 'Vikram Das', email: 'vikram@example.com', rsvpCode: 'Q1W2E3R4', ticketType: 'General', status: 'Left', isAccessible: false },
      { id: 'a6', name: 'Sanjay Kumar', email: 'sanjay@example.com', rsvpCode: 'T5Y6U7I8', ticketType: 'VIP', status: 'Inside', isAccessible: false },
      { id: 'a7', name: 'Anita Roy', email: 'anita@example.com', rsvpCode: 'P9O0I1U2', ticketType: 'General', status: 'Checked In', isAccessible: false },
      { id: 'a8', name: 'Ravi Verma', email: 'ravi@example.com', rsvpCode: 'L3K4J5H6', ticketType: 'Premium', status: 'Inside', isAccessible: false },
      { id: 'a9', name: 'Pooja Mishra', email: 'pooja@example.com', rsvpCode: 'G7F8D9S0', ticketType: 'General', status: 'Not Arrived', isAccessible: false },
      { id: 'a10', name: 'Arjun Reddy', email: 'arjun@example.com', rsvpCode: 'A2S3D4F5', ticketType: 'VIP', status: 'Inside', isAccessible: false },
      { id: 'a11', name: 'Kavita Iyer', email: 'kavita@example.com', rsvpCode: 'Z1X2C3V4', ticketType: 'General', status: 'Checked In', isAccessible: false },
      { id: 'a12', name: 'Deepak Joshi', email: 'deepak@example.com', rsvpCode: 'B5N6M7,8', ticketType: 'General', status: 'Inside', isAccessible: false }
    ],
    queues: [
      { id: 'q1', name: 'Coffee Stand A', zone: 'z6', waitTime: 12, depth: 8, status: 'Open' },
      { id: 'q2', name: 'Merch Tent', zone: 'z8', waitTime: 25, depth: 45, status: 'Busy' },
      { id: 'q3', name: 'Food Court A - Pizza', zone: 'z6', waitTime: 5, depth: 3, status: 'Open' },
      { id: 'q4', name: 'First Aid', zone: 'z7', waitTime: 0, depth: 0, status: 'Open' },
      { id: 'q5', name: 'Accessibility Desk', zone: 'z1', waitTime: 2, depth: 1, status: 'Open' },
      { id: 'q6', name: 'Parking Helpdesk', zone: 'z8', waitTime: 8, depth: 4, status: 'Open' }
    ],
    parkingZones: [
      { id: 'p1', name: 'North Lot', totalSpots: 500, spotsRemaining: 120, status: 'Filling Up' },
      { id: 'p2', name: 'South VIP Lot', totalSpots: 100, spotsRemaining: 5, status: 'Full' },
      { id: 'p3', name: 'East Lot', totalSpots: 800, spotsRemaining: 450, status: 'Available' },
      { id: 'p4', name: 'West Lot', totalSpots: 600, spotsRemaining: 50, status: 'Filling Up' }
    ],
    complaints: [
      { id: 'TKT-00341', category: 'Cleanliness', location: 'z2', description: 'Restroom needs cleaning', status: 'New', timestamp: '18:05', priority: false },
      { id: 'TKT-00342', category: 'Technical', location: 'z1', description: 'Screen glitching', status: 'In Progress', timestamp: '17:45', priority: false },
      { id: 'TKT-00343', category: 'Safety', location: 'z6', description: 'Overcrowding near food court', status: 'Acknowledged', timestamp: '18:10', priority: true }
    ],
    schedule: [
      { id: 's1', name: 'Gates Open', startTime: '16:00', endTime: '18:30', zone: 'All', capacity: 'N/A', category: 'Ceremonies' },
      { id: 's2', name: 'Pre-Match Show', startTime: '18:30', endTime: '19:15', zone: 'z5', capacity: 'Full', category: 'Main Stage' },
      { id: 's3', name: 'Match First Innings', startTime: '19:30', endTime: '21:00', zone: 'z5', capacity: 'Full', category: 'Main Stage' },
      { id: 's4', name: 'Fan Zone Meetup', startTime: '17:00', endTime: '18:00', zone: 'z6', capacity: 'Limited', category: 'Side Sessions' }
    ]
  },
  {
    id: 'evt-002',
    name: 'Pro Kabaddi Finals',
    date: '2026-06-15',
    time: '20:00',
    venue: 'NSCI Dome, Mumbai',
    totalCapacity: 8000,
    description: 'The highly anticipated Pro Kabaddi Finals.',
    gridZones: [
      { id: 'z1', name: 'Arena Seating', type: 'Seating', capacity: 7000, x: 1, y: 1, w: 6, h: 6, color: 'bg-gray-700' },
      { id: 'z2', name: 'Kabaddi Mat', type: 'Stage', capacity: 50, x: 3, y: 3, w: 2, h: 2, color: 'bg-primary' },
      { id: 'z3', name: 'Snack Bar', type: 'Food', capacity: 300, x: 0, y: 0, w: 2, h: 1, color: 'bg-orange-500' },
      { id: 'z4', name: 'Main Entrance', type: 'Exit', capacity: 1000, x: 3, y: 7, w: 2, h: 1, color: 'bg-yellow-500' },
      { id: 'z5', name: 'VIP Lounge', type: 'Seating', capacity: 200, x: 7, y: 3, w: 1, h: 2, color: 'bg-purple-500' },
      { id: 'z6', name: 'First Aid', type: 'Medical', capacity: 20, x: 0, y: 7, w: 1, h: 1, color: 'bg-green-500' }
    ],
    registeredAttendees: [
      { id: 'a1', name: 'Karan Singh', email: 'karan@example.com', rsvpCode: 'K8J7H6G5', ticketType: 'General', status: 'Checked In', isAccessible: false },
      { id: 'a2', name: 'Sunita Rao', email: 'sunita@example.com', rsvpCode: 'S4D5F6G7', ticketType: 'VIP', status: 'Inside', isAccessible: false },
      { id: 'a3', name: 'Tarun Bajaj', email: 'tarun@example.com', rsvpCode: 'T1Y2U3I4', ticketType: 'General', status: 'Not Arrived', isAccessible: false },
      { id: 'a4', name: 'Meera Menon', email: 'meera@example.com', rsvpCode: 'M9N8B7V6', ticketType: 'General', status: 'Inside', isAccessible: true },
      { id: 'a5', name: 'Rohan Deshmukh', email: 'rohan@example.com', rsvpCode: 'R5E4W3Q2', ticketType: 'General', status: 'Left', isAccessible: false },
      { id: 'a6', name: 'Sneha Patil', email: 'sneha@example.com', rsvpCode: 'S1A2L3K4', ticketType: 'General', status: 'Inside', isAccessible: false },
      { id: 'a7', name: 'Yash Sharma', email: 'yash@example.com', rsvpCode: 'Y7U8I9O0', ticketType: 'General', status: 'Checked In', isAccessible: false },
      { id: 'a8', name: 'Ananya Desai', email: 'ananya@example.com', rsvpCode: 'A3S4D5F6', ticketType: 'General', status: 'Inside', isAccessible: false },
      { id: 'a9', name: 'Sameer Khan', email: 'sameer@example.com', rsvpCode: 'S9D8F7G6', ticketType: 'General', status: 'Not Arrived', isAccessible: false }
    ],
    queues: [
      { id: 'q1', name: 'Entry Gate 1', zone: 'z4', waitTime: 15, depth: 30, status: 'Busy' },
      { id: 'q2', name: 'Entry Gate 2', zone: 'z4', waitTime: 5, depth: 10, status: 'Open' },
      { id: 'q3', name: 'Snack Bar', zone: 'z3', waitTime: 8, depth: 5, status: 'Open' },
      { id: 'q4', name: 'VIP Entry', zone: 'z5', waitTime: 1, depth: 0, status: 'Open' },
      { id: 'q5', name: 'Medical', zone: 'z6', waitTime: 0, depth: 0, status: 'Open' }
    ],
    parkingZones: [
      { id: 'p1', name: 'Main Lot', totalSpots: 300, spotsRemaining: 150, status: 'Available' },
      { id: 'p2', name: 'Street Parking', totalSpots: 100, spotsRemaining: 10, status: 'Filling Up' },
      { id: 'p3', name: 'VIP Lot', totalSpots: 50, spotsRemaining: 2, status: 'Full' }
    ],
    complaints: [
      { id: 'TKT-00401', category: 'Staff', location: 'z4', description: 'Need more scanning staff at Gate 1', status: 'New', timestamp: '19:45', priority: true },
      { id: 'TKT-00402', category: 'Accessibility', location: 'z1', description: 'Ramp access blocked', status: 'Resolved', timestamp: '19:00', priority: true }
    ],
    schedule: [
      { id: 's1', name: 'Gates Open', startTime: '18:00', endTime: '19:30', zone: 'All', capacity: 'N/A', category: 'Ceremonies' },
      { id: 's2', name: 'Match Start', startTime: '20:00', endTime: '21:30', zone: 'z2', capacity: 'Full', category: 'Main Stage' },
      { id: 's3', name: 'Trophy Presentation', startTime: '21:30', endTime: '22:00', zone: 'z2', capacity: 'Full', category: 'Main Stage' }
    ]
  }
];
