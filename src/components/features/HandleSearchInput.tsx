'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'

interface HandleSearchInputProps {
  value: string
  onChange: (value: string) => void
  onSelect?: (handle: string) => void
  label?: string
  placeholder?: string
}

export function HandleSearchInput({ 
  value, 
  onChange, 
  onSelect,
  label = "Search Customer Handle",
  placeholder = "Start typing to search..."
}: HandleSearchInputProps) {
  const [suggestions, setSuggestions] = useState<Array<{ handle: string; name: string | null }>>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)

  const searchHandles = useCallback(async (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) {
      setSuggestions([])
      return
    }

    setLoading(true)
    try {
      const { data } = await supabase
        .from('users_public')
        .select('handle, name')
        .or(`handle.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%`)
        .limit(10)

      setSuggestions(data || [])
    } catch (error) {
      console.error('Search error:', error)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const debounce = setTimeout(() => {
      searchHandles(value)
    }, 300)

    return () => clearTimeout(debounce)
  }, [value, searchHandles])

  const handleSelect = (handle: string) => {
    onChange(handle)
    onSelect?.(handle)
    setShowSuggestions(false)
    setSuggestions([])
  }

  return (
    <div className="relative">
      <Input
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))
          setShowSuggestions(true)
        }}
        onFocus={() => setShowSuggestions(true)}
        required
      />

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border-2 border-navy-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {loading && (
            <div className="p-3 text-center text-navy-500 text-sm">
              Searching...
            </div>
          )}
          {suggestions.map((item) => (
            <button
              key={item.handle}
              type="button"
              onClick={() => handleSelect(item.handle)}
              className="w-full px-4 py-3 text-left hover:bg-navy-50 transition-colors border-b border-navy-100 last:border-b-0"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-navy-900">@{item.handle}</p>
                  {item.name && (
                    <p className="text-sm text-navy-600">{item.name}</p>
                  )}
                </div>
                <div className="text-brand-orange text-sm">Select →</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showSuggestions && value.length >= 2 && suggestions.length === 0 && !loading && (
        <div className="absolute z-10 w-full mt-1 bg-white border-2 border-navy-200 rounded-xl shadow-lg p-4">
          <p className="text-navy-600 text-sm text-center">
            No handles found matching &quot;{value}&quot;
          </p>
          <p className="text-navy-500 text-xs text-center mt-2">
            The customer needs to create their handle first
          </p>
        </div>
      )}
    </div>
  )
}

