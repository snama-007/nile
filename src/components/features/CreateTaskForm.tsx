'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { taskTypeOptions } from '@/lib/utils/task-types'
import { supabase } from '@/lib/supabase/client'

interface CreateTaskFormProps {
  vendorId: string
  onSuccess?: () => void
}

export function CreateTaskForm({ vendorId, onSuccess }: CreateTaskFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    handle: '',
    title: '',
    taskType: 'info',
    description: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Check if user handle exists, if not create it
      const { data: existingUser } = await supabase
        .from('users_public')
        .select('handle')
        .eq('handle', formData.handle)
        .single()

      if (!existingUser) {
        const { error: userError } = await supabase
          .from('users_public')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .insert({ handle: formData.handle, name: formData.handle } as any)

        if (userError) throw userError
      }

      // Create the task
      const { error: taskError } = await supabase.from('tasks').insert({
        title: formData.title,
        description: formData.description || null,
        user_handle: formData.handle,
        vendor_id: vendorId,
        task_type: formData.taskType,
        status: 'created',
      } as any) // eslint-disable-line @typescript-eslint/no-explicit-any

      if (taskError) throw taskError

      // Reset form
      setFormData({
        handle: '',
        title: '',
        taskType: 'info',
        description: '',
      })

      onSuccess?.()
    } catch (err) {
      setError((err as Error).message || 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold text-navy-900">Create New Task</h2>
        <p className="text-navy-600 text-sm mt-1">
          Assign a unique handle to your customer, then create tasks for them
        </p>
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-navy-700">
          <strong>💡 Tip:</strong> Customer will visit <span className="font-mono text-brand-orange">/handle</span> to see their tasks (e.g., /john)
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
              {error}
            </div>
          )}

          <Input
            label="Customer Handle (Unique Identifier)"
            placeholder="e.g., john123"
            value={formData.handle}
            onChange={(e) =>
              setFormData({ ...formData, handle: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })
            }
            required
          />
          {formData.handle && (
            <p className="text-xs text-navy-500 mt-1">
              ✓ Customer URL will be: <span className="font-mono text-brand-orange">/{ formData.handle}</span>
            </p>
          )}

          <Input
            label="Task Title"
            placeholder="e.g., Bella's Grooming Appointment"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <Select
            label="Task Type"
            options={taskTypeOptions}
            value={formData.taskType}
            onChange={(e) => setFormData({ ...formData, taskType: e.target.value })}
            required
          />

          <Textarea
            label="Description (Optional)"
            placeholder="Additional details about the task..."
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Create Task'}
          </Button>
        </form>
      </CardBody>
    </Card>
  )
}

