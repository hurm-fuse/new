'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface BehaviorMetrics {
  scrollSpeed: number // pixels per second
  pauseDuration: number // milliseconds
  tabSwitches: number // count per minute
  readingRhythm: number // characters per second
  timestamp: number
}

export interface MoodState {
  score: number // 0-100
  label: 'calm' | 'focused' | 'neutral' | 'engaged' | 'stressed'
  color: string
  confidence: number // 0-1
}

export interface BehaviorEvent {
  type: 'scroll' | 'pause' | 'tab-switch' | 'reading'
  value: number
  timestamp: number
  domain: string
}

export interface SiteData {
  domain: string
  moodAverage: number
  eventCount: number
  timeSpent: number // seconds
  engagementScore: number
}

interface BehaviorContextType {
  currentMood: MoodState
  metrics: BehaviorMetrics
  events: BehaviorEvent[]
  siteData: Map<string, SiteData>
  trackEvent: (event: BehaviorEvent) => void
  getSiteInfluence: () => Array<{ domain: string; mood: number }>
  clearData: () => void
  exportData: () => string
}

const BehaviorContext = createContext<BehaviorContextType | undefined>(undefined)

export function BehaviorProvider({ children }: { children: React.ReactNode }) {
  const [currentMood, setCurrentMood] = useState<MoodState>({
    score: 50,
    label: 'neutral',
    color: 'oklch(0.70 0.10 0)',
    confidence: 0.5,
  })

  const [metrics, setMetrics] = useState<BehaviorMetrics>({
    scrollSpeed: 0,
    pauseDuration: 0,
    tabSwitches: 0,
    readingRhythm: 0,
    timestamp: Date.now(),
  })

  const [events, setEvents] = useState<BehaviorEvent[]>([])
  const [siteData, setSiteData] = useState<Map<string, SiteData>>(new Map())
  const [lastScrollTime, setLastScrollTime] = useState(Date.now())
  const [lastScrollPos, setLastScrollPos] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  // Track scroll speed
  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now()
      const timeDelta = (now - lastScrollTime) / 1000 // seconds
      const scrollDelta = Math.abs(window.scrollY - lastScrollPos)
      const scrollSpeed = timeDelta > 0 ? scrollDelta / timeDelta : 0

      setLastScrollPos(window.scrollY)
      setLastScrollTime(now)

      setMetrics(prev => ({
        ...prev,
        scrollSpeed: Math.min(scrollSpeed, 1000),
        timestamp: now,
      }))
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollTime, lastScrollPos])

  // Track tab visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
        setLastScrollTime(Date.now())
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Track pause duration (time between interactions)
  useEffect(() => {
    let pauseTimer: NodeJS.Timeout

    const handleInteraction = () => {
      clearTimeout(pauseTimer)
      pauseTimer = setTimeout(() => {
        setMetrics(prev => ({
          ...prev,
          pauseDuration: prev.pauseDuration + 100,
          timestamp: Date.now(),
        }))
      }, 100)
    }

    window.addEventListener('mousemove', handleInteraction)
    window.addEventListener('keypress', handleInteraction)
    return () => {
      clearTimeout(pauseTimer)
      window.removeEventListener('mousemove', handleInteraction)
      window.removeEventListener('keypress', handleInteraction)
    }
  }, [])

  // Calculate mood based on metrics
  useEffect(() => {
    const calculateMood = () => {
      let score = 50 // neutral baseline
      let confidence = 0.3

      // Fast scrolling suggests engagement or stress
      if (metrics.scrollSpeed > 500) {
        score += 15 // engaged
        confidence = 0.7
      } else if (metrics.scrollSpeed > 200) {
        score += 5
        confidence = 0.5
      }

      // High pause duration suggests focus or fatigue
      if (metrics.pauseDuration > 5000) {
        score -= 10 // stressed/fatigued
        confidence = 0.6
      } else if (metrics.pauseDuration > 2000) {
        score += 10 // focused
        confidence = 0.6
      }

      // Tab switches suggest distraction
      if (metrics.tabSwitches > 5) {
        score -= 20 // stressed
        confidence = 0.8
      }

      score = Math.max(0, Math.min(100, score))

      // Determine mood label and color
      let label: MoodState['label'] = 'neutral'
      let color = 'oklch(0.70 0.10 0)'

      if (score < 30) {
        label = 'stressed'
        color = 'oklch(0.55 0.25 20)'
      } else if (score < 45) {
        label = 'calm'
        color = 'oklch(0.65 0.22 160)'
      } else if (score < 55) {
        label = 'neutral'
        color = 'oklch(0.70 0.10 0)'
      } else if (score < 75) {
        label = 'focused'
        color = 'oklch(0.55 0.18 200)'
      } else {
        label = 'engaged'
        color = 'oklch(0.45 0.20 50)'
      }

      setCurrentMood({
        score,
        label,
        color,
        confidence,
      })
    }

    const interval = setInterval(calculateMood, 2000)
    return () => clearInterval(interval)
  }, [metrics])

  const trackEvent = (event: BehaviorEvent) => {
    setEvents(prev => [...prev.slice(-99), event]) // Keep last 100 events

    // Update site data
    setSiteData(prev => {
      const updated = new Map(prev)
      const current = updated.get(event.domain) || {
        domain: event.domain,
        moodAverage: currentMood.score,
        eventCount: 0,
        timeSpent: 0,
        engagementScore: 0,
      }

      current.eventCount += 1
      current.moodAverage = (current.moodAverage + currentMood.score) / 2
      current.engagementScore = current.moodAverage * 0.6 + (event.value / 100) * 0.4

      updated.set(event.domain, current)
      return updated
    })

    // Update metrics based on event
    if (event.type === 'tab-switch') {
      setMetrics(prev => ({
        ...prev,
        tabSwitches: prev.tabSwitches + 1,
        timestamp: Date.now(),
      }))
    }
  }

  const getSiteInfluence = () => {
    return Array.from(siteData.values())
      .map(site => ({
        domain: site.domain,
        mood: site.moodAverage,
      }))
      .sort((a, b) => b.mood - a.mood)
  }

  const clearData = () => {
    setEvents([])
    setSiteData(new Map())
    setMetrics({
      scrollSpeed: 0,
      pauseDuration: 0,
      tabSwitches: 0,
      readingRhythm: 0,
      timestamp: Date.now(),
    })
  }

  const exportData = () => {
    const data = {
      timestamp: new Date().toISOString(),
      currentMood,
      metrics,
      events,
      siteData: Array.from(siteData.entries()),
    }
    return JSON.stringify(data, null, 2)
  }

  return (
    <BehaviorContext.Provider
      value={{
        currentMood,
        metrics,
        events,
        siteData,
        trackEvent,
        getSiteInfluence,
        clearData,
        exportData,
      }}
    >
      {children}
    </BehaviorContext.Provider>
  )
}

export function useBehavior() {
  const context = useContext(BehaviorContext)
  if (context === undefined) {
    throw new Error('useBehavior must be used within BehaviorProvider')
  }
  return context
}
