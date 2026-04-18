import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { AttendeeLayout } from './components/AttendeeLayout';
import { OrganiserLayout } from './components/OrganiserLayout';

import { AttendeeDashboard } from './pages/attendee/Dashboard';
import { AttendeeQueue } from './pages/attendee/Queue';
import { AttendeeMap } from './pages/attendee/Map';
import { AttendeeParking } from './pages/attendee/Parking';
import { AttendeeSchedule } from './pages/attendee/Schedule';
import { AttendeeReport } from './pages/attendee/Report';

import { OrganiserDashboard } from './pages/organiser/Dashboard';
import { OrganiserEventOverview } from './pages/organiser/EventOverview';
import { OrganiserMapEditor } from './pages/organiser/MapEditor';
import { OrganiserAttendees } from './pages/organiser/Attendees';
import { OrganiserComplaints } from './pages/organiser/Complaints';
import { OrganiserQueues } from './pages/organiser/Queues';
import { OrganiserParking } from './pages/organiser/Parking';
import { OrganiserAnnounce } from './pages/organiser/Announce';
import { OrganiserSchedule } from './pages/organiser/Schedule';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      
      {/* Attendee Routes */}
      <Route element={<AttendeeLayout />}>
        <Route path="/attendee/dashboard" element={<AttendeeDashboard />} />
        <Route path="/attendee/queue" element={<AttendeeQueue />} />
        <Route path="/attendee/map" element={<AttendeeMap />} />
        <Route path="/attendee/parking" element={<AttendeeParking />} />
        <Route path="/attendee/schedule" element={<AttendeeSchedule />} />
        <Route path="/attendee/report" element={<AttendeeReport />} />
      </Route>

      {/* Organiser Routes */}
      <Route element={<OrganiserLayout />}>
        <Route path="/organiser/dashboard" element={<OrganiserDashboard />} />
        <Route path="/organiser/event/:id" element={<OrganiserEventOverview />} />
        <Route path="/organiser/event/:id/map" element={<OrganiserMapEditor />} />
        <Route path="/organiser/event/:id/attendees" element={<OrganiserAttendees />} />
        <Route path="/organiser/event/:id/complaints" element={<OrganiserComplaints />} />
        <Route path="/organiser/event/:id/queues" element={<OrganiserQueues />} />
        <Route path="/organiser/event/:id/parking" element={<OrganiserParking />} />
        <Route path="/organiser/event/:id/schedule" element={<OrganiserSchedule />} />
        <Route path="/organiser/event/:id/announce" element={<OrganiserAnnounce />} />
      </Route>
    </Routes>
  );
}

export default App;
