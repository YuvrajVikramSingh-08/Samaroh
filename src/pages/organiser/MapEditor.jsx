import React from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card, Button } from '../../components/Shared';
import { Map, Edit3, Save } from 'lucide-react';

export const OrganiserMapEditor = () => {
  const { id } = useParams();
  const { events, updateMapZones, addNotification } = useApp();
  const event = events.find(e => e.id === id);

  const [zones, setZones] = React.useState(event ? event.gridZones : []);
  const [selectedZone, setSelectedZone] = React.useState(null);

  if (!event) return null;

  const handlePublish = () => {
    updateMapZones(id, zones);
    addNotification("Map changes published successfully!");
  };

  const handleDrawZone = () => {
    const name = prompt("Enter Zone Name (e.g. VIP Area):");
    if(!name) return;
    const type = prompt("Enter Zone Type (Seating, Food, Medical, Stage, Exit):", "Seating");
    const capacity = parseInt(prompt("Enter Capacity:", "100"));
    const x = parseInt(prompt("Enter X position (0-9):", "0"));
    const y = parseInt(prompt("Enter Y position (0-9):", "0"));
    const w = parseInt(prompt("Enter Width (1-10):", "2"));
    const h = parseInt(prompt("Enter Height (1-10):", "2"));
    
    if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)) return;
    
    const newZone = {
      id: `z${Date.now()}`,
      name, type, capacity: capacity || 100, x, y, w, h, color: 'bg-indigo-500'
    };
    setZones([...zones, newZone]);
  };

  const handleDeleteZone = () => {
    if (selectedZone) {
      setZones(zones.filter(z => z.id !== selectedZone));
      setSelectedZone(null);
    }
  };

  const GridMap = () => {
    const cols = 10;
    const rows = 10;
    const cellSize = 100 / cols;

    return (
      <div className="relative w-full aspect-square max-w-2xl mx-auto bg-gray-900 border border-gray-700 rounded overflow-hidden shadow-inner">
        {/* Base Grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: `${cellSize}% ${cellSize}%`
        }} />

        {/* Zones */}
        {zones.map(zone => (
          <div
            key={zone.id}
            onClick={() => setSelectedZone(zone.id)}
            className={`absolute border border-gray-500 hover:ring-2 hover:ring-white transition-all cursor-pointer flex flex-col items-center justify-center p-1 ${zone.color} ${selectedZone === zone.id ? 'ring-4 ring-primary z-10' : ''}`}
            style={{
              left: `${zone.x * cellSize}%`,
              top: `${zone.y * cellSize}%`,
              width: `${zone.w * cellSize}%`,
              height: `${zone.h * cellSize}%`,
            }}
          >
            <span className="text-center font-bold text-[10px] sm:text-xs text-white drop-shadow-md">
              {zone.name}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const selectedData = zones.find(z => z.id === selectedZone);

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-heading text-white">Venue Map Editor</h2>
          <p className="text-gray-400">Design the grid layout, assign zones, and define accessible routes.</p>
        </div>
        <Button onClick={handlePublish} className="flex items-center gap-2"><Save size={16}/> Publish Changes</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <h3 className="font-heading text-xl text-white mb-4">Tools</h3>
            <div className="space-y-2">
              <Button onClick={handleDrawZone} variant="outline" className="w-full flex justify-start gap-2 text-sm"><Edit3 size={16}/> Add New Zone</Button>
              <Button onClick={() => alert("Route editor initialized (mocked)")} variant="outline" className="w-full flex justify-start gap-2 text-sm"><Map size={16}/> Edit Accessible Route</Button>
            </div>
          </Card>
          
          <Card>
            <h3 className="font-heading text-xl text-white mb-4">Properties</h3>
            {selectedData ? (
              <div className="space-y-2 text-sm text-gray-300">
                <p><strong>Name:</strong> {selectedData.name}</p>
                <p><strong>Type:</strong> {selectedData.type}</p>
                <p><strong>Capacity:</strong> {selectedData.capacity}</p>
                <p><strong>Pos:</strong> X:{selectedData.x}, Y:{selectedData.y}</p>
                <p><strong>Size:</strong> W:{selectedData.w}, H:{selectedData.h}</p>
                <Button onClick={handleDeleteZone} variant="danger" className="w-full mt-2 text-xs py-1">Delete Zone</Button>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Select a zone on the map to edit its properties (Name, Type, Capacity).</p>
            )}
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="flex flex-col p-4 bg-background-lighter">
            <div className="mb-4 flex justify-between text-sm text-gray-400">
               <span>Click a zone to view properties or delete it. Use "Add New Zone" to create one.</span>
            </div>
            <GridMap />
          </Card>
        </div>
      </div>
    </div>
  );
};
