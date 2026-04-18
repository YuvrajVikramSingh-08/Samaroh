import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card, Badge, Button } from '../../components/Shared';
import { Calendar, Plus, Trash2, Clock, MapPin, Users } from 'lucide-react';

export const OrganiserSchedule = () => {
  const { id } = useParams();
  const { events, addScheduleItem, deleteScheduleItem } = useApp();
  const event = events.find(e => e.id === id);

  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [category, setCategory] = useState('Main Event');
  const [zone, setZone] = useState('');
  const [capacity, setCapacity] = useState('500');

  if (!event) return null;

  // Set default zone if empty
  if (!zone && event.gridZones.length > 0) {
    setZone(event.gridZones[0].id);
  }

  const handleAdd = (e) => {
    e.preventDefault();
    if (name && startTime && endTime && category && zone) {
      addScheduleItem(id, { name, startTime, endTime, category, zone, capacity });
      setName('');
      // Keep other fields same for quick data entry
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-heading text-white">Event Schedule Manager</h2>
          <p className="text-gray-400">Add sub-events, performances, and timings. This reflects instantly for attendees.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <h3 className="font-heading text-xl text-white mb-4">Add Schedule Item</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Item Name / Title</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Opening Ceremony" className="w-full bg-background border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Start Time</label>
                  <input required type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full bg-background border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">End Time</label>
                  <input required type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full bg-background border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Category / Tag</label>
                <input required type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. VIP, Main Stage, Food" className="w-full bg-background border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Location / Zone</label>
                <select required value={zone} onChange={e => setZone(e.target.value)} className="w-full bg-background border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-primary">
                  {event.gridZones.map(z => (
                    <option key={z.id} value={z.id}>{z.name}</option>
                  ))}
                  <option value="Global">Global / Entire Venue</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Max Capacity</label>
                <input required type="number" value={capacity} onChange={e => setCapacity(e.target.value)} className="w-full bg-background border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-primary" />
              </div>
              <Button type="submit" className="w-full flex justify-center items-center gap-2 mt-4"><Plus size={16}/> Add to Schedule</Button>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-heading text-xl text-white mb-2">Live Schedule ({event.schedule?.length || 0})</h3>
          
          {event.schedule?.length === 0 ? (
             <div className="text-gray-500 text-center py-12 border border-gray-800 rounded bg-gray-900/50">
               No schedule items added yet.
             </div>
          ) : (
             <div className="space-y-3">
               {/* Sort by start time */}
               {[...event.schedule].sort((a,b) => a.startTime.localeCompare(b.startTime)).map(item => (
                 <Card key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                   <div>
                     <div className="flex items-center gap-2 mb-1">
                       <Badge type="primary">{item.category}</Badge>
                       <span className="text-xs text-gray-500 font-mono flex items-center gap-1"><Clock size={12}/> {item.startTime} - {item.endTime}</span>
                     </div>
                     <h4 className="text-lg font-bold text-white mb-1">{item.name}</h4>
                     <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                       <span className="flex items-center gap-1"><MapPin size={14}/> {event.gridZones.find(z => z.id === item.zone)?.name || item.zone}</span>
                       <span className="flex items-center gap-1"><Users size={14}/> Cap: {item.capacity}</span>
                     </div>
                   </div>
                   <Button onClick={() => deleteScheduleItem(item.id)} variant="danger" className="p-2 sm:px-4">
                     <span className="hidden sm:inline">Delete</span>
                     <Trash2 size={16} className="sm:hidden" />
                   </Button>
                 </Card>
               ))}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
