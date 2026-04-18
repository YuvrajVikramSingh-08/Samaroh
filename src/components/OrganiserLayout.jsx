import React from 'react';
import { Outlet, Navigate, Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Banner } from './Shared';
import { LogOut, Home, LayoutDashboard, Map as MapIcon, Users, AlertCircle, List, Navigation, Radio, Calendar } from 'lucide-react';

export const OrganiserLayout = () => {
  const { user, logout } = useAuth();
  const { events } = useApp();
  const { id } = useParams();
  
  if (!user || user.role !== 'organiser') {
    return <Navigate to="/" replace />;
  }

  const activeEvent = id ? events.find(e => e.id === id) : null;

  const eventNavItems = id ? [
    { name: 'Overview', path: `/organiser/event/${id}`, icon: <LayoutDashboard size={18} /> },
    { name: 'Map Editor', path: `/organiser/event/${id}/map`, icon: <MapIcon size={18} /> },
    { name: 'Attendees', path: `/organiser/event/${id}/attendees`, icon: <Users size={18} /> },
    { name: 'Complaints', path: `/organiser/event/${id}/complaints`, icon: <AlertCircle size={18} /> },
    { name: 'Queues', path: `/organiser/event/${id}/queues`, icon: <List size={18} /> },
    { name: 'Parking', path: `/organiser/event/${id}/parking`, icon: <Navigation size={18} /> },
    { name: 'Schedule', path: `/organiser/event/${id}/schedule`, icon: <Calendar size={18} /> },
    { name: 'Broadcaster', path: `/organiser/event/${id}/announce`, icon: <Radio size={18} /> },
  ] : [];

  return (
    <div className="min-h-screen flex flex-col bg-background text-text font-body">
      <Banner />
      <header className="border-b border-gray-800 p-4 flex justify-between items-center bg-background-lighter">
        <div className="flex items-center gap-6">
          <h1 className="font-heading text-2xl text-primary tracking-wide">SAMAROH OP-CENTER</h1>
          {activeEvent && (
            <span className="bg-gray-800 px-3 py-1 rounded text-sm text-gray-300">
              {activeEvent.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{user.email}</span>
          <button onClick={logout} className="text-gray-400 hover:text-white transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-gray-800 bg-background-lighter p-4 gap-4 flex flex-col">
          <Link to="/organiser/dashboard" className="flex items-center gap-3 p-2 rounded hover:bg-gray-800 text-gray-300">
            <Home size={18} />
            <span>All Events</span>
          </Link>
          
          {id && (
            <div className="pt-4 border-t border-gray-800">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2 px-2">Event Management</p>
              {eventNavItems.map(item => (
                <Link key={item.path} to={item.path} className="flex items-center gap-3 p-2 rounded hover:bg-gray-800 text-gray-300 transition-colors">
                  {item.icon}
                  <span className="text-sm">{item.name}</span>
                </Link>
              ))}
            </div>
          )}
        </aside>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
