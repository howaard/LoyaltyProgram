'use client'

import { useState } from 'react'
import { Wheel } from 'react-custom-roulette'

const rewardOptions = [
  { option: '10 XP'},
  { option: '50 XP' },
  { option: '100 XP' },
  { option: 'Free Seat' },
  { option: '5% Discount' },
  { option: '200 XP' },
  { option: '10% Discount' },
  { option: 'Lounge Pass' },
]

export default function LuckyWheel({ spinsLeft, onSpinComplete }) {
  const [mustSpin, setMustSpin] = useState(false)
  const [prizeIndex, setPrizeIndex] = useState(0)
  const [spinning, setSpinning] = useState(false)

  const handleSpinClick = () => {
    if (spinning || spinsLeft <= 0) return
    const selected = Math.floor(Math.random() * rewardOptions.length)
    setPrizeIndex(selected)
    setMustSpin(true)
    setSpinning(true)
  }

  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-[#132452] mb-6">🎁 Lucky Draw</h2>
      <p className="text-gray-700 mb-4">Spins left today: <strong>{spinsLeft}</strong></p>

      <div className="flex justify-center">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeIndex}
          data={rewardOptions}
          backgroundColors={['#bae6fd', '#e0f2fe']}
          textColors={['#0c4a6e']}
          onStopSpinning={() => {
            setMustSpin(false)
            setSpinning(false)
            const prize = rewardOptions[prizeIndex].option
            onSpinComplete(prize)
          }}
        />
      </div>

      <button
        onClick={handleSpinClick}
        className="mt-8 px-6 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition disabled:opacity-50"
        disabled={spinning || spinsLeft <= 0}
      >
        Spin Now
      </button>
    </div>
  )
}
