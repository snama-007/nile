'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { TaskCard } from '@/components/features/TaskCard'
import { LoadingScreen, Loading } from '@/components/ui/Loading'
import Link from 'next/link'
import { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']
type Update = Database['public']['Tables']['updates']['Row']

interface PageProps {
  params: {
    handle: string
  }
}

export default function UserFeedPage({ params }: PageProps) {
  // Handle comes from URL like /@john or /john
  const rawHandle = decodeURIComponent(params.handle)
  const handle = rawHandle.startsWith('@') ? rawHandle.slice(1) : rawHandle
  const [tasks, setTasks] = useState<Task[]>([])
  const [updates, setUpdates] = useState<Record<string, Update[]>>({})
  const [loading, setLoading] = useState(true)
  const [userExists, setUserExists] = useState(false)

  useEffect(() => {
    loadUserFeed()
    subscribeToUpdates()
  }, [handle])

  const loadUserFeed = async () => {
    setLoading(true)

    // Check if user exists
    const { data: userData } = await supabase
      .from('users_public')
      .select('handle')
      .eq('handle', handle)
      .single()

    if (!userData) {
      setLoading(false)
      setUserExists(false)
      return
    }

    setUserExists(true)

    // Load tasks
    const { data: tasksData } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_handle', handle)
      .order('created_at', { ascending: false })

    if (tasksData) {
      setTasks(tasksData)

      // Load updates for each task
      const updatesMap: Record<string, Update[]> = {}
      for (const task of (tasksData as Task[])) {
        const { data: updatesData } = await supabase
          .from('updates')
          .select('*')
          .eq('task_id', task.id)
          .order('created_at', { ascending: false })

        if (updatesData) {
          updatesMap[task.id] = updatesData as Update[]
        }
      }
      setUpdates(updatesMap)
    }

    setLoading(false)
  }

  const subscribeToUpdates = () => {
    const channel = supabase
      .channel('public-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'updates',
        },
        (payload) => {
          // Reload data when new update is inserted
          loadUserFeed()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  if (loading) {
    return <LoadingScreen />
  }

  if (!userExists) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
        <div className="text-center space-y-4 px-4">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-4xl font-bold text-white">Handle Not Found</h1>
          <p className="text-xl text-navy-300">
            @{handle} doesn't exist yet
          </p>
          <Link href="/">
            <span className="inline-block mt-4 text-brand-orange hover:text-brand-orange-light underline">
              Go back home
            </span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-navy-900 to-navy-800 text-white py-12 shadow-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-16 h-16 bg-brand-orange rounded-full flex items-center justify-center text-2xl font-bold">
              {handle[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-4xl font-bold">@{handle}</h1>
              <p className="text-navy-300 text-lg mt-1">Active Service Updates</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tasks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-navy-200">
            <div className="text-5xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-navy-900 mb-2">
              No Active Tasks
            </h2>
            <p className="text-navy-600">
              You'll see service updates here when they're available
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-navy-900">
                {tasks.length} Active Task{tasks.length !== 1 ? 's' : ''}
              </h2>
              <div className="flex items-center gap-2 text-sm text-navy-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Live</span>
              </div>
            </div>

            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                updates={updates[task.id] || []}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-navy-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-navy-500 text-sm">
          <p>
            Powered by{' '}
            <Link href="/">
              <span className="text-brand-orange font-semibold hover:underline">
                Nile
              </span>
            </Link>
            {' '}— Real-time service updates
          </p>
        </div>
      </footer>
    </div>
  )
}

