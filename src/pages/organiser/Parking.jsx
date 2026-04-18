import React from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card, Badge, Button } from '../../components/Shared';
import { Car, AlertTriangle } from 'lucide-react';

export const OrganiserParking = () => {
  const { id } = useParams();
  const { events, addParkingZone, updateParkingZone } = useApp();
  const event = events.find(e => e.id === id);

  if (!event) return null;

  const handleAddZone = () => {
    const name = prompt("Enter Parking Zone Name:");
    if (!name) return;
    const capacity = parseInt(prompt("Enter Total Capacity:", "100"));
    if (isNaN(capacity)) return;
    
    addParkingZone(id, { name, totalSpots: capacity, spotsRemaining: capacity, status: 'Available' });
  };

  const handleEditCapacity = (zoneId, currentCapacity) => {
    const newCap = parseInt(prompt("Enter new capacity:", currentCapacity));
    if (!isNaN(newCap)) {
      updateParkingZone(id, zoneId, { totalSpots: newCap });
    }
  };

  const handleOverride = (zoneId, isFull) => {
    if (isFull) {
      updateParkingZone(id, zoneId, { spotsRemaining: 10, status: 'Filling Up' }); // Reopen
    } else {
      updateParkingZone(id, zoneId, { spotsRemaining: 0, status: 'Full' }); // Mark Full
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-heading text-white">Parking Manager</h2>
          <p className="text-gray-400">Monitor parking availability and manage zone closures.</p>
        </div>
        <Button onClick={handleAddZone} className="flex items-center gap-2"><Car size={16}/> Add Zone</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {event.parkingZones.map(zone => {
          const isFull = zone.spotsRemaining === 0;
          const fillPercent = Math.min(100, Math.floor(((zone.totalSpots - zone.spotsRemaining) / zone.totalSpots) * 100));

          return (
            <Card key={zone.id}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full ${isFull ? 'bg-red-500/20 text-red-500' : 'bg-primary/20 text-primary'}`}>
                    <Car size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{zone.name}</h3>
                    <Badge type={isFull ? 'danger' : zone.status === 'Filling Up' ? 'warning' : 'success'}>
                      {zone.status}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-sm text-gray-400">Spots Remaining</p>
                   <p className={`text-2xl font-bold ${isFull ? 'text-red-500' : 'text-white'}`}>{zone.spotsRemaining} <span className="text-sm text-gray-500 font-normal">/ {zone.totalSpots}</span></p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1 text-gray-400">
                  <span>Capacity Filled</span>
                  <span>{fillPercent}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all ${isFull ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${fillPercent}%` }}></div>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-800">
                 <Button onClick={() => handleEditCapacity(zone.id, zone.totalSpots)} variant="outline" className="flex-1 text-xs">Edit Capacity</Button>
                 <Button onClick={() => handleOverride(zone.id, isFull)} variant={isFull ? 'secondary' : 'danger'} className="flex-1 text-xs">
                    {isFull ? 'Reopen Zone' : 'Mark Full (Override)'}
                 </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
