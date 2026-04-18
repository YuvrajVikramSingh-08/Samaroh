import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card, Badge, Button } from '../../components/Shared';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export const OrganiserComplaints = () => {
  const { id } = useParams();
  const { events, updateComplaintStatus } = useApp();
  const event = events.find(e => e.id === id);
  const [filter, setFilter] = useState('All');

  if (!event) return null;

  const filteredComplaints = event.complaints.filter(c => filter === 'All' || c.status === filter);

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-heading text-white">Complaint Management Centre</h2>
        <p className="text-gray-400">Track and resolve issues reported by attendees across the venue.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 text-center border-l-4 border-red-500">
          <p className="text-3xl font-bold text-white">{event.complaints.filter(c => c.status === 'New').length}</p>
          <p className="text-xs text-gray-400">New</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-orange-500">
          <p className="text-3xl font-bold text-white">{event.complaints.filter(c => c.status === 'Acknowledged').length}</p>
          <p className="text-xs text-gray-400">Acknowledged</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-blue-500">
          <p className="text-3xl font-bold text-white">{event.complaints.filter(c => c.status === 'In Progress').length}</p>
          <p className="text-xs text-gray-400">In Progress</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-green-500">
          <p className="text-3xl font-bold text-white">{event.complaints.filter(c => c.status === 'Resolved').length}</p>
          <p className="text-xs text-gray-400">Resolved</p>
        </Card>
      </div>

      <div className="flex gap-2 border-b border-gray-800 pb-2">
        {['All', 'New', 'Acknowledged', 'In Progress', 'Resolved'].map(f => (
          <button 
            key={f}
            className={`px-4 py-2 text-sm font-semibold transition-colors ${filter === f ? 'text-primary border-b-2 border-primary -mb-[9px]' : 'text-gray-500 hover:text-white'}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredComplaints.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No complaints found.</div>
        ) : (
          filteredComplaints.map(c => (
            <Card key={c.id} className={`border-l-4 ${c.priority ? 'border-red-500' : 'border-gray-700'}`}>
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1 rounded">{c.id}</span>
                    <Badge type="default">{c.category}</Badge>
                    {c.priority && <Badge type="danger">High Priority</Badge>}
                  </div>
                  <p className="text-white text-lg mb-1">{c.description}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <AlertTriangle size={14}/> Zone: {event.gridZones.find(z => z.id === c.location)?.name || c.location}
                    <Clock size={14} className="ml-2"/> {c.timestamp}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 w-full md:w-48">
                  <Badge type={
                    c.status === 'Resolved' ? 'success' : 
                    c.status === 'New' ? 'danger' : 
                    c.status === 'Acknowledged' ? 'warning' : 'primary'
                  }>{c.status}</Badge>
                  
                  {c.status !== 'Resolved' && (
                    <select 
                      className="mt-2 w-full bg-background border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-primary"
                      value={c.status}
                      onChange={(e) => updateComplaintStatus(id, c.id, e.target.value)}
                    >
                      <option disabled value="New">Update Status</option>
                      <option value="Acknowledged">Acknowledge</option>
                      <option value="In Progress">Mark In Progress</option>
                      <option value="Resolved">Mark Resolved</option>
                    </select>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
