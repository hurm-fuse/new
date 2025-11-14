'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useBehavior } from '@/lib/behavior-context'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { useState } from 'react'

export default function SettingsPage() {
  const { exportData, clearData } = useBehavior()
  const [sensitivity, setSensitivity] = useState(50)
  const [trackingEnabled, setTrackingEnabled] = useState(true)
  const [siteTracking, setSiteTracking] = useState(true)
  const [dataSharing, setDataSharing] = useState(false)

  const handleExport = () => {
    const data = exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `moodtrace-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      clearData()
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings & Privacy</h1>
        <p className="text-muted-foreground mt-1">Manage your tracking preferences and data</p>
      </div>

      {/* Tracking preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Tracking Preferences</CardTitle>
          <CardDescription>Control what behaviors MoodTrace monitors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">Tracking Enabled</h3>
              <p className="text-sm text-muted-foreground">Monitor scroll speed, pauses, and other behaviors</p>
            </div>
            <Switch checked={trackingEnabled} onCheckedChange={setTrackingEnabled} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">Site Tracking</h3>
              <p className="text-sm text-muted-foreground">Track which websites affect your mood</p>
            </div>
            <Switch checked={siteTracking} onCheckedChange={setSiteTracking} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">Data Sharing</h3>
              <p className="text-sm text-muted-foreground">Anonymous analytics to improve the algorithm</p>
            </div>
            <Switch checked={dataSharing} onCheckedChange={setDataSharing} />
          </div>
        </CardContent>
      </Card>

      {/* Sensitivity settings */}
      <Card>
        <CardHeader>
          <CardTitle>Detection Sensitivity</CardTitle>
          <CardDescription>Adjust how quickly MoodTrace detects mood changes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">
              Sensitivity Level: {sensitivity}%
            </label>
            <Slider
              value={[sensitivity]}
              onValueChange={(value) => setSensitivity(value[0])}
              min={0}
              max={100}
              step={5}
              className="mt-4"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {sensitivity < 33
                ? 'Low - Only major behavior changes affect mood'
                : sensitivity < 66
                ? 'Medium - Balanced sensitivity'
                : 'High - Even small changes affect mood'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Data */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Data Management</CardTitle>
          <CardDescription>Manage your personal data and export options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium text-foreground mb-2">Data Storage</h3>
            <p className="text-sm text-muted-foreground">
              All your mood data is stored locally in your browser. Nothing is sent to external servers.
            </p>
          </div>

          <div className="flex gap-3 mt-4">
            <Button variant="outline" onClick={handleExport}>
              Export Data as JSON
            </Button>
            <Button variant="outline" className="text-destructive" onClick={handleClear}>
              Clear All Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Behavior detection details */}
      <Card>
        <CardHeader>
          <CardTitle>What We Monitor</CardTitle>
          <CardDescription>Understanding MoodTrace's behavior analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-sm text-foreground">Scroll Speed</h4>
              <p className="text-sm text-muted-foreground">
                Fast scrolling typically indicates engagement or stress; slow scrolling suggests focused reading.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-foreground">Pause Duration</h4>
              <p className="text-sm text-muted-foreground">
                Longer pauses between actions may indicate concentration or fatigue.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-foreground">Tab Switching</h4>
              <p className="text-sm text-muted-foreground">
                Frequent tab switching can signal distraction or multitasking stress.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-foreground">Reading Rhythm</h4>
              <p className="text-sm text-muted-foreground">
                Consistent reading pace shows calm focus; irregular patterns suggest agitation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>About MoodTrace</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Version 1.0.0</p>
          <p>MoodTrace uses advanced behavior analysis to detect emotional patterns from your browsing habits.</p>
          <p className="text-xs">Your privacy is important. All data stays on your device.</p>
        </CardContent>
      </Card>
    </div>
  )
}
