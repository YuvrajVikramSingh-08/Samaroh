import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Card, Button, Input, Badge } from '../../components/Shared';
import { AlertTriangle, Send } from 'lucide-react';

export const AttendeeReport = () => {
  const { user } = useAuth();
  const { events, submitComplaint } = useApp();
  const event = events.find(e => e.id === user.eventId);
  
  const [category, setCategory] = useState('Cleanliness');
  const [location, setLocation] = useState(event?.gridZones[0]?.id || '');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  if (!event) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (description) {
      submitComplaint(event.id, { category, location, description }, user.email);
      setTicketId(`TKT-${Math.floor(Math.random() * 10000)}`); // mock ID for UI confirmation
      setSubmitted(true);
      setDescription('');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div>
        <h2 className="text-3xl font-heading text-white mb-2">Report an Issue</h2>
        <p className="text-gray-400">Help us keep the venue safe and clean. Staff will be dispatched immediately.</p>
      </div>

      {submitted ? (
        <Card className="text-center py-12 border-primary">
           <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-primary w-8 h-8" />
           </div>
           <h3 className="text-2xl font-bold text-white mb-2">Issue Reported</h3>
           <p className="text-gray-400 mb-6">Thank you. Your ticket ID is <span className="text-primary font-mono bg-primary/10 px-2 py-1 rounded">{ticketId}</span></p>
           <Button onClick={() => setSubmitted(false)}>Report Another Issue</Button>
        </Card>
      ) : (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Category</label>
                <select 
                  className="w-full bg-background border border-gray-700 rounded px-3 py-2 text-white focus:border-primary focus:outline-none"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  {['Cleanliness', 'Safety', 'Staff', 'Technical', 'Accessibility', 'Other'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Location / Zone</label>
                <select 
                  className="w-full bg-background border border-gray-700 rounded px-3 py-2 text-white focus:border-primary focus:outline-none"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                >
                  {event.gridZones.map(z => (
                    <option key={z.id} value={z.id}>{z.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Description</label>
              <textarea 
                className="w-full bg-background border border-gray-700 rounded px-3 py-2 text-white focus:border-primary focus:outline-none h-32 resize-none"
                placeholder="Please describe the issue in detail..."
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full flex items-center justify-center gap-2">
              <Send size={16} /> Submit Report
            </Button>
          </form>
        </Card>
      )}

      <div className="pt-8">
        <h3 className="font-heading text-xl text-white mb-4">My Past Reports</h3>
        <div className="space-y-3">
          {event.complaints.filter(c => c.email === user.email).length === 0 ? (
            <p className="text-gray-500 text-sm">No reports submitted yet.</p>
          ) : (
            event.complaints.filter(c => c.email === user.email).map(c => (
              <Card key={c.id} className="flex justify-between items-center bg-background p-3">
                <div>
                  <p className="text-sm text-white font-semibold flex gap-2 items-center">
                    Report <Badge type={c.status === 'Resolved' ? 'success' : 'default'}>{c.status}</Badge>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{c.description.substring(0, 50)}...</p>
                </div>
                <span className="text-xs text-gray-600">
                  {new Date(c.timestamp || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
