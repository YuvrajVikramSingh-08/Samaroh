import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Card, Badge, Button } from '../../components/Shared';
import { Car, Navigation, MapPin } from 'lucide-react';

export const AttendeeParking = () => {
  const { user } = useAuth();
  const { events } = useApp();
  const event = events.find(e => e.id === user.eventId);
  
  const [reserved, setReserved] = useState(null); // parking zone id

  if (!event) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-heading text-white mb-2">Parking Navigation</h2>
        <p className="text-gray-400">Find and reserve available parking spots in real-time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {event.parkingZones.map(zone => {
            const isFull = zone.spotsRemaining === 0;
            const isReserved = reserved === zone.id;

            return (
              <Card key={zone.id} className={`${isReserved ? 'border-primary' : ''}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${isFull ? 'bg-red-500/20 text-red-500' : 'bg-primary/20 text-primary'}`}>
                      <Car size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{zone.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">{zone.spotsRemaining} / {zone.totalSpots} spots left</p>
                    </div>
                  </div>
                  <Badge type={isFull ? 'danger' : zone.status === 'Filling Up' ? 'warning' : 'success'}>
                    {zone.status}
                  </Badge>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" className="flex-1 flex items-center justify-center gap-2">
                    <Navigation size={16} /> Directions
                  </Button>
                  {isReserved ? (
                    <Button variant="secondary" className="flex-1" onClick={() => setReserved(null)}>
                      Cancel Reservation
                    </Button>
                  ) : (
                    <Button 
                      variant="primary" 
                      className="flex-1" 
                      disabled={isFull || reserved !== null}
                      onClick={() => setReserved(zone.id)}
                    >
                      {isFull ? 'Zone Full' : 'Reserve Spot'}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="space-y-6">
          <Card>
             <h3 className="font-heading text-xl text-white mb-4 flex items-center gap-2"><MapPin size={20} className="text-primary"/> Directions to Venue</h3>
             <div className="space-y-4 text-sm text-gray-300">
               <div className="flex gap-3">
                 <div className="flex flex-col items-center">
                   <div className="w-3 h-3 rounded-full bg-primary"></div>
                   <div className="w-0.5 h-full bg-gray-700 my-1"></div>
                 </div>
                 <div className="pb-4">
                   <p className="font-bold text-white">Enter via Main Gate</p>
                   <p className="text-gray-500 text-xs">Stay on the left lane for quicker access.</p>
                 </div>
               </div>
               <div className="flex gap-3">
                 <div className="flex flex-col items-center">
                   <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                 </div>
                 <div>
                   <p className="font-bold text-white">Follow signs to {reserved ? event.parkingZones.find(z => z.id === reserved)?.name : 'Parking'}</p>
                 </div>
               </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
