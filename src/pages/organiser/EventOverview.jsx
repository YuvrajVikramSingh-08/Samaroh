import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card, Badge, Button } from '../../components/Shared';
import { Users, AlertCircle, Car, Activity, ThermometerSun } from 'lucide-react';

export const OrganiserEventOverview = () => {
  const { id } = useParams();
  const { events } = useApp();
  const event = events.find(e => e.id === id);

  const [heatmapType, setHeatmapType] = useState('crowd'); // crowd, wait, complaints

  if (!event) return null;

  const totalRegistered = event.registeredAttendees.length;
  const currentlyInside = event.registeredAttendees.filter(a => a.status === 'Inside').length;
  const openComplaints = event.complaints.filter(c => c.status !== 'Resolved').length;
  const spotsRemaining = event.parkingZones.reduce((acc, z) => acc + z.spotsRemaining, 0);
  const avgWaitTime = Math.floor(event.queues.reduce((acc, q) => acc + q.waitTime, 0) / (event.queues.length || 1));

  // Render Heatmap Grid
  const HeatmapGrid = () => {
    const cols = 10;
    const rows = 10;
    const cellSize = 100 / cols;

    const getIntensityColor = (zone) => {
      let val = 0;
      if (heatmapType === 'crowd') {
        const queuesHere = event.queues.filter(q => q.zone === zone.id);
        const depth = queuesHere.reduce((acc, q) => acc + q.depth, 0);
        val = Math.min(100, (depth / 50) * 100 + 20); // mock calculation
      } else if (heatmapType === 'wait') {
        const queuesHere = event.queues.filter(q => q.zone === zone.id);
        const maxWait = Math.max(0, ...queuesHere.map(q => q.waitTime));
        val = Math.min(100, (maxWait / 30) * 100);
      } else if (heatmapType === 'complaints') {
        const complaintsHere = event.complaints.filter(c => c.location === zone.id && c.status !== 'Resolved').length;
        val = Math.min(100, complaintsHere * 33);
      }

      if (val === 0) return 'transparent';
      if (val < 40) return 'rgba(34, 197, 94, 0.4)'; // green
      if (val < 70) return 'rgba(249, 115, 22, 0.5)'; // orange
      return 'rgba(239, 68, 68, 0.7)'; // red
    };

    return (
      <div className="relative w-full aspect-square bg-gray-900 border border-gray-700 rounded overflow-hidden shadow-inner">
        {/* Base Grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: `${cellSize}% ${cellSize}%`
        }} />

        {/* Zones with Heatmap overlay */}
        {event.gridZones.map(zone => {
          const color = getIntensityColor(zone);
          const isHigh = color.includes('239'); // red

          return (
            <div
              key={zone.id}
              className={`absolute border border-gray-800 transition-all duration-500 flex items-center justify-center p-1 ${isHigh ? 'animate-pulse ring-2 ring-red-500 z-10' : ''}`}
              style={{
                left: `${zone.x * cellSize}%`,
                top: `${zone.y * cellSize}%`,
                width: `${zone.w * cellSize}%`,
                height: `${zone.h * cellSize}%`,
                backgroundColor: color,
              }}
            >
              <span className="text-center font-bold text-[10px] text-white drop-shadow-md bg-black/30 px-1 rounded">
                {zone.name}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Live Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="flex flex-col items-center justify-center text-center p-4">
          <Users className="text-primary mb-2" size={24} />
          <span className="text-2xl font-bold text-white">{currentlyInside}</span>
          <span className="text-xs text-gray-400">Currently Inside</span>
        </Card>
        <Card className="flex flex-col items-center justify-center text-center p-4">
          <Activity className="text-warning mb-2" size={24} />
          <span className="text-2xl font-bold text-white">{totalRegistered}</span>
          <span className="text-xs text-gray-400">Total Registered</span>
        </Card>
        <Card className="flex flex-col items-center justify-center text-center p-4">
          <AlertCircle className="text-red-400 mb-2" size={24} />
          <span className="text-2xl font-bold text-white">{openComplaints}</span>
          <span className="text-xs text-gray-400">Open Complaints</span>
        </Card>
        <Card className="flex flex-col items-center justify-center text-center p-4">
          <ThermometerSun className="text-blue-400 mb-2" size={24} />
          <span className="text-2xl font-bold text-white">{avgWaitTime}m</span>
          <span className="text-xs text-gray-400">Avg Queue Wait</span>
        </Card>
        <Card className="flex flex-col items-center justify-center text-center p-4">
          <Car className="text-green-400 mb-2" size={24} />
          <span className="text-2xl font-bold text-white">{spotsRemaining}</span>
          <span className="text-xs text-gray-400">Parking Left</span>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading text-xl text-white">Live Heatmap Visualization</h3>
              <div className="flex gap-2">
                <Button variant={heatmapType === 'crowd' ? 'primary' : 'outline'} onClick={() => setHeatmapType('crowd')} className="text-xs py-1 px-2">Crowd</Button>
                <Button variant={heatmapType === 'wait' ? 'primary' : 'outline'} onClick={() => setHeatmapType('wait')} className="text-xs py-1 px-2">Wait Times</Button>
                <Button variant={heatmapType === 'complaints' ? 'primary' : 'outline'} onClick={() => setHeatmapType('complaints')} className="text-xs py-1 px-2">Complaints</Button>
              </div>
            </div>
            <HeatmapGrid />
            <div className="flex items-center gap-2 mt-4 text-xs text-gray-400 justify-end">
               <span>Low</span>
               <div className="w-24 h-2 bg-gradient-to-r from-green-500 via-orange-500 to-red-500 rounded"></div>
               <span>High</span>
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <Card>
             <h3 className="font-heading text-xl text-white mb-4">Urgent Attention Required</h3>
             {openComplaints > 0 ? (
               <div className="space-y-3">
                 {event.complaints.filter(c => c.status === 'New').slice(0,3).map(c => (
                   <div key={c.id} className="border border-red-500/30 bg-red-500/10 p-3 rounded">
                     <p className="text-sm text-white font-semibold flex justify-between">
                       {c.category} <Badge type="danger">New</Badge>
                     </p>
                     <p className="text-xs text-gray-300 mt-1">{c.description}</p>
                     <p className="text-[10px] text-gray-500 mt-2">Zone: {event.gridZones.find(z => z.id === c.location)?.name} &bull; {c.timestamp}</p>
                   </div>
                 ))}
               </div>
             ) : (
               <p className="text-gray-400 text-sm">All clear! No urgent items.</p>
             )}
          </Card>
        </div>
      </div>
    </div>
  );
};
