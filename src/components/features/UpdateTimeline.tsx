'use client'

import { formatRelativeTime } from '@/lib/utils/date'
import { useEffect, useRef } from 'react'

interface Update {
  id: string
  message: string
  created_at: string
}

interface UpdateTimelineProps {
  updates: Update[]
  autoScroll?: boolean
}

export function UpdateTimeline({ updates, autoScroll = false }: UpdateTimelineProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [updates, autoScroll])

  if (updates.length === 0) {
    return (
      <div className="text-center py-8 text-navy-400">
        <p>No updates yet</p>
        <p className="text-sm mt-2">Updates will appear here in real-time</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {updates.map((update, index) => (
        <div
          key={update.id}
          className="relative pl-8 pb-4 animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Timeline line */}
          {index !== updates.length - 1 && (
            <div className="absolute left-2 top-8 bottom-0 w-0.5 bg-brand-orange/20" />
          )}

          {/* Timeline dot */}
          <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-brand-orange border-2 border-white shadow-md" />

          {/* Update content */}
          <div className="bg-white rounded-xl shadow-sm border border-navy-200 p-4">
            <p className="text-navy-800 leading-relaxed">{update.message}</p>
            <p className="text-navy-400 text-xs mt-2">
              {formatRelativeTime(update.created_at)}
            </p>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}

