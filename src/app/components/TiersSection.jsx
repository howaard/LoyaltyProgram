import { useState } from 'react';
import { CheckCircle, HelpCircle } from 'lucide-react';

export default function TiersSection() {
    const [activeTooltip, setActiveTooltip] = useState(null);
    
    const tiers = [
        {
          name: 'Bronze',
          color: 'text-[#8c6239]',
          icon: '/bronze.png',
          threshold: null,
          perks: [
            { text: 'Access to basic rewards' },
            { text: 'Earn XP on all flights', tooltip: 'XP helps you move up tiers and unlock benefits.' },
          ],
        },
        {
          name: 'Silver',
          color: 'text-gray-500',
          icon: '/silver.png',
          threshold: 1000,
          perks: [
            { text: '1.05 XP multiplier on flights', tooltip: 'Earn 5% more XP than Bronze tier.' },
            { text: 'Priority check-in' },
            { text: 'Free seat selection' },
          ],
        },
        {
          name: 'Gold',
          color: 'text-yellow-500',
          icon: '/gold.png',
          threshold: 3000,
          perks: [
            { text: '1.15 XP multiplier on flights', tooltip: 'Earn 15% more XP than Bronze tier.' },
            { text: 'Lounge access'},
            { text: 'Extra baggage allowance' },
            { text: 'Dedicated customer support' },
          ],
        },
        {
          name: 'Platinum',
          color: 'text-[#3b82f6]',
          icon: '/platinum.png',
          threshold: 6000,
          perks: [
            { text: '1.25 XP multiplier on flights', tooltip: 'Earn 25% more XP than Bronze tier.' },
            { text: 'Complimentary upgrades', tooltip: 'Subject to availability and route.' },
            { text: 'Priority boarding' },
          ],
        },
        {
          name: 'Diamond',
          color: 'text-[#4b0082]',
          icon: '/diamond.png',
          threshold: 10000,
          perks: [
            { text: '1.35 XP multiplier on flights', tooltip: 'Earn 35% more XP than Bronze tier.' },
            { text: 'All Platinum perks' },
            { text: 'VIP lounge access worldwide'},
            { text: 'Personal travel concierge', tooltip: 'Includes 24/7 booking, support, and itinerary planning.' },
          ],
        },
      ];
      

      return (
        <section className="bg-gray-50 py-20 px-6 sm:px-12">
          <div className="max-w-6xl mx-auto text-center">
            <h3 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-12">Tier Levels</h3>
    
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className="bg-white rounded-xl shadow-md p-6 flex flex-col h-full transition-transform hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Tier Name */}
                  <div className="h-12 flex items-center justify-center">
                    <h4 className={`text-2xl font-bold ${tier.color}`}>{tier.name}</h4>
                  </div>
    
                  {/* Icon */}
                  <div className="flex justify-center items-center h-24 my-2">
                    <div className="w-16 h-16 flex items-center justify-center">
                      <img
                        src={tier.icon}
                        alt={`${tier.name} icon`}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </div>
    
                  {/* Threshold */}
                  <div className="h-12 flex items-center justify-center mb-4">
                    <p className="text-sm text-gray-600">
                      {tier.threshold === null
                        ? 'Free to join'
                        : `Earn ${tier.threshold} XP to reach this tier`}
                    </p>
                  </div>
    
                  <div className="w-full border-t border-gray-200 mb-4"></div>
    
                  {/* Perks */}
                  <div className="flex flex-col gap-3 flex-grow w-full">
                    {tier.perks.map((perk, i) => {
                      const tooltipId = `${tier.name}-perk-${i}`;
                      
                      return (
                        <div
                          key={i}
                          className="flex items-start gap-2 w-full text-left"
                        >
                          <CheckCircle className="text-green-500 flex-shrink-0 w-4 h-4 mt-0.5" />   
                          <div className="flex items-center gap-[2px] flex-nowrap">
                            <span className="text-sm text-gray-700 leading-snug">{perk.text}</span>
                            {perk.tooltip && (
                                <div className="relative inline-block">
                                <HelpCircle
                                    size={13}
                                    className="text-blue-500 hover:text-blue-600 cursor-pointer mt-[1px]"
                                    onMouseEnter={() => setActiveTooltip(tooltipId)}
                                    onMouseLeave={() => setActiveTooltip(null)}
                                />
                                {activeTooltip === tooltipId && (
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-40 bg-black text-white text-xs rounded px-2 py-1 z-50">
                                    {perk.tooltip}
                                    </div>
                                )}
                                </div>
                            )}
                            </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }
