'use client'

import { Badge } from '@/components/ui/Badge'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { taskTypeConfig, type TaskType } from '@/lib/utils/task-types'
import { formatRelativeTime } from '@/lib/utils/date'

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

interface TaskCardProps {
  task: Task
  updates?: Update[]
  showHandle?: boolean
}

export function TaskCard({ task, updates = [], showHandle = false }: TaskCardProps) {
  const taskConfig = taskTypeConfig[task.task_type]
  const latestUpdate = updates[0]

  return (
    <Card hover className="animate-fade-in">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-navy-900 mb-2 truncate">
              {task.title}
            </h3>
            {showHandle && (
              <p className="text-sm text-navy-500 mb-2">
                @{task.user_handle}
              </p>
            )}
            {task.description && (
              <p className="text-navy-600 text-sm leading-relaxed">
                {task.description}
              </p>
            )}
          </div>
          <Badge variant={taskConfig.color as 'default' | 'info' | 'success' | 'warning' | 'error' | 'orange'} icon={taskConfig.icon}>
            {taskConfig.label}
          </Badge>
        </div>
      </CardHeader>

      {updates.length > 0 && (
        <CardBody>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-navy-700 uppercase tracking-wide">
              Recent Updates
            </h4>
            <div className="space-y-3">
              {updates.slice(0, 3).map((update) => (
                <div
                  key={update.id}
                  className="flex gap-3 text-sm border-l-2 border-brand-orange pl-4 py-1"
                >
                  <div className="flex-1">
                    <p className="text-navy-800">{update.message}</p>
                    <p className="text-navy-400 text-xs mt-1">
                      {formatRelativeTime(update.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardBody>
      )}

      {!latestUpdate && (
        <CardBody>
          <p className="text-sm text-navy-400 italic">No updates yet</p>
        </CardBody>
      )}
    </Card>
  )
}

