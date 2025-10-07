'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { supabase } from '@/lib/supabase/client'

interface CreateHandleFormProps {
  onSuccess?: (handle: string) => void
}

export function CreateHandleForm({ onSuccess }: CreateHandleFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    handle: '',
    name: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Check if handle already exists
      const { data: existing } = await supabase
        .from('users_public')
        .select('handle')
        .eq('handle', formData.handle)
        .single()

      if (existing) {
        throw new Error('This handle is already taken. Please choose another.')
      }

      // Create the handle
      const { error: createError } = await supabase
        .from('users_public')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert({ handle: formData.handle, name: formData.name || formData.handle } as any)

      if (createError) throw createError

      setSuccess(true)
      onSuccess?.(formData.handle)
    } catch (err) {
      setError((err as Error).message || 'Failed to create handle')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card>
        <CardBody>
          <div className="text-center space-y-4 py-4">
            <div className="text-5xl">✅</div>
            <h3 className="text-2xl font-bold text-navy-900">
              Handle Created!
            </h3>
            <p className="text-navy-600">
              Your personal handle is ready
            </p>
            <div className="p-4 bg-brand-orange/10 border border-brand-orange/30 rounded-xl">
              <p className="text-sm text-navy-600 mb-2">Your URL:</p>
              <p className="text-2xl font-bold text-brand-orange font-mono">
                /{formData.handle}
              </p>
            </div>
            <div className="space-y-2">
              <Button
                onClick={() => window.open(`/${formData.handle}`, '_blank')}
                className="w-full"
              >
                View My Updates →
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setSuccess(false)
                  setFormData({ handle: '', name: '' })
                }}
                className="w-full"
              >
                Create Another Handle
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold text-navy-900">
          Create Your Handle
        </h2>
        <p className="text-navy-600 text-sm mt-1">
          Get your personal URL to receive service updates
        </p>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
              {error}
            </div>
          )}

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-navy-700">
            <p className="font-semibold mb-2">💡 What&apos;s a handle?</p>
            <p>A handle is your unique identifier (like @username). Service providers will use it to send you updates!</p>
          </div>

          <Input
            label="Your Handle"
            placeholder="e.g., john123"
            value={formData.handle}
            onChange={(e) =>
              setFormData({ 
                ...formData, 
                handle: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') 
              })
            }
            required
          />
          {formData.handle && (
            <p className="text-xs text-navy-500 -mt-3">
              ✓ Your URL will be: <span className="font-mono text-brand-orange">/{formData.handle}</span>
            </p>
          )}

          <Input
            label="Your Name (Optional)"
            placeholder="e.g., John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Button type="submit" disabled={loading || !formData.handle} className="w-full">
            {loading ? 'Creating...' : 'Create My Handle'}
          </Button>

          <p className="text-xs text-navy-500 text-center">
            Free • No account needed • Works instantly
          </p>
        </form>
      </CardBody>
    </Card>
  )
}

