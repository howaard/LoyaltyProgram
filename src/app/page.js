// Landing Page
'use client';
import Link from 'next/link';
import Image from 'next/image';
import Hero from './components/Hero'
import TiersSection from './components/TiersSection'
import XPFlightCalculator from './components/XPFlightCalculator';
import Footer from './components/Footer'

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
      <section className="bg-gradient-to-r from-sky-100 to-sky-50 py-12 text-center rounded-t-xl mt-10 border-t border-blue-200">
        <h3 className="text-2xl sm:text-3xl font-semibold text-[#132452] mb-2">
          Ready to Elevate Your Journey?
        </h3>
        <p className="mb-7 text-sm sm:text-base text-gray-700">
          Join FlyDream XP and start earning rewards every time you fly.
        </p>
        <Link 
          href="/auth/register"
          className="px-6 py-2 border border-sky-600 text-sky-700 rounded-full font-medium hover:bg-sky-50 transition cursor-pointer"
        >
          Sign Up for Free
        </Link>
      </section>
      <Footer />

    </>
  );
}

