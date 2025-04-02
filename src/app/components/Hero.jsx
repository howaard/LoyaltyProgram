import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <div className="relative h-screen w-full -mt-14">
        <Image
        src="/plane-hero.png"
        alt="plane flying"
        fill
        className="object-contain object-left"
        priority
        />

    <div className="absolute inset-0 flex flex-col items-start justify-start pt-42 px-12 sm:px-20 text-left">
        <h1 className="text-6xl sm:text-7xl font-bold text-white leading-tight drop-shadow-lg">
          Fly More,<br />Earn More.
        </h1>
        <p className="mt-4 text-xl sm:text-2xl text-white max-w-md drop-shadow-md">
          Unlock rewards every mile of the way. Climb tiers, redeem flights, and enjoy VIP perks.
        </p>
        <Link href="/auth/register">
          <button className="mt-8 px-6 py-3 bg-sky-700 text-white rounded-lg text-lg font-medium hover:bg-sky-800 transition">
            Join Now
          </button>
        </Link>
      </div>
    </div>
  );
}
