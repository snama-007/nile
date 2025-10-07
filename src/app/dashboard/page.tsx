'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { CreateTaskForm } from '@/components/features/CreateTaskForm'
import { TaskList } from '@/components/features/TaskList'
import { LoadingScreen } from '@/components/ui/Loading'
import type { User } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']
type Update = Database['public']['Tables']['updates']['Row']

// Force dynamic rendering to avoid build-time Supabase errors
export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [vendorId, setVendorId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<Task[]>([])
  const [updates, setUpdates] = useState<Record<string, Update[]>>({})
  const [refreshKey, setRefreshKey] = useState(0)

  const loadTasks = useCallback(async () => {
    if (!vendorId) return

    const { data: tasksData } = await supabase
      .from('tasks')
      .select('*')
      .eq('vendor_id', vendorId)
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
  }, [vendorId])

  const subscribeToRealtime = useCallback(() => {
    // Subscribe to updates table changes
    const channel = supabase
      .channel('vendor-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'updates',
        },
        () => {
          // Reload tasks when new update is added
          loadTasks()
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'tasks',
        },
        () => {
          // Reload tasks when new task is created
          loadTasks()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [loadTasks])

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (vendorId) {
      loadTasks()
      const cleanup = subscribeToRealtime()
      return cleanup
    }
  }, [vendorId, refreshKey, loadTasks, subscribeToRealtime])

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      setUser(user)
      // Get or create vendor profile
      let { data: vendor } = await supabase
        .from('vendors')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!vendor) {
        const { data: newVendor, error } = await supabase
          .from('vendors')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .insert({ user_id: user.id, name: user.email || 'Vendor' } as any)
          .select('id')
          .single()

        if (!error && newVendor) {
          vendor = newVendor
        }
      }

      if (vendor && 'id' in vendor) {
        setVendorId((vendor as {id: string}).id)
      }
    }
    setLoading(false)
  }

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setVendorId(null)
    setTasks([])
    setUpdates({})
  }

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
        <div className="text-center space-y-6 px-4">
          <div className="space-y-3">
            <h1 className="text-5xl font-bold text-white">Vendor Dashboard</h1>
            <p className="text-xl text-navy-300">
              Sign in to manage your service tasks
            </p>
          </div>
          <Button onClick={handleSignIn} size="lg">
            Sign In with Google
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy-50">
      {/* Header */}
      <header className="bg-white border-b border-navy-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-navy-900">Nile Dashboard</h1>
              <p className="text-sm text-navy-600">{user.email}</p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Task Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CreateTaskForm
                vendorId={vendorId!}
                onSuccess={() => setRefreshKey((k) => k + 1)}
              />
            </div>
          </div>

          {/* Task List */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-navy-900">
                Your Tasks ({tasks.length})
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRefreshKey((k) => k + 1)}
              >
                ↻ Refresh
              </Button>
            </div>
            <TaskList
              tasks={tasks}
              updates={updates}
              onUpdateAdded={() => setRefreshKey((k) => k + 1)}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

