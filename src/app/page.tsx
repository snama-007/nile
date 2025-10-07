'use client'

import Link from 'next/link'
import { useState } from 'react'
import { CreateHandleForm } from '@/components/features/CreateHandleForm'

// Force dynamic rendering to avoid build-time Supabase errors
export const dynamic = 'force-dynamic'

export default function Home() {
  const [showCreateHandle, setShowCreateHandle] = useState(false)

  if (showCreateHandle) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-glass-beige-50 via-glass-orange-50 to-glass-green-50 py-12 px-4 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-glass-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-glass-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-glass-beige-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-md mx-auto relative z-10">
          <button
            onClick={() => setShowCreateHandle(false)}
            className="mb-4 text-glass-beige-700 hover:text-glass-orange-600 flex items-center gap-2 transition-colors"
          >
            ← Back to home
          </button>
          <CreateHandleForm onSuccess={() => setShowCreateHandle(false)} />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-glass-beige-50 via-glass-orange-50 to-glass-green-50">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-glass-orange-400/30 to-glass-orange-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-glass-green-400/30 to-glass-green-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-glass-beige-400/30 to-glass-beige-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-3xl"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="text-center space-y-8 max-w-5xl mx-auto">
          {/* Logo/Title with glass effect */}
          <div className="space-y-6 animate-fade-in">
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-gradient-to-r from-glass-orange-500 to-glass-green-500 blur-2xl opacity-50 animate-pulse-slow"></div>
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-glass-orange-600 via-glass-beige-700 to-glass-green-600 bg-clip-text text-transparent relative animate-gradient bg-[length:200%_auto]">
                Nile
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl lg:text-3xl text-glass-beige-800 font-medium max-w-3xl mx-auto leading-relaxed">
              Real-time service updates,{' '}
              <span className="text-glass-orange-600 font-bold">delivered instantly</span>
            </p>
          </div>

          {/* Glass cards for CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <Link
              href="/dashboard-test"
              className="group relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-glass-orange-600 to-glass-orange-400 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300 animate-glow"></div>
              <div className="relative px-8 py-5 bg-white/80 backdrop-blur-xl rounded-2xl leading-none flex items-center">
                <span className="text-glass-orange-600 group-hover:text-glass-orange-700 transition duration-300 font-bold text-lg">
                  🚀 Quick Test (No Auth)
                </span>
              </div>
            </Link>

            <Link
              href="/dashboard"
              className="group relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-glass-beige-600 to-glass-beige-400 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative px-8 py-5 bg-white/60 backdrop-blur-xl rounded-2xl leading-none flex items-center border border-glass-beige-200">
                <span className="text-glass-beige-700 group-hover:text-glass-beige-900 transition duration-300 font-semibold text-lg">
                  🔐 Dashboard (With Auth)
                </span>
              </div>
            </Link>
          </div>

          {/* Create Handle Button - Premium Glass Effect */}
          <div className="pt-8">
            <button
              onClick={() => setShowCreateHandle(true)}
              className="group relative inline-flex items-center justify-center"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-glass-green-500 via-glass-orange-500 to-glass-beige-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-500 animate-gradient bg-[length:200%_auto]"></div>
              <div className="relative px-10 py-6 bg-white/90 backdrop-blur-2xl rounded-2xl leading-none flex items-center gap-3 border border-white/20 shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                <span className="text-2xl">🎯</span>
                <span className="bg-gradient-to-r from-glass-orange-600 to-glass-green-600 bg-clip-text text-transparent font-bold text-xl">
                  Create My Personal Handle
                </span>
              </div>
            </button>
          </div>
          
          {/* Feature highlights with glass cards */}
          <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="group relative overflow-hidden rounded-2xl p-6 bg-white/40 backdrop-blur-xl border border-white/20 hover:bg-white/60 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute top-0 right-0 w-20 h-20 bg-glass-orange-400 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative z-10">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="font-bold text-glass-beige-800 text-lg mb-2">For Customers</h3>
                <p className="text-glass-beige-700 text-sm">Create a handle to receive updates from your service providers</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl p-6 bg-white/40 backdrop-blur-xl border border-white/20 hover:bg-white/60 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute top-0 right-0 w-20 h-20 bg-glass-green-400 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative z-10">
                <div className="text-4xl mb-4">🏢</div>
                <h3 className="font-bold text-glass-beige-800 text-lg mb-2">For Vendors</h3>
                <p className="text-glass-beige-700 text-sm">Search for customers and send real-time service updates</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl p-6 bg-white/40 backdrop-blur-xl border border-white/20 hover:bg-white/60 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute top-0 right-0 w-20 h-20 bg-glass-beige-400 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative z-10">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="font-bold text-glass-beige-800 text-lg mb-2">Real-time</h3>
                <p className="text-glass-beige-700 text-sm">Updates appear instantly - no login required for customers!</p>
              </div>
            </div>
          </div>

          {/* Floating info badges */}
          <div className="pt-8 flex flex-wrap justify-center gap-3">
            <div className="px-4 py-2 bg-white/50 backdrop-blur-xl rounded-full border border-white/20 text-glass-beige-700 text-sm font-medium animate-float">
              🎨 Beautiful Design
            </div>
            <div className="px-4 py-2 bg-white/50 backdrop-blur-xl rounded-full border border-white/20 text-glass-beige-700 text-sm font-medium animate-float-delayed">
              ⚡ Lightning Fast
            </div>
            <div className="px-4 py-2 bg-white/50 backdrop-blur-xl rounded-full border border-white/20 text-glass-beige-700 text-sm font-medium animate-float">
              🔒 Secure & Private
            </div>
            <div className="px-4 py-2 bg-white/50 backdrop-blur-xl rounded-full border border-white/20 text-glass-beige-700 text-sm font-medium animate-float-delayed">
              📱 Mobile First
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-glass-beige-100/50 to-transparent pointer-events-none"></div>
    </main>
  )
}
