import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const fetchData = async () => {
    const [
      { data: eventsData },
      { data: gridZones },
      { data: attendees },
      { data: queues },
      { data: parkingZones },
      { data: complaints },
      { data: schedules }
    ] = await Promise.all([
      supabase.from('events').select('*').order('created_at', { ascending: false }),
      supabase.from('grid_zones').select('*'),
      supabase.from('attendees').select('*'),
      supabase.from('queues').select('*'),
      supabase.from('parking_zones').select('*'),
      supabase.from('complaints').select('*'),
      supabase.from('schedule_items').select('*')
    ]);

    if (!eventsData) return;

    const nestedEvents = eventsData.map(ev => ({
      ...ev,
      gridZones: gridZones?.filter(z => z.event_id === ev.id).map(z => ({
        ...z, id: z.zone_id
      })) || [],
      registeredAttendees: attendees?.filter(a => a.event_id === ev.id).map(a => ({
        ...a, ticketType: a.ticket_type, rsvpCode: a.rsvp_code
      })) || [],
      queues: queues?.filter(q => q.event_id === ev.id).map(q => ({
        ...q, waitTime: q.wait_time
      })) || [],
      parkingZones: parkingZones?.filter(p => p.event_id === ev.id).map(p => ({
        ...p, totalSpots: p.total_spots, spotsRemaining: p.spots_remaining
      })) || [],
      complaints: complaints?.filter(c => c.event_id === ev.id) || [],
      schedule: schedules?.filter(s => s.event_id === ev.id).map(s => ({
        ...s, startTime: s.start_time, endTime: s.end_time
      })) || []
    }));

    setEvents(nestedEvents);
  };

  useEffect(() => {
    fetchData();

    const channel = supabase.channel('public-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addNotification = (message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Mutations with immediate UI refresh
  const submitComplaint = async (eventId, complaint, email) => {
    await supabase.from('complaints').insert({
      event_id: eventId,
      category: complaint.category,
      location: complaint.location,
      description: complaint.description,
      email: email,
      status: 'New'
    });
    await fetchData();
  };

  const updateComplaintStatus = async (eventId, complaintId, status) => {
    await supabase.from('complaints').update({ status }).eq('id', complaintId);
    await fetchData();
  };

  const addParkingZone = async (eventId, zone) => {
    await supabase.from('parking_zones').insert({
      event_id: eventId,
      name: zone.name,
      total_spots: zone.totalSpots,
      spots_remaining: zone.spotsRemaining,
      status: zone.status
    });
    await fetchData();
  };

  const updateParkingZone = async (eventId, zoneId, updates) => {
    const dbUpdates = {};
    if (updates.totalSpots !== undefined) dbUpdates.total_spots = updates.totalSpots;
    if (updates.spotsRemaining !== undefined) dbUpdates.spots_remaining = updates.spotsRemaining;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    
    await supabase.from('parking_zones').update(dbUpdates).eq('id', zoneId);
    await fetchData();
  };

  const addQueue = async (eventId, queue) => {
    await supabase.from('queues').insert({
      event_id: eventId,
      name: queue.name,
      zone: queue.zone,
      wait_time: queue.waitTime || 0,
      depth: queue.depth || 0,
      status: queue.status || 'Open'
    });
    await fetchData();
  };

  const updateQueueStatus = async (eventId, queueId, status) => {
    await supabase.from('queues').update({ status }).eq('id', queueId);
    await fetchData();
  };

  const advanceQueue = async (eventId, queueId) => {
    const q = events.find(e => e.id === eventId)?.queues.find(qu => qu.id === queueId);
    if (q) {
      await supabase.from('queues')
        .update({ depth: Math.max(0, q.depth - 1), wait_time: Math.max(0, q.waitTime - 2) })
        .eq('id', queueId);
      await fetchData();
    }
  };

  const flushQueue = async (eventId, queueId) => {
    await supabase.from('queues')
      .update({ depth: 0, wait_time: 0, status: 'Open' })
      .eq('id', queueId);
    await fetchData();
  };

  const addEvent = async (templateEventId) => {
    const template = events.find(e => e.id === templateEventId);
    if (!template) return;
    
    const { data, error } = await supabase.from('events').insert({
      name: `Copy of ${template.name}`,
      date: new Date().toISOString().split('T')[0],
      time: template.time,
      venue: template.venue,
      total_capacity: template.total_capacity || 0,
      description: template.description
    }).select().single();

    if (data) {
      const newEventId = data.id;
      
      // Duplicate Template Resources
      if (template.gridZones && template.gridZones.length > 0) {
        const zonesToInsert = template.gridZones.map(z => ({
          event_id: newEventId, zone_id: z.id, name: z.name, type: z.type, capacity: z.capacity, x: z.x, y: z.y, w: z.w, h: z.h, color: z.color
        }));
        await supabase.from('grid_zones').insert(zonesToInsert);
      }
      
      if (template.parkingZones && template.parkingZones.length > 0) {
         const pz = template.parkingZones.map(p => ({ event_id: newEventId, name: p.name, total_spots: p.totalSpots, spots_remaining: p.totalSpots, status: 'Available' }));
         await supabase.from('parking_zones').insert(pz);
      }
      
      if (template.queues && template.queues.length > 0) {
         const qs = template.queues.map(q => ({ event_id: newEventId, name: q.name, zone: q.zone, wait_time: 0, depth: 0, status: 'Open' }));
         await supabase.from('queues').insert(qs);
      }

      await fetchData();
      return newEventId;
    }
  };

  const updateMapZones = async (eventId, zones) => {
    await supabase.from('grid_zones').delete().eq('event_id', eventId);
    
    const insertData = zones.map(z => ({
      event_id: eventId,
      zone_id: z.id,
      name: z.name,
      type: z.type,
      capacity: z.capacity,
      x: z.x,
      y: z.y,
      w: z.w,
      h: z.h,
      color: z.color
    }));
    await supabase.from('grid_zones').insert(insertData);
    await fetchData();
  };

  const registerAttendee = async (email, rsvpCode, eventId) => {
    const { data } = await supabase.from('attendees').select('id').eq('email', email).eq('event_id', eventId).maybeSingle();
    if (!data) {
      await supabase.from('attendees').insert({
        event_id: eventId,
        name: email.split('@')[0],
        email,
        rsvp_code: rsvpCode,
        ticket_type: 'General',
        status: 'Checked In',
        is_accessible: false
      });
      await fetchData();
    }
  };

  const joinQueue = async (eventId, queueId) => {
    const q = events.find(e => e.id === eventId)?.queues.find(qu => qu.id === queueId);
    if (q) {
      await supabase.from('queues')
        .update({ depth: q.depth + 1, wait_time: q.waitTime + 2 })
        .eq('id', queueId);
        
      await fetchData();
        
      setTimeout(() => {
        addNotification(`🎉 You're up next at ${q.name} — head over now!`);
      }, 5000);
    }
  };

  const renameEvent = async (eventId, newName) => {
    await supabase.from('events').update({ name: newName }).eq('id', eventId);
    await fetchData();
  };

  const updateEventLocation = async (eventId, newVenue) => {
    await supabase.from('events').update({ venue: newVenue }).eq('id', eventId);
    await fetchData();
  };

  const addScheduleItem = async (eventId, item) => {
    await supabase.from('schedule_items').insert({
      event_id: eventId,
      name: item.name,
      start_time: item.startTime,
      end_time: item.endTime,
      category: item.category,
      zone: item.zone,
      capacity: parseInt(item.capacity) || 0
    });
    await fetchData();
  };

  const deleteScheduleItem = async (itemId) => {
    await supabase.from('schedule_items').delete().eq('id', itemId);
    await fetchData();
  };

  return (
    <AppContext.Provider value={{ 
      events, notifications, addNotification, submitComplaint, joinQueue,
      updateComplaintStatus, addParkingZone, updateParkingZone, addQueue,
      updateQueueStatus, advanceQueue, flushQueue, addEvent, updateMapZones, registerAttendee,
      renameEvent, updateEventLocation, addScheduleItem, deleteScheduleItem
    }}>
      {children}
    </AppContext.Provider>
  );
};
