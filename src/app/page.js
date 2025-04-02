// Landing Page
import Link from 'next/link';
import Image from 'next/image';
import Hero from './components/Hero'

export default function HomePage() {
  return (
    <>
      <Hero />
      {/* Existing Rewards Section */}
      <div className="max-w-4xl mx-auto py-16 px-6">
        {/* ...existing cards and content... */}
      </div>
    </>
  );
}

