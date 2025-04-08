'use client'

import { useState } from 'react'
import { Wheel } from 'react-custom-roulette'

const rewardOptions = [
  { option: '10 XP', weight: 80 },
  { option: '50 XP', weight: 10 },
  { option: '100 XP', weight: 2 },
  { option: 'Free Seat', weight: 3 },
  { option: '5% Discount', weight: 2 },
  { option: '200 XP', weight: 1 },
  { option: '10% Discount', weight: 1 },
  { option: 'Lounge Pass', weight: 1 },
]

function getWeightedPrizeIndex(options) {
  const totalWeight = options.reduce((sum, item) => sum + item.weight, 0)
  const rand = Math.random() * totalWeight

  let acc = 0
  for (let i = 0; i < options.length; i++) {
    acc += options[i].weight
    if (rand <= acc) return i
  }

  return options.length - 1 // Fallback
}

export default function LuckyWheel({ spinsLeft, onSpinComplete }) {
  const [mustSpin, setMustSpin] = useState(false)
  const [prizeIndex, setPrizeIndex] = useState(0)
  const [spinning, setSpinning] = useState(false)

  const handleSpinClick = () => {
    if (spinning || spinsLeft <= 0) return
    const selected = getWeightedPrizeIndex(rewardOptions)
    setPrizeIndex(selected)
    setMustSpin(true)
    setSpinning(true)
  }

  return (
    <div className="flex flex-col items-center justify-center py-0">
      <h2 className="text-2xl font-bold text-[#132452] mb-6 pl-35">🎁 Lucky Draw</h2>
      <p className="text-gray-700 mb-4 pl-40">
        Spins left today: <strong>{spinsLeft}</strong>
      </p>

      <div className="relative w-72 h-72 mx-auto">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeIndex}
          data={rewardOptions.map(item => ({ option: item.option }))}
          backgroundColors={['#bae6fd', '#e0f2fe']}
          textColors={['#0c4a6e']}
          outerBorderColor="#0284c7"
          radiusLineColor="#7dd3fc"
          fontSize={14}
          spinDuration={0.7}
          onStopSpinning={() => {
            setMustSpin(false)
            setSpinning(false)
            const prize = rewardOptions[prizeIndex].option
            onSpinComplete(prize)
          }}
        />

        {/* Clickable Center Logo */}
        <button
            onClick={handleSpinClick}
            disabled={spinning || spinsLeft <= 0}
            className="absolute top-55 left-55.5 transform-none -translate-x-1/2 -translate-y-1/2 z-10 w-20 h-20 bg-gradient-to-br from-[#f0f9ff] via-white to-[#dbeafe] border-4 border-[#0284c7] rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none cursor-pointer"
            aria-label="Spin the wheel"
            >
            <span className="text-xl font-bold text-[#0c4a6e] tracking-widest drop-shadow-sm">
                Spin
            </span>
        </button>
      </div>

      <p className="mt-6 text-sky-700 font-medium">
        {spinning ? 'Spinning...' : 'Click the center logo to spin!'}
      </p>
    </div>
  )
}
