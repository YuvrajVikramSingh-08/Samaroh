import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Card, Button, Input } from '../components/Shared';
import { KeyRound, Ticket, Building, ChevronDown } from 'lucide-react';

export const Login = () => {
  const [activeTab, setActiveTab] = useState('attendee'); // attendee, organiser, generate
  const { user, loginAttendee, loginOrganiser, generateRsvpCode } = useAuth();
  const { events } = useApp();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      if (user.role === 'attendee') navigate('/attendee/dashboard');
      if (user.role === 'organiser') navigate('/organiser/dashboard');
    }
  }, [user, navigate]);

  // Attendee Form State
  const [attEmail, setAttEmail] = useState('');
  const [attCode, setAttCode] = useState('');
  const [attEvent, setAttEvent] = useState(events[0]?.id || '');
  const [attError, setAttError] = useState('');

  // Organiser Form State
  const [orgEmail, setOrgEmail] = useState('tester@samaroh.com');
  const [orgPass, setOrgPass] = useState('Samaroh2024!');

  // Generate Code State
  const [genEmail, setGenEmail] = useState('');
  const [genEvent, setGenEvent] = useState('');
  const [generated, setGenerated] = useState(null);

  // Sync state once events load
  React.useEffect(() => {
    if (events && events.length > 0) {
      if (!attEvent) setAttEvent(events[0].id);
      if (!genEvent) setGenEvent(events[0].id);
    }
  }, [events]);

  const handleAttendeeLogin = async (e) => {
    e.preventDefault();
    setAttError('');
    
    const success = await loginAttendee(attEmail, attCode, attEvent);
    if (success) {
      navigate('/attendee/dashboard');
    } else {
      setAttError('Invalid Email or RSVP Code for this event.');
    }
  };

  const handleOrganiserLogin = async (e) => {
    e.preventDefault();
    if (orgEmail && orgPass) {
      const success = await loginOrganiser(orgEmail, orgPass);
      if (success) {
        navigate('/organiser/dashboard');
      } else {
        alert("Invalid email or password. Please make sure the test account is created in Supabase.");
      }
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (genEmail && genEvent) {
      const code = await generateRsvpCode(genEmail, genEvent);
      if (code) {
        setGenerated(code);
        setAttEmail(genEmail);
        setAttCode(code);
        setAttEvent(genEvent);
        setTimeout(() => setActiveTab('attendee'), 1500);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-orange-500/10 rounded-full blur-[100px]" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <h1 className="font-heading text-5xl text-primary tracking-wider mb-2">SAMAROH</h1>
          <p className="text-text-muted font-body">Event Management Platform</p>
        </div>

        <Card className="!p-8">
          <div className="flex border-b border-gray-700 mb-6">
            <button
              className={`flex-1 pb-3 text-center font-semibold transition-colors ${activeTab === 'attendee' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('attendee')}
            >
              <Ticket className="inline w-4 h-4 mr-2" />
              Attendee
            </button>
            <button
              className={`flex-1 pb-3 text-center font-semibold transition-colors ${activeTab === 'organiser' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('organiser')}
            >
              <Building className="inline w-4 h-4 mr-2" />
              Organiser
            </button>
          </div>

          {activeTab === 'attendee' && (
            <form onSubmit={handleAttendeeLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Registered Email</label>
                <Input type="email" required value={attEmail} onChange={e => setAttEmail(e.target.value)} placeholder="name@example.com" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">RSVP Code</label>
                <Input type="text" required value={attCode} onChange={e => setAttCode(e.target.value.toUpperCase())} placeholder="e.g. X7K2MQ9P" className="uppercase text-gray-900 bg-gray-200" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Select Event</label>
                <div className="relative">
                  <select 
                    className="w-full bg-background border border-gray-700 rounded px-3 py-2 text-white appearance-none focus:outline-none focus:border-primary"
                    value={attEvent}
                    onChange={e => setAttEvent(e.target.value)}
                  >
                    {events.map(ev => (
                      <option key={ev.id} value={ev.id}>{ev.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              {attError && <p className="text-warning text-sm">{attError}</p>}
              <Button type="submit" className="w-full mt-2">Enter Event</Button>
            </form>
          )}

          {activeTab === 'organiser' && (
            <form onSubmit={handleOrganiserLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Company Email</label>
                <Input type="email" required value={orgEmail} onChange={e => setOrgEmail(e.target.value)} placeholder="admin@samaroh.com" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Password</label>
                <Input type="password" required value={orgPass} onChange={e => setOrgPass(e.target.value)} placeholder="••••••••" />
              </div>
              <p className="text-xs text-gray-500 text-center">
                Testing the app? Use <strong className="text-gray-400">tester@samaroh.com</strong> / <strong className="text-gray-400">Samaroh2024!</strong>
              </p>
              <Button type="submit" className="w-full mt-2">Access Dashboard</Button>
            </form>
          )}
        </Card>

        {/* Floating Generator Button */}
        <div className="mt-8 text-center">
          {activeTab === 'generate' ? (
            <Card className="!p-6 border-primary/50 border bg-gray-900 shadow-xl">
              <h3 className="text-primary font-heading tracking-wide text-xl mb-4 text-left">Generate RSVP Code</h3>
              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1 text-left">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={genEmail} 
                    onChange={e => setGenEmail(e.target.value)} 
                    placeholder="Enter your email" 
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1 text-left">Select Event</label>
                  <div className="relative">
                    <select 
                      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white appearance-none text-sm focus:outline-none focus:border-primary"
                      value={genEvent}
                      onChange={e => setGenEvent(e.target.value)}
                    >
                      {events.map(ev => (
                        <option key={ev.id} value={ev.id}>{ev.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <Button type="submit" className="w-full mt-2 text-sm py-3">Generate & Fill</Button>
                {generated && (
                  <div className="bg-green-500/20 text-green-400 p-2 rounded text-center text-lg tracking-widest font-mono mt-2">
                    {generated}
                  </div>
                )}
                <button type="button" onClick={() => setActiveTab('attendee')} className="text-xs text-gray-500 hover:text-gray-300 w-full pt-2">
                  Close Generator
                </button>
              </form>
            </Card>
          ) : (
            <button 
              onClick={() => setActiveTab('generate')}
              className="text-primary/60 hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto text-sm"
            >
              <KeyRound className="w-4 h-4" /> Need an RSVP code for testing?
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
