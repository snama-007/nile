export function Loading({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }
  
  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizes[size]} border-brand-orange border-t-transparent rounded-full animate-spin`}
      />
    </div>
  )
}

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-50">
      <div className="text-center space-y-4">
        <Loading size="lg" />
        <p className="text-navy-600 text-sm">Loading...</p>
      </div>
    </div>
  )
}

