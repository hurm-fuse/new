'use client'

import { useBehavior } from '@/lib/behavior-context'
import { useEffect, useState } from 'react'

export function AuraMeter() {
  const { currentMood } = useBehavior()
  const [animatedScore, setAnimatedScore] = useState(currentMood.score)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedScore(prev => {
        const diff = currentMood.score - prev
        return prev + diff * 0.1
      })
    }, 50)
    return () => clearInterval(interval)
  }, [currentMood.score])

  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-40 h-40">
        {/* Outer glow effect */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-30 aura-glow"
          style={{
            backgroundColor: currentMood.color,
          }}
        />

        {/* SVG gauge */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background track */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-muted"
          />
          {/* Progress track */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-200"
            style={{
              stroke: currentMood.color,
            }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-foreground">
            {Math.round(animatedScore)}
          </div>
          <div
            className="text-xs font-medium mt-1 px-2 py-1 rounded-full"
            style={{
              backgroundColor: `${currentMood.color}20`,
              color: currentMood.color,
            }}
          >
            {currentMood.label}
          </div>
        </div>
      </div>

      {/* Confidence indicator */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Confidence: {Math.round(currentMood.confidence * 100)}%
        </p>
      </div>
    </div>
  )
}
