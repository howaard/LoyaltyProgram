'use client';

import { useState } from 'react';

const classMultipliers = {
  Economy: 1.0,
  'Premium Economy': 1.1,
  Business: 1.3,
  'First Class': 1.5,
};

const tierMultipliers = {
  Bronze: 1.0,
  Silver: 1.05,
  Gold: 1.15,
  Platinum: 1.25,
  Diamond: 1.35,
};

export default function XPFlightCalculator() {
  const [distance, setDistance] = useState('');
  const [ticketClass, setTicketClass] = useState('Economy');
  const [tier, setTier] = useState('Bronze');
  const [xp, setXp] = useState(null);

  const calculateXP = () => {
    const km = parseFloat(distance);
    if (!km || km <= 0) return setXp(null);

    const baseXP = 40 * Math.log(km);
    const classMultiplier = classMultipliers[ticketClass];
    const tierMultiplier = tierMultipliers[tier];

    const totalXP = baseXP * classMultiplier * tierMultiplier;
    setXp(Math.round(totalXP));
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8 mt-12">
      <h4 className="text-2xl font-bold text-[#132452] mb-4">XP Calculator</h4>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Distance Input */}
        <div className="flex flex-col text-left">
          <label className="text-sm font-semibold mb-1">Distance (km)</label>
          <input
            type="number"
            className="border rounded px-4 py-2"
            placeholder="Enter distance"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          />
        </div>

        {/* Class Dropdown */}
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

        {/* Tier Dropdown */}
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
      </div>

      <button
        className="mt-6 bg-sky-600 text-white px-6 py-2 rounded hover:bg-sky-700 transition"
        onClick={calculateXP}
      >
        Calculate XP
      </button>

      {xp !== null && (
        <div className="mt-6 text-xl font-semibold text-sky-700">
          ✈️ You’ll earn approximately <span className="font-bold">{xp} XP</span> for this flight.
        </div>
      )}
    </div>
  );
}
