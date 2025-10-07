'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { taskTypeConfig, type TaskType } from '@/lib/utils/task-types'
import { formatRelativeTime } from '@/lib/utils/date'
import { supabase } from '@/lib/supabase/client'

interface Task {
  id: string
  title: string
  description: string | null
  task_type: TaskType
  status: string
  created_at: string
  user_handle: string
}

interface Update {
  id: string
  message: string
  created_at: string
}

interface TaskListProps {
  tasks: Task[]
  updates: Record<string, Update[]>
  onUpdateAdded?: () => void
}

export function TaskList({ tasks, updates, onUpdateAdded }: TaskListProps) {
  const [expandedTask, setExpandedTask] = useState<string | null>(null)
  const [updateMessage, setUpdateMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAddUpdate = async (taskId: string) => {
    if (!updateMessage.trim()) return

    setLoading(true)
    try {
      const { error } = await supabase.from('updates').insert({
        task_id: taskId,
        message: updateMessage.trim(),
      } as any) // eslint-disable-line @typescript-eslint/no-explicit-any

      if (error) throw error

      setUpdateMessage('')
      setExpandedTask(null)
      onUpdateAdded?.()
    } catch (err) {
      console.error('Failed to add update:', err)
    } finally {
      setLoading(false)
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-navy-200">
        <p className="text-navy-400 text-lg">No tasks yet</p>
        <p className="text-navy-300 text-sm mt-2">Create your first task above</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const taskConfig = taskTypeConfig[task.task_type]
        const taskUpdates = updates[task.id] || []
        const isExpanded = expandedTask === task.id

        return (
          <div
            key={task.id}
            className="bg-white rounded-xl shadow-md border border-navy-200 overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-navy-900 truncate">
                    {task.title}
                  </h3>
                  <p className="text-sm text-navy-500 mt-1">
                    @{task.user_handle}
                  </p>
                </div>
                <Badge variant={taskConfig.color as 'default' | 'info' | 'success' | 'warning' | 'error' | 'orange'} icon={taskConfig.icon}>
                  {taskConfig.label}
                </Badge>
              </div>

              {task.description && (
                <p className="text-navy-600 text-sm mb-3">{task.description}</p>
              )}

              <div className="flex items-center justify-between">
                <div className="text-xs text-navy-400">
                  {taskUpdates.length} update{taskUpdates.length !== 1 ? 's' : ''}
                  {taskUpdates[0] && ` · Last ${formatRelativeTime(taskUpdates[0].created_at)}`}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                >
                  {isExpanded ? 'Cancel' : '+ Add Update'}
                </Button>
              </div>
            </div>

            {isExpanded && (
              <div className="p-5 bg-navy-50 border-t border-navy-200 animate-slide-up">
                <Textarea
                  placeholder="Enter update message..."
                  rows={3}
                  value={updateMessage}
                  onChange={(e) => setUpdateMessage(e.target.value)}
                  className="mb-3"
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setExpandedTask(null)
                      setUpdateMessage('')
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAddUpdate(task.id)}
                    disabled={loading || !updateMessage.trim()}
                  >
                    {loading ? 'Posting...' : 'Post Update'}
                  </Button>
                </div>
              </div>
            )}

            {taskUpdates.length > 0 && (
              <div className="px-5 pb-5">
                <div className="space-y-2">
                  {taskUpdates.slice(0, 2).map((update) => (
                    <div
                      key={update.id}
                      className="text-sm border-l-2 border-brand-orange pl-3 py-1"
                    >
                      <p className="text-navy-800">{update.message}</p>
                      <p className="text-navy-400 text-xs mt-0.5">
                        {formatRelativeTime(update.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

