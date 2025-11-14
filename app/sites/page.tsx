'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useBehavior } from '@/lib/behavior-context'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { useEffect, useState } from 'react'

interface SiteEntry {
  domain: string
  mood: number
  influence: 'positive' | 'neutral' | 'negative'
  timeSpent: number
}

export default function SitesPage() {
  const { siteData } = useBehavior()
  const [sites, setSites] = useState<SiteEntry[]>([])

  useEffect(() => {
    const entries = Array.from(siteData.values()).map(site => {
      let influence: 'positive' | 'neutral' | 'negative' = 'neutral'
      if (site.moodAverage > 65) influence = 'positive'
      if (site.moodAverage < 40) influence = 'negative'

      return {
        domain: site.domain,
        mood: site.moodAverage,
        influence,
        timeSpent: site.timeSpent,
      }
    })

    setSites(entries.slice(0, 8))
  }, [siteData])

  const colors = {
    positive: 'oklch(0.45 0.20 50)',
    neutral: 'oklch(0.70 0.10 0)',
    negative: 'oklch(0.55 0.25 20)',
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Site Influence Map</h1>
        <p className="text-muted-foreground mt-1">How different websites shape your emotional state</p>
      </div>

      {/* Influence chart */}
      <Card>
        <CardHeader>
          <CardTitle>Websites by Mood Impact</CardTitle>
          <CardDescription>Average mood score while visiting each site</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              mood: {
                label: 'Mood Score',
                color: 'hsl(var(--chart-2))',
              },
            }}
            className="h-96"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sites}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" />
                <YAxis dataKey="domain" type="category" width={190} tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="mood" radius={[0, 8, 8, 0]} isAnimationActive={true}>
                  {sites.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[entry.influence]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Site comparison grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Positive influence */}
        <Card className="border-l-4" style={{ borderColor: colors.positive }}>
          <CardHeader>
            <CardTitle className="text-lg">Positive Influence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sites
                .filter(s => s.influence === 'positive')
                .map(site => (
                  <div key={site.domain} className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="text-sm font-medium">{site.domain}</span>
                    <span className="text-sm text-accent">{Math.round(site.mood)}%</span>
                  </div>
                ))}
              {sites.filter(s => s.influence === 'positive').length === 0 && (
                <p className="text-sm text-muted-foreground">No positive sites tracked yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Negative influence */}
        <Card className="border-l-4" style={{ borderColor: colors.negative }}>
          <CardHeader>
            <CardTitle className="text-lg">Negative Influence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sites
                .filter(s => s.influence === 'negative')
                .map(site => (
                  <div key={site.domain} className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="text-sm font-medium">{site.domain}</span>
                    <span className="text-sm" style={{ color: colors.negative }}>
                      {Math.round(site.mood)}%
                    </span>
                  </div>
                ))}
              {sites.filter(s => s.influence === 'negative').length === 0 && (
                <p className="text-sm text-muted-foreground">No negative sites tracked yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparative scores */}
      <Card>
        <CardHeader>
          <CardTitle>Key Metrics by Site</CardTitle>
          <CardDescription>Detailed breakdown of how each site affects your mood</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-2 px-2 font-medium">Domain</th>
                  <th className="text-left py-2 px-2 font-medium">Mood Score</th>
                  <th className="text-left py-2 px-2 font-medium">Influence</th>
                  <th className="text-left py-2 px-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {sites.map(site => (
                  <tr key={site.domain} className="border-b border-border hover:bg-muted">
                    <td className="py-2 px-2">{site.domain}</td>
                    <td className="py-2 px-2">
                      <span className="font-medium">{Math.round(site.mood)}%</span>
                    </td>
                    <td className="py-2 px-2">
                      <span
                        className="text-xs font-medium px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: `${colors[site.influence]}20`,
                          color: colors[site.influence],
                        }}
                      >
                        {site.influence.charAt(0).toUpperCase() + site.influence.slice(1)}
                      </span>
                    </td>
                    <td className="py-2 px-2">
                      <div className="w-24 h-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full"
                          style={{
                            width: `${site.mood}%`,
                            backgroundColor: colors[site.influence],
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
