// Landing Page
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <h1 className="text-4xl font-bold mb-4 text-center text-blue-700">Welcome to FlyDreamAir Loyalty Program</h1>
      <p className="text-lg mb-6 text-gray-700 text-center">
        Earn XP with every flight, unlock exclusive rewards, and climb the loyalty tiers from Bronze to Diamond.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 mt-12">
        <div className="border rounded-xl p-6 shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2 text-blue-600">🎯 XP System</h2>
          <p>Earn points using a logarithmic XP system that rewards frequent flights and premium classes.</p>
        </div>

        <div className="border rounded-xl p-6 shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2 text-blue-600">🏆 Tier Progression</h2>
          <p>Advance from Bronze to Diamond by completing challenges and accumulating XP.</p>
        </div>

        <div className="border rounded-xl p-6 shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2 text-blue-600">🎁 Reward Catalog</h2>
          <p>Redeem your XP for seat upgrades, flight discounts, and exclusive merchandise.</p>
        </div>

        <div className="border rounded-xl p-6 shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2 text-blue-600">🔐 Admin Portal</h2>
          <p>Staff can configure rewards, manage customers, and track loyalty analytics (access restricted).</p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link href="/auth/login">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Log In to Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}
