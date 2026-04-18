import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Card, Badge, Button } from '../../components/Shared';
import { Calendar as CalendarIcon, Clock, MapPin, Bell } from 'lucide-react';

export const AttendeeSchedule = () => {
  const { user } = useAuth();
  const { events } = useApp();
  const event = events.find(e => e.id === user.eventId);
  
  const [activeTab, setActiveTab] = useState('All');
  const [reminders, setReminders] = useState({});

  if (!event) return null;

  const categories = ['All', ...new Set(event.schedule.map(s => s.category))];

  const filteredSchedule = activeTab === 'All' 
    ? event.schedule 
    : event.schedule.filter(s => s.category === activeTab);

  const toggleReminder = (id) => {
    setReminders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-heading text-white mb-2">Event Schedule</h2>
        <p className="text-gray-400">Don't miss out on the action. Set reminders for your favorite sub-events.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button 
            key={cat}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === cat ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="relative border-l border-gray-700 ml-4 space-y-8 pb-8 mt-6">
        {filteredSchedule.map((item, idx) => (
          <div key={item.id} className="relative pl-6">
            <div className="absolute w-3 h-3 bg-primary rounded-full -left-[6.5px] top-2 shadow-[0_0_10px_#E8006F]" />
            <Card className="w-full">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge type="primary">{item.category}</Badge>
                    <span className="text-xs text-gray-500 font-mono">{item.startTime} - {item.endTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1"><MapPin size={14}/> Zone: {event.gridZones.find(z => z.id === item.zone)?.name || item.zone}</span>
                    <span className="flex items-center gap-1"><Users size={14}/> Capacity: {item.capacity}</span>
                  </div>
                </div>
                <Button 
                  variant={reminders[item.id] ? 'secondary' : 'outline'} 
                  className="flex items-center justify-center gap-2 md:w-auto w-full"
                  onClick={() => toggleReminder(item.id)}
                >
                  <Bell size={16} className={reminders[item.id] ? 'text-primary' : ''} /> 
                  {reminders[item.id] ? 'Reminder Set' : 'Remind Me'}
                </Button>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

// Dummy users icon for capacity
const Users = ({size}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
