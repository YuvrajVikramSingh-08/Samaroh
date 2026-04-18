import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Card, Button, Badge } from '../../components/Shared';
import { Navigation, Accessibility, Search } from 'lucide-react';

export const AttendeeMap = () => {
  const { user } = useAuth();
  const { events } = useApp();
  const event = events.find(e => e.id === user.eventId);
  
  const [accessMode, setAccessMode] = useState(false);
  const [highlightedZone, setHighlightedZone] = useState(null);

  if (!event) return null;

  // Render SVG Grid based on zones
  const GridMap = () => {
    const cols = 10;
    const rows = 10;
    const cellSize = 100 / cols;

    return (
      <div className="relative w-full aspect-square bg-gray-900 border border-gray-700 rounded overflow-hidden shadow-inner">
        {/* Base Grid Lines */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: `${cellSize}% ${cellSize}%`
        }} />

        {/* Zones */}
        {event.gridZones.map(zone => {
          const isHighlighted = highlightedZone === zone.id;
          const isAccessImportant = accessMode && ['Medical', 'Exit'].includes(zone.type);
          
          return (
            <div
              key={zone.id}
              className={`absolute border transition-all duration-300 flex flex-col items-center justify-center p-2 cursor-pointer
                ${isHighlighted ? 'ring-4 ring-primary ring-offset-2 ring-offset-gray-900 z-10' : 'border-gray-800'}
                ${isAccessImportant ? 'bg-teal-500/40 border-teal-400 border-2 z-10' : zone.color}
              `}
              style={{
                left: `${zone.x * cellSize}%`,
                top: `${zone.y * cellSize}%`,
                width: `${zone.w * cellSize}%`,
                height: `${zone.h * cellSize}%`,
              }}
              onClick={() => setHighlightedZone(zone.id)}
            >
              <span className={`text-center font-semibold drop-shadow-md transition-all ${accessMode ? 'text-lg text-white' : 'text-xs text-gray-200'}`}>
                {zone.name}
              </span>
              {zone.type === 'Food' && (
                <div className="flex gap-1 mt-1 flex-wrap justify-center">
                  <div className="w-3 h-3 bg-red-600 rounded-sm shadow-md" title="Domino's"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-sm shadow-md" title="Burger King"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-sm shadow-md" title="Subway"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const selectedZoneDetails = event.gridZones.find(z => z.id === highlightedZone);

  const generateDirections = (targetZone) => {
    if (!targetZone) return null;
    const currentLoc = { x: 4, y: 4, name: 'Center Concourse' }; // Mock current location
    
    let instructions = `Starting from ${currentLoc.name}: `;
    const dx = targetZone.x - currentLoc.x;
    const dy = targetZone.y - currentLoc.y;
    
    if (dy < 0) instructions += `Walk North for ${Math.abs(dy) * 50}m. `;
    if (dy > 0) instructions += `Walk South for ${Math.abs(dy) * 50}m. `;
    if (dx < 0) instructions += `Turn West and continue for ${Math.abs(dx) * 50}m. `;
    if (dx > 0) instructions += `Turn East and continue for ${Math.abs(dx) * 50}m. `;
    
    // Landmark addition
    if (targetZone.type === 'Food') {
       instructions += `You will see the food stalls ahead. Take a right from Domino's if you need the washroom.`;
    } else if (targetZone.type === 'Medical') {
       instructions += `Look for the green cross signs.`;
    } else {
       instructions += `You have arrived at ${targetZone.name}.`;
    }
    return instructions;
  };

  return (
    <div className="space-y-6 animate-fade-in flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading text-white">Interactive Venue Map</h2>
          <p className="text-gray-400">Find your way around the venue</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={accessMode ? 'primary' : 'secondary'} 
            onClick={() => setAccessMode(!accessMode)}
            className="flex items-center gap-2"
          >
            <Accessibility size={16} /> 
            {accessMode ? 'Access Mode On' : 'Access Mode Off'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        <div className="lg:col-span-3">
          <Card className="h-full flex flex-col p-2">
            <div className="flex justify-between items-center mb-4 px-2">
              <div className="flex gap-2 text-sm text-gray-400">
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-700 rounded-sm"></div> Seating</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-primary rounded-sm"></div> Stage</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-500 rounded-sm"></div> Food</span>
              </div>
              <div className="relative">
                <Search size={16} className="absolute left-2 top-2 text-gray-500" />
                <input type="text" placeholder="Search zone..." className="bg-background border border-gray-700 rounded pl-8 pr-3 py-1 text-sm text-white focus:border-primary focus:outline-none" />
              </div>
            </div>
            <GridMap />
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <Card>
            <h3 className="font-heading text-xl text-white mb-4">Quick Locators</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full flex items-center justify-start gap-2" onClick={() => setHighlightedZone('z6')}>
                <Navigation size={16}/> Nearest Washroom
              </Button>
              <Button variant="outline" className="w-full flex items-center justify-start gap-2" onClick={() => setHighlightedZone('z1')}>
                <Navigation size={16}/> My Seat (North Stand)
              </Button>
              <Button variant="outline" className="w-full flex items-center justify-start gap-2" onClick={() => setHighlightedZone('z7')}>
                <Navigation size={16}/> Medical Post
              </Button>
            </div>
          </Card>

          {selectedZoneDetails && (
            <Card className="border-primary transition-all animate-fade-in">
              <h3 className="font-heading text-lg text-primary mb-2">{selectedZoneDetails.name}</h3>
              <div className="space-y-2 text-sm text-gray-300 mb-4">
                <p>Type: <Badge>{selectedZoneDetails.type}</Badge></p>
                <p>Capacity: {selectedZoneDetails.capacity} people</p>
                <p>Current Occupancy: ~{Math.floor(selectedZoneDetails.capacity * 0.7)} (70%)</p>
                {selectedZoneDetails.type === 'Food' && <p className="text-warning">Wait time: ~15 mins</p>}
              </div>
              
              <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 mb-4">
                <h4 className="text-white text-xs font-semibold mb-1 flex items-center gap-1"><Navigation size={12}/> Live Directions</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{generateDirections(selectedZoneDetails)}</p>
              </div>

              <Button className="w-full text-sm" onClick={() => setHighlightedZone(null)}>Clear Selection</Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
