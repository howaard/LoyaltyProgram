import Image from 'next/image';

export default function TiersSection() {
  return (
    <section className="bg-[#f5f9fd] py-20 px-6 sm:px-12">
      <div className="max-w-6xl mx-auto text-center">
        <h3 className="text-3xl sm:text-4xl font-bold text-[#132452] mb-12">Tier Levels</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {[
            { name: 'Bronze', color: 'text-[#8c6239]', icon: '/bronze.png', threshold: null },
            { name: 'Silver', color: 'text-gray-500', icon: '/silver.png', threshold: 1000 },
            { name: 'Gold', color: 'text-yellow-500', icon: '/gold.png', threshold: 3000 },
            { name: 'Platinum', color: 'text-[#3b82f6]', icon: '/platinum.png', threshold: 6000 },
            { name: 'Diamond', color: 'text-[#4b0082]', icon: '/diamond.png', threshold: 10000 },
          ].map((tier) => (
            <div key={tier.name} className="bg-white rounded-xl shadow-md p-6 min-h-[260px] flex flex-col items-center justify-start text-center">
              <h4 className={`text-2xl font-bold ${tier.color}`}>{tier.name}</h4>

              {/* Tier Icon */}
              <div className="mt-4">
                <Image
                  src={tier.icon}
                  alt={`${tier.name} icon`}
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>

              {/* Description */}
              <p className="mt-4 text-sm text-gray-600">
                {tier.threshold === null
                    ? 'Free to join'
                    : `Earn ${tier.threshold} XP to reach this tier`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
