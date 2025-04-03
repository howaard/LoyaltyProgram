// Landing Page
import Link from 'next/link';
import Image from 'next/image';
import Hero from './components/Hero'
import TiersSection from './components/TiersSection'
import XPFlightCalculator from './components/XPFlightCalculator';

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="bg-white py-10 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#132452] mb-6">Discover FlyDream XP</h2>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
            FlyDream XP is our way of recognizing and rewarding your journeys. Earn XP on every flight, unlock new benefits, and rise through our exclusive tiers.
          </p>
        </div>
      </section>
      <TiersSection />
      <XPFlightCalculator />
    </>
  );
}

