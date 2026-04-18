import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card, Badge, Button, Input } from '../../components/Shared';
import { List, Send } from 'lucide-react';

export const OrganiserAnnounce = () => {
  const { id } = useParams();
  const { events, addNotification } = useApp();
  const event = events.find(e => e.id === id);

  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([
    { id: 1, text: 'Welcome to the venue! Please check the map for directions.', time: '16:00' },
    { id: 2, text: 'Gates will open in 15 minutes.', time: '15:45' }
  ]);

  if (!event) return null;

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (message.trim()) {
      addNotification(`📢 ANNOUNCEMENT: ${message}`);
      setHistory([{ id: Date.now(), text: message, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }, ...history]);
      setMessage('');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-heading text-white">Announcement Broadcaster</h2>
        <p className="text-gray-400">Push live visual banners to all active attendee screens for this event.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-primary/50">
          <h3 className="font-heading text-xl text-white mb-4">Compose Message</h3>
          <form onSubmit={handleBroadcast} className="space-y-4">
            <div>
              <textarea 
                className="w-full bg-background border border-gray-700 rounded px-3 py-2 text-white focus:border-primary focus:outline-none h-32 resize-none"
                placeholder="Type your announcement here..."
                required
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full flex items-center justify-center gap-2">
              <Send size={16} /> Broadcast Now
            </Button>
          </form>
          <div className="mt-4 p-3 bg-gray-800 rounded border border-gray-700">
             <p className="text-xs text-gray-400 mb-1">Preview:</p>
             <div className="bg-primary text-white px-4 py-2 rounded-full text-sm text-center">
               📢 ANNOUNCEMENT: {message || 'Your message will appear like this'}
             </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-heading text-xl text-white mb-4 flex items-center gap-2"><List size={20}/> Broadcast History</h3>
          <div className="space-y-3">
            {history.map(item => (
              <div key={item.id} className="border-b border-gray-800 pb-3 last:border-0 last:pb-0">
                <p className="text-sm text-white mb-1">{item.text}</p>
                <p className="text-[10px] text-gray-500">{item.time} &bull; Delivered to all active devices</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
