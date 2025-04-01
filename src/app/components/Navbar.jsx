import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="h-24 bg-gradient-to-b from-sky-200 via-white to-sky-100 shadow flex items-center justify-between px-8 border-b border-sky-300">
      <div className="flex items-center space-x-4">
        <Image
          src="/company-logo.png"
          alt="FlyDreamAir Logo"
          width={120}
          height={60}
          className="object-contain"
        />
      </div>

      <div className="flex gap-12 text-blue-700 font-medium">
        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/rewards">Rewards</Link>
        <Link href="/admin">Admin</Link>
        <Link href="/auth/login" className="ml-6">Login</Link>
      </div>
    </nav>
  );
}
