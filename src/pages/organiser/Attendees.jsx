import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card, Badge, Button, Input } from '../../components/Shared';
import { Search, Download, Accessibility } from 'lucide-react';

export const OrganiserAttendees = () => {
  const { id } = useParams();
  const { events } = useApp();
  const event = events.find(e => e.id === id);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  if (!event) return null;

  const filteredAttendees = event.registeredAttendees.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || a.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading text-white">Attendee Registry</h2>
          <p className="text-gray-400">Manage all {event.registeredAttendees.length} registered guests.</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2"><Download size={16}/> Export CSV</Button>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 text-gray-500 w-5 h-5" />
            <Input 
              type="text" 
              placeholder="Search by name or email..." 
              className="pl-10"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {['All', 'Not Arrived', 'Checked In', 'Inside', 'Left'].map(f => (
              <button 
                key={f}
                className={`whitespace-nowrap px-3 py-1.5 rounded text-sm font-semibold transition-colors ${filter === f ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs text-gray-500 uppercase bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 rounded-tl">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Ticket</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 rounded-tr">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendees.map((attendee, idx) => (
                <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                    {attendee.name}
                    {attendee.isAccessible && <Accessibility size={14} className="text-teal-400" title="Accessibility Needs" />}
                  </td>
                  <td className="px-6 py-4">{attendee.email}</td>
                  <td className="px-6 py-4"><Badge type={attendee.ticketType === 'VIP' ? 'warning' : 'primary'}>{attendee.ticketType}</Badge></td>
                  <td className="px-6 py-4">
                    <Badge type={attendee.status === 'Inside' ? 'success' : attendee.status === 'Left' ? 'danger' : 'default'}>
                      {attendee.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-primary hover:underline text-xs">Edit Status</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAttendees.length === 0 && (
            <div className="text-center py-8 text-gray-500">No attendees found matching criteria.</div>
          )}
        </div>
      </Card>
    </div>
  );
};
