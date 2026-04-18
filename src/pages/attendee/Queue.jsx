import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Card, Badge, Button } from '../../components/Shared';
import { Clock, Users, CheckCircle2 } from 'lucide-react';

export const AttendeeQueue = () => {
  const { user } = useAuth();
  const { events, joinQueue } = useApp();
  const event = events.find(e => e.id === user.eventId);
  const [queuedServices, setQueuedServices] = useState({}); // queueId -> true

  if (!event) return null;

  const handleJoin = (queueId) => {
    joinQueue(event.id, queueId);
    setQueuedServices(prev => ({ ...prev, [queueId]: true }));
  };

  const getWaitColor = (wait) => {
    if (wait < 5) return 'success';
    if (wait <= 15) return 'warning';
    return 'danger';
  };

  // Sort queues by wait time for the leaderboard
  const sortedQueues = [...event.queues].sort((a, b) => a.waitTime - b.waitTime);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-heading text-white mb-2">Smart Queue System</h2>
        <p className="text-gray-400">Join virtual queues to save time. We'll notify you when it's your turn.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {event.queues.map(q => {
            const isQueued = queuedServices[q.id];
            return (
              <Card key={q.id} className={`flex flex-col ${isQueued ? 'border-primary border' : ''}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{q.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Clock size={12}/> Est. Wait: {q.waitTime} min
                    </p>
                  </div>
                  <Badge type={q.status === 'Open' ? 'success' : q.status === 'Busy' ? 'warning' : 'danger'}>
                    {q.status}
                  </Badge>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1 text-gray-400">
                    <span>Queue Length</span>
                    <span>{q.depth} people</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div className="bg-gray-400 h-1.5 rounded-full" style={{ width: `${Math.min(100, (q.depth/50)*100)}%` }}></div>
                  </div>
                </div>

                <div className="mt-auto">
                  {isQueued ? (
                    <div className="bg-primary/10 border border-primary/30 p-3 rounded text-center">
                       <p className="text-primary text-sm font-semibold flex items-center justify-center gap-2 mb-1">
                         <CheckCircle2 size={16} /> You are in queue
                       </p>
                       <p className="text-xs text-gray-400">We will notify you soon!</p>
                    </div>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={() => handleJoin(q.id)}
                      disabled={q.status === 'Closed'}
                      variant={q.status === 'Closed' ? 'secondary' : 'primary'}
                    >
                      Join Queue
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <h3 className="font-heading text-xl text-white mb-4">Live Wait Times</h3>
            <div className="space-y-3">
              {sortedQueues.map((q, idx) => (
                <div key={`lb-${q.id}`} className="flex items-center justify-between p-2 rounded bg-background border border-gray-800 hover:border-gray-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600 font-bold w-4 text-right">{idx + 1}</span>
                    <div>
                      <p className="text-sm text-gray-200">{q.name}</p>
                      <p className="text-xs text-gray-500">Zone: {q.zone}</p>
                    </div>
                  </div>
                  <Badge type={getWaitColor(q.waitTime)}>
                    {q.waitTime} min
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
