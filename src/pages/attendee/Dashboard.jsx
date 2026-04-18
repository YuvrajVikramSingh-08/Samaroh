import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Card, Badge, Button } from '../../components/Shared';
import { CloudRain, MapPin, Navigation, Clock, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AttendeeDashboard = () => {
  const { user } = useAuth();
  const { events } = useApp();
  const event = events.find(e => e.id === user.eventId);
  const [crowdLevel, setCrowdLevel] = useState(0);
  const [weather, setWeather] = useState({ temp: '24°C', desc: 'Clear Evening' });

  useEffect(() => {
    // Calculate overall crowd level based on queues and parking
    const totalQueues = event?.queues.reduce((acc, q) => acc + q.depth, 0) || 0;
    const crowdPercent = Math.min(100, Math.floor((totalQueues / 100) * 100) + 40 + Math.floor(Math.random() * 10));
    setCrowdLevel(crowdPercent);
  }, [event]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
        if (!apiKey) return; // Fallback to mock data if no key
        
        const city = event?.venue.split(',')[1]?.trim() || 'Mumbai';
        const cacheKey = `samaroh_weather_${city}`;
        const cached = localStorage.getItem(cacheKey);
        
        if (cached) {
          const parsed = JSON.parse(cached);
          // Check if cache is less than 1 hour old (3600000 ms)
          if (Date.now() - parsed.timestamp < 3600000) {
            setWeather(parsed.data);
            return;
          }
        }

        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
        if (res.ok) {
          const data = await res.json();
          const weatherData = {
            temp: `${Math.round(data.main.temp)}°C`,
            desc: data.weather[0].description.replace(/\b\w/g, l => l.toUpperCase())
          };
          setWeather(weatherData);
          localStorage.setItem(cacheKey, JSON.stringify({ data: weatherData, timestamp: Date.now() }));
        }
      } catch (err) {
        console.error("Failed to fetch weather", err);
      }
    };
    fetchWeather();
  }, [event?.venue]);

  if (!event) return null;

  const attendee = event.registeredAttendees.find(a => a.email === user.email);
  const name = attendee ? attendee.name : user.email.split('@')[0];

  const getCrowdColor = (level) => {
    if (level < 60) return 'text-green-500 bg-green-500/20';
    if (level < 80) return 'text-warning bg-warning/20';
    return 'text-red-500 bg-red-500/20';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading text-white">Welcome, {name}</h2>
          <p className="text-gray-400 flex items-center gap-2 mt-1">
            <MapPin size={16} /> {event.name} &bull; {event.date}
          </p>
        </div>
        <div className="flex items-center gap-3 bg-background-lighter px-4 py-2 rounded-full border border-gray-800">
          <CloudRain size={20} className="text-blue-400" />
          <span className="text-sm">{weather.temp}, {weather.desc}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2 space-y-4 border-l-4 border-primary">
          <h3 className="font-heading text-xl text-primary">Event Information</h3>
          <p className="text-gray-300">{event.description}</p>
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-400">
            <span className="flex items-center gap-1"><Clock size={16}/> Gates: {event.time}</span>
            <span className="flex items-center gap-1"><Navigation size={16}/> Venue: {event.venue}</span>
            <Badge type="primary">Ticket: {attendee?.ticketType || 'Guest'}</Badge>
          </div>
          {/* Free Google Maps Embed iframe */}
          <div className="w-full h-48 bg-gray-800 rounded mt-4 overflow-hidden relative border border-gray-700">
            <iframe 
              src={`https://maps.google.com/maps?q=${encodeURIComponent(event.venue)}&t=&z=15&ie=UTF8&iwloc=&output=embed`} 
              width="100%" 
              height="100%" 
              style={{border:0}} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div>
             <h3 className="font-heading text-xl text-white flex items-center gap-2 mb-4">
               <Activity size={20} className="text-primary"/> Live Crowd Monitor
             </h3>
             <div className="flex justify-between items-end mb-2">
                <span className="text-sm text-gray-400">Venue Capacity</span>
                <span className={`text-xl font-bold px-2 py-1 rounded ${getCrowdColor(crowdLevel)}`}>{crowdLevel}%</span>
             </div>
             <div className="w-full bg-gray-800 rounded-full h-2 mb-6">
                <div className={`h-2 rounded-full transition-all duration-1000 ${crowdLevel < 60 ? 'bg-green-500' : crowdLevel < 80 ? 'bg-warning' : 'bg-red-500'}`} style={{ width: `${crowdLevel}%` }}></div>
             </div>
             
             <h4 className="text-sm text-gray-400 mb-2">Recommendations</h4>
             <div className="bg-background p-3 rounded border border-gray-800 text-sm">
                <p className="text-white mb-1">Least crowded area right now:</p>
                <p className="text-primary font-semibold">East Stand / Food Court B</p>
             </div>
          </div>
          <Link to="/attendee/map">
             <Button variant="outline" className="w-full mt-4">View Venue Map</Button>
          </Link>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {['Nearest Washroom', 'Water Station', 'First Aid', 'Exit Route'].map((amenity, i) => (
           <Card key={i} className="hover:border-primary/50 transition-colors cursor-pointer group">
             <h4 className="text-white group-hover:text-primary transition-colors">{amenity}</h4>
             <p className="text-xs text-gray-500 mt-2 flex justify-between">
               <span>~{Math.floor(Math.random() * 5) + 1} min walk</span>
               <Navigation size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary"/>
             </p>
           </Card>
        ))}
      </div>
    </div>
  );
};
