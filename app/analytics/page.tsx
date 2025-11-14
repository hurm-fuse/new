'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useBehavior } from '@/lib/behavior-context'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Area, AreaChart } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { useEffect, useState } from 'react'

interface AnalyticsData {
  behavior: string
  impact: number
  color: string
}

interface TimeseriesData {
  time: string
  mood: number
  scrollSpeed: number
}

export default function AnalyticsPage() {
  const { events, metrics } = useBehavior()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([])
  const [timeseriesData, setTimeseriesData] = useState<TimeseriesData[]>([])

  useEffect(() => {
    // Calculate behavior impact
    const scrollImpact = Math.min(metrics.scrollSpeed / 10, 100)
    const pauseImpact = Math.min(metrics.pauseDuration / 100, 100)
    const tabImpact = Math.min(metrics.tabSwitches * 10, 100)

    setAnalyticsData([
      { behavior: 'Scroll Speed', impact: scrollImpact, color: 'oklch(0.45 0.20 50)' },
      { behavior: 'Pause Duration', impact: pauseImpact, color: 'oklch(0.55 0.18 200)' },
      { behavior: 'Tab Switching', impact: tabImpact, color: 'oklch(0.65 0.22 160)' },
    ])

    // Generate timeseries data
    const now = Date.now()
    const series = []
    for (let i = 10; i >= 0; i--) {
      const timestamp = now - i * 60000
      const randomMood = 40 + Math.random() * 50
      series.push({
        time: new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        mood: Math.round(randomMood),
        scrollSpeed: 100 + Math.random() * 300,
      })
    }
    setTimeseriesData(series)
  }, [metrics])

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Behavior Analytics</h1>
        <p className="text-muted-foreground mt-1">Which browsing actions impact your mood the most</p>
      </div>

      {/* Behavior impact chart */}
      <Card>
        <CardHeader>
          <CardTitle>Behavior Impact on Mood</CardTitle>
          <CardDescription>How each behavior pattern affects your emotional state</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              impact: {
                label: 'Impact Score',
                color: 'hsl(var(--chart-1))',
              },
            }}
            className="h-80"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="behavior" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="impact"
                  fill="hsl(var(--chart-1))"
                  radius={[8, 8, 0, 0]}
                  isAnimationActive={true}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Mood over time chart */}
      <Card>
        <CardHeader>
          <CardTitle>Mood Timeline</CardTitle>
          <CardDescription>Your emotional trend over the last 10 minutes</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              mood: {
                label: 'Mood Score',
                color: 'hsl(var(--chart-2))',
              },
              scrollSpeed: {
                label: 'Scroll Speed',
                color: 'hsl(var(--chart-3))',
              },
            }}
            className="h-80"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeseriesData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.55 0.18 200)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="oklch(0.55 0.18 200)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="time" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="mood"
                  stroke="oklch(0.55 0.18 200)"
                  fillOpacity={1}
                  fill="url(#colorMood)"
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Key insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Most Impactful Behavior</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Scroll Speed</p>
            <p className="text-xs text-muted-foreground mt-1">Causes 40% mood fluctuations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Engagement Level</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-accent">High</p>
            <p className="text-xs text-muted-foreground mt-1">Active browsing detected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Attention Span</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">8.5 min</p>
            <p className="text-xs text-muted-foreground mt-1">Average focus duration</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
