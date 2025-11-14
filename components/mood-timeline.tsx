'use client'

import { useBehavior } from '@/lib/behavior-context'
import { useEffect, useState } from 'react'

interface TimelinePoint {
  time: string
  mood: number
  label: string
}

export function MoodTimeline() {
  const { events } = useBehavior()
  const [timeline, setTimeline] = useState<TimelinePoint[]>([])

  useEffect(() => {
    // Group events by minute and calculate average mood
    const grouped = new Map<string, { moods: number[]; labels: string[] }>()

    events.forEach(event => {
      const date = new Date(event.timestamp)
      const minute = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })

      if (!grouped.has(minute)) {
        grouped.set(minute, { moods: [], labels: [] })
      }
      const group = grouped.get(minute)!
      group.moods.push(event.value)
      group.labels.push(event.type)
    })

    const points: TimelinePoint[] = Array.from(grouped.entries())
      .map(([time, data]) => ({
        time,
        mood: Math.round(data.moods.reduce((a, b) => a + b, 0) / data.moods.length),
        label: data.labels[0] || 'idle',
      }))
      .slice(-10)

    setTimeline(points)
  }, [events])

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Last Activity</h3>
      <div className="space-y-2">
        {timeline.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity yet. Start browsing to see your mood timeline.</p>
        ) : (
          timeline.map((point, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="text-xs text-muted-foreground w-12">{point.time}</div>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${point.mood}%`,
                    backgroundColor: point.mood > 60 ? 'oklch(0.45 0.20 50)' : 'oklch(0.55 0.18 200)',
                  }}
                />
              </div>
              <div className="text-xs font-medium text-foreground w-8">{point.mood}%</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
