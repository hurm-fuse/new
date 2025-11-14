'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AuraMeter } from '@/components/aura-meter'
import { MoodTimeline } from '@/components/mood-timeline'
import { useBehavior } from '@/lib/behavior-context'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const { currentMood, metrics } = useBehavior()

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Your Mood Now</h1>
        <p className="text-muted-foreground mt-1">Real-time emotional state based on your behavior patterns</p>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Aura Meter - takes up left 2 columns */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Aura Meter</CardTitle>
              <CardDescription>Live mood detection with behavioral analysis</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AuraMeter />
            </CardContent>
          </Card>
        </div>

        {/* Timeline - right column */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Timeline</CardTitle>
              <CardDescription>Mood shifts over time</CardDescription>
            </CardHeader>
            <CardContent>
              <MoodTimeline />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Scroll Speed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(metrics.scrollSpeed)}</div>
            <p className="text-xs text-muted-foreground mt-1">px/sec</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pause Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(metrics.pauseDuration / 100) / 10}</div>
            <p className="text-xs text-muted-foreground mt-1">seconds</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tab Switches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.tabSwitches}</div>
            <p className="text-xs text-muted-foreground mt-1">per minute</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reading Rhythm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(metrics.readingRhythm)}</div>
            <p className="text-xs text-muted-foreground mt-1">chars/sec</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
