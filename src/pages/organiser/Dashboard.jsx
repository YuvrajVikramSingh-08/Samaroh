import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Badge, Button } from '../../components/Shared';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Users, MapPin, Plus, Edit2 } from 'lucide-react';

export const OrganiserDashboard = () => {
  const { events, addEvent, renameEvent, updateEventLocation } = useApp();
  const navigate = useNavigate();

  const handleCreateEvent = () => {
    // Duplicate the first event as a template
    if (!events || events.length === 0) return alert("No template events loaded yet!");
    const newId = addEvent(events[0].id);
    navigate(`/organiser/event/${newId}`);
  };

  const handleRename = (eventId, currentName) => {
    const newName = prompt("Enter new event name:", currentName);
    if (newName && newName.trim() !== currentName) {
      renameEvent(eventId, newName.trim());
    }
  };

  const handleRenameLocation = (eventId, currentVenue) => {
    const newVenue = prompt("Enter new location name or Google Maps address/link:", currentVenue);
    if (newVenue && newVenue.trim() !== currentVenue) {
      updateEventLocation(eventId, newVenue.trim());
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-heading text-white">Event Hub</h2>
          <p className="text-gray-400">Manage all your upcoming and active events.</p>
        </div>
        <Button onClick={handleCreateEvent} className="flex items-center gap-2"><Plus size={16}/> Create Event (Duplicate Template)</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-heading text-xl text-white mb-2">My Events</h3>
          {events.map(event => {
            const registered = event.registeredAttendees.length;
            const isLive = new Date(event.date) <= new Date() || true; // mock always live

            return (
              <Card key={event.id} className="hover:border-primary/50 transition-colors">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge type={isLive ? 'success' : 'default'}>{isLive ? 'Live Now' : 'Upcoming'}</Badge>
                      <span className="text-xs text-gray-500 font-mono">{event.id}</span>
                    </div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-xl font-bold text-white">{event.name}</h4>
                      <button onClick={() => handleRename(event.id, event.name)} className="text-gray-500 hover:text-white transition-colors" title="Rename Event">
                        <Edit2 size={14} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1"><Calendar size={14}/> {event.date} {event.time}</span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14}/> {event.venue}
                        <button onClick={() => handleRenameLocation(event.id, event.venue)} className="text-gray-500 hover:text-white transition-colors" title="Edit Location">
                          <Edit2 size={12}/>
                        </button>
                      </span>
                      <span className="flex items-center gap-1"><Users size={14}/> {registered} / {event.totalCapacity}</span>
                    </div>
                  </div>
                  <Link to={`/organiser/event/${event.id}`}>
                    <Button variant="outline">Manage Event</Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <Card className="h-full">
            <h3 className="font-heading text-xl text-white mb-4">Event Geographic Map</h3>
            <p className="text-xs text-gray-400 mb-4">Global view of all active venue locations.</p>
            {/* Mock Global Map */}
            <div className="w-full h-64 bg-gray-900 rounded overflow-hidden relative border border-gray-800">
              <img src="https://via.placeholder.com/400x300/111827/F1F5F9?text=Map+View" alt="Map View" className="w-full h-full object-cover opacity-30" />
              {/* Pins */}
              {events.map((e, idx) => (
                <div key={e.id} className="absolute flex flex-col items-center" style={{ top: `${30 + idx*20}%`, left: `${40 + idx*15}%` }}>
                  <div className="relative group cursor-pointer">
                    <div className="w-4 h-4 bg-primary rounded-full animate-ping absolute"></div>
                    <div className="w-4 h-4 bg-primary rounded-full relative z-10 border-2 border-background"></div>
                    
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gray-700">
                      {e.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
