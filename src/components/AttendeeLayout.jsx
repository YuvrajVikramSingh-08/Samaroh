import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Banner } from './Shared';
import { LogOut, Home, List, Map as MapIcon, Navigation, Calendar, AlertTriangle } from 'lucide-react';

export const AttendeeLayout = () => {
  const { user, logout } = useAuth();
  
  if (!user || user.role !== 'attendee') {
    return <Navigate to="/" replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/attendee/dashboard', icon: <Home size={20} /> },
    { name: 'Smart Queue', path: '/attendee/queue', icon: <List size={20} /> },
    { name: 'Venue Map', path: '/attendee/map', icon: <MapIcon size={20} /> },
    { name: 'Parking', path: '/attendee/parking', icon: <Navigation size={20} /> },
    { name: 'Schedule', path: '/attendee/schedule', icon: <Calendar size={20} /> },
    { name: 'Report Issue', path: '/attendee/report', icon: <AlertTriangle size={20} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-text font-body">
      <Banner />
      <header className="border-b border-gray-800 p-4 flex justify-between items-center bg-background-lighter">
        <h1 className="font-heading text-2xl text-primary tracking-wide">SAMAROH</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{user.email}</span>
          <button onClick={logout} className="text-gray-400 hover:text-white transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </header>
      
      {/* Mobile-first Navigation (bottom bar on small screens) */}
      <nav className="fixed bottom-0 w-full bg-background-lighter border-t border-gray-800 md:static md:w-auto md:border-none p-2 z-40 md:hidden">
        <div className="flex justify-around">
          {navItems.map(item => (
            <Link key={item.path} to={item.path} className="flex flex-col items-center p-2 text-gray-400 hover:text-primary transition-colors">
              {item.icon}
              <span className="text-[10px] mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Desktop Navigation */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:flex flex-col w-64 border-r border-gray-800 bg-background-lighter p-4 gap-2">
          {navItems.map(item => (
            <Link key={item.path} to={item.path} className="flex items-center gap-3 p-3 rounded hover:bg-gray-800 text-gray-300 hover:text-white transition-colors">
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </aside>
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
