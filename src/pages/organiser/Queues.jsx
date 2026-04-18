import React from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card, Badge, Button } from '../../components/Shared';
import { List, Settings2 } from 'lucide-react';

export const OrganiserQueues = () => {
  const { id } = useParams();
  const { events, addQueue, updateQueueStatus, advanceQueue, flushQueue } = useApp();
  const event = events.find(e => e.id === id);

  if (!event) return null;

  const handleAddService = () => {
    const name = prompt("Enter Service/Queue Name:");
    if (!name) return;
    const zone = prompt("Enter Zone ID (e.g. z6):", "z1");
    if (!zone) return;
    addQueue(id, { name, zone, waitTime: 0, depth: 0, status: 'Open' });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-heading text-white">Service & Queue Manager</h2>
          <p className="text-gray-400">Monitor and control wait times and queue statuses across the venue.</p>
        </div>
        <Button onClick={handleAddService} className="flex items-center gap-2"><List size={16}/> Add Service</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {event.queues.map(q => (
          <Card key={q.id}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{q.name}</h3>
                <p className="text-xs text-gray-400">Zone: {event.gridZones.find(z => z.id === q.zone)?.name || q.zone}</p>
              </div>
              <Badge type={q.status === 'Open' ? 'success' : q.status === 'Busy' ? 'warning' : 'danger'}>
                {q.status}
              </Badge>
            </div>
            
            <div className="flex justify-between items-end mb-4 bg-background p-3 rounded border border-gray-800">
               <div>
                 <p className="text-sm text-gray-400">Current Depth</p>
                 <p className="text-2xl font-bold text-white">{q.depth}</p>
               </div>
               <div className="text-right">
                 <p className="text-sm text-gray-400">Est. Wait</p>
                 <p className="text-2xl font-bold text-primary">{q.waitTime}m</p>
               </div>
            </div>

            <div className="space-y-2">
               <label className="block text-xs text-gray-500 mb-1">Set Status Override</label>
               <select 
                 className="w-full bg-background border border-gray-700 rounded px-3 py-2 text-sm text-white" 
                 value={q.status}
                 onChange={(e) => updateQueueStatus(id, q.id, e.target.value)}
               >
                 <option value="Open">Open</option>
                 <option value="Busy">Busy</option>
                 <option value="Closed">Closed</option>
               </select>
               <div className="flex gap-2 mt-2">
                  <Button onClick={() => advanceQueue(id, q.id)} variant="outline" className="flex-1 text-xs">Advance Queue</Button>
                  <Button onClick={() => flushQueue(id, q.id)} variant="danger" className="flex-1 text-xs">Flush Queue</Button>
               </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
