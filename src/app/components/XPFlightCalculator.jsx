'use client';

import { useState } from 'react';

const classMultipliers = {
  Economy: 1.0,
  'Premium Economy': 1.1,
  Business: 1.4,
  'First Class': 1.75,
};

const tierMultipliers = {
  Bronze: 1.0,
  Silver: 1.05,
  Gold: 1.15,
  Platinum: 1.25,
  Diamond: 1.35,
};

const routes = [
    { from: 'Kuala Lumpur', to: 'Singapore', distance: 296 },
    { from: 'Kuala Lumpur', to: 'Sydney', distance: 6600 },
    { from: 'Kuala Lumpur', to: 'Tokyo', distance: 5331 },
  
    { from: 'Singapore', to: 'Kuala Lumpur', distance: 296 },
    { from: 'Singapore', to: 'Sydney', distance: 6300 },
    { from: 'Singapore', to: 'Tokyo', distance: 5315 },
  
    { from: 'Sydney', to: 'Kuala Lumpur', distance: 6600 },
    { from: 'Sydney', to: 'Singapore', distance: 6300 },
    { from: 'Sydney', to: 'Tokyo', distance: 7830 },
  
    { from: 'Tokyo', to: 'Kuala Lumpur', distance: 5331 },
    { from: 'Tokyo', to: 'Singapore', distance: 5315 },
    { from: 'Tokyo', to: 'Sydney', distance: 7830 },
  ];
  

export default function XPFlightCalculator() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [ticketClass, setTicketClass] = useState('Economy');
  const [tier, setTier] = useState('Bronze');
  const [tripType, setTripType] = useState('one-way');
  const [xp, setXp] = useState(null);
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState('');

  const uniqueCities = [...new Set(routes.flatMap((r) => [r.from, r.to]))].sort();

  const calculateXP = () => {
    // Reset previous results and errors
    setError('');
    
    // Validate inputs
    if (!from || !to) {
      setError('Please select both origin and destination cities');
      setXp(null);
      setDistance(null);
      return;
    }
    
    if (from === to) {
      setError('Origin and destination cannot be the same');
      setXp(null);
      setDistance(null);
      return;
    }

    // Find the route
    const route =
      routes.find((r) => r.from === from && r.to === to) ||
      routes.find((r) => r.from === to && r.to === from);

    if (!route) {
      setError('No route found between these cities');
      setXp(null);
      setDistance(null);
      return;
    }

    // Calculate XP
    const km = route.distance;
    const baseXP = 8 * Math.pow(km, 0.4);
    const classMultiplier = classMultipliers[ticketClass];
    const tierMultiplier = tierMultipliers[tier];
    const tripMultiplier = tripType === 'return' ? 2 : 1;

    const totalXP = baseXP * classMultiplier * tierMultiplier * tripMultiplier;

    setDistance(km);
    setXp(Math.round(totalXP));
  };

  return (
    <section className="bg-white py-20 px-6 sm:px-12">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#132452] mb-4">
          XP Calculator
        </h2>
        <p className="text-gray-700 text-base sm:text-lg">
          Select your route, ticket class, and tier to estimate the XP you'll earn on your next FlyDreamAir journey.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-[#f9fbfe] border border-sky-100 rounded-xl shadow-sm p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* From */}
          <div className="flex flex-col text-left">
            <label className="text-sm font-semibold mb-1">From</label>
            <select
              className="border rounded px-4 py-2"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            >
              <option value="">Select origin city</option>
              {uniqueCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* To */}
          <div className="flex flex-col text-left">
            <label className="text-sm font-semibold mb-1">To</label>
            <select
              className="border rounded px-4 py-2"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            >
              <option value="">Select destination city</option>
              {uniqueCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Class */}
          <div className="flex flex-col text-left">
            <label className="text-sm font-semibold mb-1">Ticket Class</label>
            <select
              className="border rounded px-4 py-2"
              value={ticketClass}
              onChange={(e) => setTicketClass(e.target.value)}
            >
              {Object.keys(classMultipliers).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Tier */}
          <div className="flex flex-col text-left">
            <label className="text-sm font-semibold mb-1">Your Tier</label>
            <select
              className="border rounded px-4 py-2"
              value={tier}
              onChange={(e) => setTier(e.target.value)}
            >
              {Object.keys(tierMultipliers).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Trip Type Toggle */}
          <div className="flex flex-col text-left">
            <label className="text-sm font-semibold mb-1">Trip Type</label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tripType"
                  value="one-way"
                  checked={tripType === 'one-way'}
                  onChange={() => setTripType('one-way')}
                  className="w-4 h-4"
                />
                <span className="text-sm">One Way</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tripType"
                  value="return"
                  checked={tripType === 'return'}
                  onChange={() => setTripType('return')}
                  className="w-4 h-4"
                />
                <span className="text-sm">Return</span>
              </label>
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-4 text-red-500 text-sm">{error}</p>
        )}

        <button
          className="mt-8 bg-sky-600 text-white px-6 py-2 rounded hover:bg-sky-700 transition"
          onClick={calculateXP}
        >
          Calculate XP
        </button>

        {distance && (
          <p className="mt-4 text-sm text-gray-500">
            📍 Distance: <span className="font-medium">{distance} km</span>{' '}
            {tripType === 'return' && <span>(×2 for return trip)</span>}
          </p>
        )}

        {xp !== null && (
          <div className="mt-6 text-xl font-semibold text-sky-700">
            ✈️ You'll earn approximately{' '}
            <span className="font-bold">{xp} XP</span> for this flight.
          </div>
        )}
      </div>
    </section>
  );
}