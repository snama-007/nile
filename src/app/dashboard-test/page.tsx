'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { CreateTaskForm } from '@/components/features/CreateTaskForm'
import { TaskList } from '@/components/features/TaskList'
import { Card, CardBody } from '@/components/ui/Card'
import { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']
type Update = Database['public']['Tables']['updates']['Row']

// Force dynamic rendering to avoid build-time Supabase errors
export const dynamic = 'force-dynamic'

// Test vendor ID - will be generated with real UUID
const TEST_VENDOR_ID = 'b8f3e7a2-4c9d-4e1a-8f2b-3d6c9a1e5f4b' // Realistic UUID for demo vendor

export default function DashboardTestPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [updates, setUpdates] = useState<Record<string, Update[]>>({})
  const [refreshKey, setRefreshKey] = useState(0)
  const [vendorReady, setVendorReady] = useState(false)

  // Initialize vendor on first load
  useEffect(() => {
    initializeVendor()
  }, [])

  const initializeVendor = async () => {
    try {
      // Check if test vendor exists
      const { data: existingVendor } = await supabase
        .from('vendors')
        .select('id')
        .eq('id', TEST_VENDOR_ID)
        .single()

      if (!existingVendor) {
        // Create demo vendor if doesn't exist
        const { error } = await supabase
          .from('vendors')
          .insert({
            id: TEST_VENDOR_ID,
            user_id: 'a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6', // Demo user ID
            name: 'Demo Service Provider'
          } as any) // eslint-disable-line @typescript-eslint/no-explicit-any

        if (error) {
          console.error('Error creating vendor:', error)
        }
      }
      
      setVendorReady(true)
    } catch (error) {
      console.error('Vendor initialization error:', error)
      setVendorReady(true) // Continue anyway
    }
  }

  const loadTasks = useCallback(async () => {
    const { data: tasksData } = await supabase
      .from('tasks')
      .select('*')
      .eq('vendor_id', TEST_VENDOR_ID)
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
  }, [])

  const subscribeToRealtime = useCallback(() => {
    const channel = supabase
      .channel('vendor-updates-test')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'updates',
        },
        () => {
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
          loadTasks()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [loadTasks])

  useEffect(() => {
    if (vendorReady) {
      loadTasks()
      const cleanup = subscribeToRealtime()
      return cleanup
    }
  }, [loadTasks, subscribeToRealtime, refreshKey, vendorReady])

  if (!vendorReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-50">
        <div className="text-center space-y-4">
          <div className="text-4xl mb-4">🔧</div>
          <h2 className="text-2xl font-bold text-navy-900">Setting Up Test Vendor...</h2>
          <p className="text-navy-600">This will only take a moment</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy-50">
      {/* Header */}
      <header className="bg-white border-b border-navy-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">
              Nile Dashboard - Demo Mode
            </h1>
            <p className="text-sm text-navy-600">
              Demo Service Provider • Quick testing without authentication
            </p>
          </div>
        </div>
      </header>

      {/* Info Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Card>
          <CardBody>
            <div className="flex items-start gap-3">
              <div className="text-2xl">ℹ️</div>
              <div className="flex-1">
                <h3 className="font-semibold text-navy-900 mb-1">
                  Demo Mode Active
                </h3>
                <p className="text-sm text-navy-600">
                  You&apos;re logged in as <strong>Demo Service Provider</strong>. Create tasks and updates
                  without authentication. For production with your business name, use{' '}
                  <code className="bg-navy-100 px-1 py-0.5 rounded">/dashboard</code> with sign-in.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Task Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CreateTaskForm
                vendorId={TEST_VENDOR_ID}
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
              <button
                onClick={() => setRefreshKey((k) => k + 1)}
                className="px-4 py-2 text-sm text-navy-600 hover:text-navy-900 hover:bg-navy-100 rounded-lg transition-colors"
              >
                ↻ Refresh
              </button>
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

