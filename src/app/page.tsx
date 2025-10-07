'use client'

import Link from 'next/link'
import { useState } from 'react'
import { CreateHandleForm } from '@/components/features/CreateHandleForm'
import { Button } from '@/components/ui/Button'

export default function Home() {
  const [showCreateHandle, setShowCreateHandle] = useState(false)

  if (showCreateHandle) {
    return (
      <main className="min-h-screen bg-navy-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => setShowCreateHandle(false)}
            className="mb-4 text-navy-600 hover:text-navy-900 flex items-center gap-2"
          >
            ← Back to home
          </button>
          <CreateHandleForm onSuccess={() => setShowCreateHandle(false)} />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
      <div className="text-center space-y-8 px-4">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-7xl font-bold text-white">
            Nile
          </h1>
          <p className="text-xl md:text-2xl text-navy-300 max-w-2xl mx-auto">
            Real-time service updates, delivered instantly
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/dashboard-test"
            className="px-8 py-4 bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Quick Test (No Auth)
          </Link>
          <div className="text-navy-400">or</div>
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-navy-800 hover:bg-navy-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Dashboard (With Auth)
          </Link>
        </div>
        
        <div className="pt-6">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowCreateHandle(true)}
            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            🎯 Create My Personal Handle
          </Button>
        </div>
        
        <div className="pt-8 text-navy-300 text-sm max-w-xl mx-auto">
          <p className="mb-2">💡 <strong>How it works:</strong></p>
          <ul className="text-left space-y-2 text-xs">
            <li>• <strong>Customers:</strong> Create a handle to receive updates</li>
            <li>• <strong>Vendors:</strong> Search for customer handles and send updates</li>
            <li>• <strong>Real-time:</strong> Updates appear instantly - no login required!</li>
          </ul>
        </div>

        <div className="pt-12 text-navy-400 text-sm">
          <p>Service providers • Real-time updates • No login required</p>
        </div>
      </div>
    </main>
  )
}

