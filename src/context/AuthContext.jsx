import React, { createContext, useContext, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('samaroh_user');
    return saved ? JSON.parse(saved) : null;
  });

  const loginOrganiser = (email) => {
    const u = { role: 'organiser', email };
    setUser(u);
    localStorage.setItem('samaroh_user', JSON.stringify(u));
  };

  const loginAttendee = async (email, rsvpCode, eventId) => {
    const { data, error } = await supabase
      .from('attendees')
      .select('*')
      .eq('email', email)
      .eq('rsvp_code', rsvpCode)
      .eq('event_id', eventId)
      .maybeSingle();

    if (data) {
      const u = { role: 'attendee', email, rsvpCode, eventId };
      setUser(u);
      localStorage.setItem('samaroh_user', JSON.stringify(u));
      return true;
    }
    if (error) console.error("Login failed:", error);
    return false;
  };

  const generateRsvpCode = async (email, eventId) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Check if they already exist
    const { data } = await supabase.from('attendees').select('*').eq('email', email).eq('event_id', eventId).maybeSingle();
    
    if (!data) {
       const { error } = await supabase.from('attendees').insert({
          event_id: eventId,
          name: email.split('@')[0],
          email,
          rsvp_code: code,
          ticket_type: 'General',
          status: 'Checked In',
          is_accessible: false
       });
       if (error) {
           console.error("Generate failed:", error);
           alert("Could not generate code. " + error.message);
           return null;
       }
    } else {
       code = data.rsvp_code;
    }
    
    return code;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('samaroh_user');
  };

  return (
    <AuthContext.Provider value={{ user, loginOrganiser, loginAttendee, logout, generateRsvpCode }}>
      {children}
    </AuthContext.Provider>
  );
};
