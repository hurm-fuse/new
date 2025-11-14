'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Activity, BarChart3, Map, Settings, Home } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/sites', label: 'Site Map', icon: Map },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <nav className="w-64 border-r border-border bg-sidebar p-6 flex flex-col gap-8">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Activity className="w-5 h-5 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-semibold text-sidebar-foreground">MoodTrace</h1>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-muted'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{label}</span>
            </Link>
          )
        })}
      </div>

      <div className="text-xs text-sidebar-foreground/60 border-t border-sidebar-border pt-4">
        <p>Tracking active</p>
        <p className="text-green-600 dark:text-green-400">● Live</p>
      </div>
    </nav>
  )
}
