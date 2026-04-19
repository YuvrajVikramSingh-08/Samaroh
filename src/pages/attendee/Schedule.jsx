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

  const generateGoogleCalendarUrl = (item) => {
    const baseUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE";
    const text = encodeURIComponent(item.name);
    const details = encodeURIComponent(`Category: ${item.category}`);
    const location = encodeURIComponent(`${event.venue} (Zone: ${item.zone})`);
    return `${baseUrl}&text=${text}&details=${details}&location=${location}`;
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
                <div className="flex flex-col gap-2 md:items-end w-full md:w-auto">
                  <Button 
                    variant={reminders[item.id] ? 'secondary' : 'outline'} 
                    className="flex items-center justify-center gap-2 w-full"
                    onClick={() => toggleReminder(item.id)}
                  >
                    <Bell size={16} className={reminders[item.id] ? 'text-primary' : ''} /> 
                    {reminders[item.id] ? 'Reminder Set' : 'Remind Me'}
                  </Button>
                  <a 
                    href={generateGoogleCalendarUrl(item)} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full text-xs bg-white text-black py-2 px-3 rounded font-semibold hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.36,22 12.2,22C17.53,22 22,18.33 22,12.08C22,11.37 21.89,10.63 21.89,10.63Z" /></svg>
                    Add to Calendar
                  </a>
                </div>
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
